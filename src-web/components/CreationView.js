/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../lib/shared/resources'
import { Loading, Notification, TextInput, Checkbox, TooltipIcon, MultiSelect, InlineNotification } from 'carbon-components-react'
import { parse } from '../../lib/client/design-helper'
import { initialTemplateData, getMultiSelectData, getPolicyYAML, setCustomPolicyData, getCreateErrors, highliteDifferences  } from '../util/creation-helper'
import { validator } from '../validators/policy-validator'
import { hideResourceToolbar } from '../../lib/client/resource-helper'
import EditorBar from './common/EditorBar'
import YamlEditor from './common/YamlEditor'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../scss/creation-view.scss')
})

export default class CreationView extends React.Component {

  static getDerivedStateFromProps(props, state) {
    const {loading, mutateErrorMsg, mutateStatus} = props
    if (mutateStatus === 'ERROR') {
      return {updateMsgKind: 'error', updateMessage: mutateErrorMsg}
    } else if (!loading) {
      const { existing } = props
      if (!state.multiSelectData) {
        const multiSelectData = getMultiSelectData(existing)
        return {multiSelectData}
      }
    }
    return null
  }

  constructor (props) {
    super(props)
    // active values in controls and used to render templates
    const templateData = _.cloneDeep(initialTemplateData)
    // rendered template
    const policyYAML = getPolicyYAML(templateData)
    // parsed template
    const parsedPolicy = parse(policyYAML).parsed
    this.state = {
      templateData,
      isCustomName: false,
      policyYAML,
      parsedPolicy,
      exceptions: [],
      updateMessage: '',
      hasUndo: false,
      hasRedo: false,
    }
    this.multiSelectCmpMap = {}
    this.parseDebounced = _.debounce(()=>{
      this.handleParse()
    }, 500)
    this.handleEditorCommand = this.handleEditorCommand.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.gotoEditorLine = this.gotoEditorLine.bind(this)
    props.setResetNewPolicy(this.resetEditor.bind(this))
    props.setGetPolicyJSON(this.getPolicyJSON.bind(this))
  }

  render() {
    const { locale } = this.context
    const { loading, error } = this.props
    hideResourceToolbar()

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    return (
      <div className='creation-view'>
        {this.renderControls()}
        {this.renderYAML()}
      </div>
    )
  }

  renderControls() {
    const { locale } = this.context
    const { templateData: {name} } = this.state
    return (
      <div className='creation-view-controls-container' >
        <div className='creation-view-controls' >
          <div className='creation-view-controls-textbox'>
            <div className="creation-view-controls-textbox-title">
              {msgs.get('creation.view.policy.name', locale)}
            </div>
            <TextInput
              id={'policy-name'}
              hideLabel
              labelText=''
              value={name}
              onChange={this.onChange.bind(this, 'name')} />
          </div>
          {this.renderMultiselect('validations', 'specs')}
          {this.renderMultiselect('bindings', 'selectors')}
          {this.renderCheckbox('enforce', 'enforce')}
          {this.renderMultiselect('annotations', 'standards')}
          {this.renderMultiselect('annotations', 'categories')}
          {this.renderMultiselect('annotations', 'controls')}
        </div>
      </div>
    )
  }

  renderCheckbox(templateKey, checkboxKey) {
    const { locale } = this.context
    const { templateData } = this.state
    const active = templateData[templateKey]
    return (
      <React.Fragment>
        <div className='creation-view-controls-checkbox'>
          <Checkbox
            id={`policy-${templateKey}`}
            className='checkbox'
            hideLabel
            labelText=''
            checked={active}
            onChange={this.onChange.bind(this, checkboxKey)} />
          <div>{msgs.get(`creation.view.policy.${checkboxKey}`, locale)}</div>
          <TooltipIcon direction='top' tooltipText={'TBD'}>
            <svg className='info-icon'>
              <use href={'#diagramIcons_info'} ></use>
            </svg>
          </TooltipIcon>
        </div>
      </React.Fragment>
    )
  }

  renderMultiselect(templateKey, multiSelectKey) {
    const { locale } = this.context

    // get what's available from:
    //  1) hard coded values in creation-helper
    //  2) the policies that exist on cluster hub
    //  3) any custom changes user has made to policy in editor
    let available = []
    const { multiSelectData={}, userMultiSelectData={} } = this.state
    available = multiSelectData[multiSelectKey]
    if (userMultiSelectData[multiSelectKey]) {
      available = [...userMultiSelectData[multiSelectKey], ...available]
    }

    // get what's currently active from templateData
    const { templateData } = this.state
    const data = templateData[templateKey]
    const dataMap = _.keyBy(data, 'name')
    let active = dataMap[multiSelectKey].values
    let activeKeys = active

    // special case for validation specs
    if (multiSelectKey==='specs' && available) {
      if (!userMultiSelectData.customValidations) {
        available = available.map(spec=>spec.key)
        activeKeys = active.map(spec=>{
          const idx = spec.indexOf('-')
          return (idx!==-1) ? spec.substr(0, idx) : spec
        })
      } else {
        active = activeKeys = available = [msgs.get('creation.view.policy.custom', locale)]
      }
    }

    // change key if active changes so that carbon component is re-created with new initial values
    const key = multiSelectKey + active.join('-')

    return (
      <React.Fragment>
        <div className='creation-view-controls-multiselect'>
          <div className="creation-view-controls-multiselect-title">
            {msgs.get(`creation.view.policy.${multiSelectKey}`, locale)}
            <TooltipIcon direction='top' tooltipText={'TBD'}>
              <svg className='info-icon'>
                <use href={'#diagramIcons_info'} ></use>
              </svg>
            </TooltipIcon>
          </div>
          <MultiSelect.Filterable
            key={key}
            items={available}
            sortItems={this.sortMultiSelectItems.bind(this, multiSelectKey)}
            initialSelectedItems={active}
            placeholder={active.length===0 ?
              msgs.get(`creation.view.policy.select.${multiSelectKey}`, locale) :
              activeKeys.join(', ')}
            itemToString={item=>item}
            ref={this.setMultiSelectCmp.bind(this, multiSelectKey)}
            onChange={this.onChange.bind(this, multiSelectKey)} />
        </div>
      </React.Fragment>
    )
  }

  sortMultiSelectItems = (multiSelectKey, items) => {
    return multiSelectKey==='selectors' ? items : items.sort()
  }

  renderYAML() {
    const { locale } = this.context
    const { policyYAML, hasUndo, hasRedo, exceptions, updateMessage, updateMsgKind } = this.state
    const editorToolbarTitle = msgs.get('editor.toolbar', this.context.locale)

    return (
      <div className='creation-view-yaml' >
        <div className='creation-view-yaml-header' >
          <div className='creation-view-yaml-header-title'>
            {msgs.get('creation.view.yaml', locale)}
          </div>
          <div className='creation-view-yaml-header-toolbar' role='region' aria-label={editorToolbarTitle} id={editorToolbarTitle}>
            <EditorBar
              hasUndo={hasUndo}
              hasRedo={hasRedo}
              exceptions={exceptions}
              gotoEditorLine={this.gotoEditorLine}
              handleEditorCommand={this.handleEditorCommand}
              handleSearchChange={this.handleSearchChange}
            />
          </div>
        </div>
        {updateMessage &&
          <div className='creation-view-yaml-notification' >
            <InlineNotification
              key={updateMessage}
              kind={updateMsgKind}
              title={updateMsgKind==='error' ?
                msgs.get('error.create.policy', locale) :
                msgs.get('success.create.policy', locale) }
              iconDescription=''
              subtitle={updateMessage}
              onCloseButtonClick={this.handleUpdateMessageClosed}
            />
          </div>}
        <YamlEditor
          width={'100%'}
          height={'100%'}
          wrapEnabled={true}
          setEditor={this.setEditor}
          onYamlChange={this.handleEditorChange}
          yaml={policyYAML} />
      </div>
    )
  }


  onChange(field, evt) {
    // change template data directly
    let updateName = false
    let { isCustomName } = this.state
    const { templateData, policyYAML, userMultiSelectData } = this.state
    const annotationMap = _.keyBy(templateData.annotations, 'name')
    const validationsMap = _.keyBy(templateData.validations, 'name')
    const selectorsMap = _.keyBy(templateData.bindings, 'name')
    switch (field) {
    case 'name':
      templateData[field] = evt.target.value
      isCustomName = true
      break

    case 'enforce':
      templateData[field] = evt
      break

    case 'standards':
    case 'categories':
    case 'controls':
      annotationMap[field].values = evt.selectedItems
      break

    case 'specs':
      validationsMap[field].values = evt.selectedItems
      if (userMultiSelectData) {
        userMultiSelectData.customValidations = false
      }
      delete templateData.customValidations
      updateName = !isCustomName
      break

    case 'selectors':
      selectorsMap[field].values = evt.selectedItems
      break
    }

    // update name if spec changed
    if (updateName) {
      const specs = _.get(validationsMap, 'specs.values')
      if (specs.length>0 && specs[0].indexOf('-')!==-1) {
        templateData['name'] = `policy-${specs[0].substr(0, specs[0].indexOf('-')).toLowerCase()}`
      }
    }

    // close multiselect menus
    if (this.multiSelectCmpMap[field]) {
      this.multiSelectCmpMap[field].handleOnOuterClick()
    }
    const newYAML = getPolicyYAML(templateData)
    const parsedPolicy = parse(newYAML).parsed
    this.setState({templateData, isCustomName, policyYAML: newYAML, parsedPolicy, userMultiSelectData})
    highliteDifferences(this.editor, policyYAML, newYAML)
  }

  setMultiSelectCmp(field, ref) {
    this.multiSelectCmpMap[field] = ref
  }


  setEditor = (editor) => {
    this.editor = editor
    this.layoutEditors()
    this.selectTextLine = this.selectTextLine.bind(this)
    this.selectAfterRender = true
    this.editor.renderer.on('afterRender', this.selectTextLine)
    this.editor.on('input', () => {
      const undoManager = this.editor.session.getUndoManager()
      if (this.resetUndoManager) {
        delete this.resetUndoManager
        undoManager.reset()
      }
      const hasUndo = undoManager.hasUndo()
      const hasRedo = undoManager.hasRedo()
      this.setState({hasUndo, hasRedo})
    })
  }

  layoutEditors() {
    if (this.editor) {
      this.editor.resize()
      this.editor.setAnimatedScroll(false)
      const cursor = this.editor.selection.getCursor()
      this.editor.scrollToLine(cursor.row, true)
    }
  }


  // select text editor line associated with selected node/link
  selectTextLine() {
    if (this.editor) {
      if (this.selectAfterRender) {
        this.editor.scrollToLine(0)
        this.editor.selection.moveCursorToPosition({row: 0, column: 0})
        this.editor.renderer.off('afterRender', this.selectTextLine)
        delete this.selectAfterRender
      }
    }
  }

  gotoEditorLine(line) {
    this.editor.renderer.STEPS = 25
    this.editor.setAnimatedScroll(true)
    this.editor.scrollToLine(line, true)
    this.editor.selection.moveCursorToPosition({row: line, column: 0})
    this.editor.selection.selectLine()
  }

  // text editor commands
  handleEditorCommand(command) {
    switch (command) {
    case 'next':
    case 'previous':
      if (this.selectionIndex!==-1) {
        if (this.selectionRanges.length>1) {
          switch (command) {
          case 'next':
            this.selectionIndex++
            if (this.selectionIndex>=this.selectionRanges.length) {
              this.selectionIndex = 0
            }
            break
          case 'previous':
            this.selectionIndex--
            if (this.selectionIndex<0) {
              this.selectionIndex = this.selectionRanges.length-1
            }
            break
          }
          const range = this.selectionRanges[this.selectionIndex]
          this.editor.selection.setRange(range, true)
          this.editor.scrollToLine(range.start.row, true)
        }
      }
      break
    case 'undo':
      this.editor.undo()
      break
    case 'redo':
      this.editor.redo()
      break
    case 'restore':
      this.resetEditor()
      break
    case 'update':
      this.updateResources()
      break
    }
  }

  handleSearchChange(searchName) {
    if (searchName.length>1 || this.nameSearchMode) {
      this.editor.exitMultiSelectMode()
      if (searchName) {
        const found = this.editor.findAll(searchName)
        if (found>0) {
          const {start: {row}} = this.editor.getSelectionRange()
          this.editor.setAnimatedScroll(true)
          this.editor.scrollToLine(row, true)
          this.selectionRanges = this.editor.selection.getAllRanges()
          this.selectionIndex = 0
        }
      } else {
        this.selectionIndex = -1
      }
      this.nameSearch = searchName
      this.nameSearchMode = searchName.length>0
    }
  }

  handleEditorChange = (policyYAML) => {
    this.setState({policyYAML})
    delete this.resetUndoManager
    this.parseDebounced()
  }

  handleParse = () => {
    let { isCustomName } = this.state
    const { policyYAML, multiSelectData, parsedPolicy } = this.state
    let { templateData } = this.state
    const { parsed: newParsed, exceptions} = parse(policyYAML, validator, this.context.locale)

    // update editor annotations
    this.editor.session.setAnnotations(exceptions)

    // if no exceptions, update templateData and userMultiSelectData based on custom editting
    // (userMultiSelectData is multiselect's choices)
    const userMultiSelectData = {}
    if (newParsed.Policy!==undefined) {
      templateData = Object.assign({}, templateData)
      setCustomPolicyData(parsedPolicy, newParsed, templateData, multiSelectData, userMultiSelectData)

      // did user change name??
      isCustomName = isCustomName ||
      _.get(newParsed, 'Policy[0].$raw.metadata.name') !==
        _.get(parsedPolicy, 'Policy[0].$raw.metadata.name')
    }
    this.setState({templateData, isCustomName, parsedPolicy: newParsed, userMultiSelectData, exceptions})
  }

  handleUpdateMessageClosed = () => this.setState({ updateMessage: '' })

  getPolicyJSON() {
    const { locale } = this.context
    const { policyYAML } = this.state
    let errorMsg = null
    const { parsed, exceptions } = parse(policyYAML, validator, locale)
    if (exceptions.length>0) {
      errorMsg = exceptions[0].text
    }
    if (!errorMsg) {
      const { existing } = this.props
      errorMsg = getCreateErrors(parsed, existing, locale)
    }
    this.setState({updateMsgKind: errorMsg?'error':'success', updateMessage: errorMsg||msgs.get('success.create.policy.check', locale)})
    if (!errorMsg) {
      const payload = []
      payload.push(parsed.Policy[0].$raw)
      if (parsed.PlacementPolicy) {
        payload.push(parsed.PlacementPolicy[0].$raw)
      }
      payload.push(parsed.PlacementBinding[0].$raw)
      return payload
    }
    return null
  }

  resetEditor() {
    const templateData = _.cloneDeep(initialTemplateData)
    const policyYAML = getPolicyYAML(templateData)
    this.setState({ templateData, policyYAML, exceptions:[], hasUndo: false, hasRedo: false})
    this.resetUndoManager = true
  }
}

CreationView.propTypes = {
  error: PropTypes.object,
  existing: PropTypes.object,
  loading: PropTypes.bool,
  setGetPolicyJSON: PropTypes.func,
  setResetNewPolicy: PropTypes.func,
}
