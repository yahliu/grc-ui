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
import {diffLines} from 'diff'
import resources from '../../lib/shared/resources'
import { TextInput, Checkbox, TooltipIcon, MultiSelect, InlineNotification } from 'carbon-components-react'
import { parse } from '../../lib/client/design-helper'
import { validator } from './validators/policy-validator'
import { hideResourceToolbar } from '../../lib/client/resource-helper'
import EditorBar from './common/EditorBar'
import YamlEditor from './common/YamlEditor'
import policyHeader from './templates/policy-header.handlebars'
import policyMutation from './templates/policy-mutation.handlebars'
import policyPodExists from './templates/policy-pod-exists.handlebars'
import policyPodRole from './templates/policy-pod-role.handlebars'
import policyPodSecurity from './templates/policy-pod-security.handlebars'
import policyPodNetwork from './templates/policy-pod-network.handlebars'
import policyPodLimit from './templates/policy-pod-limit.handlebars'
import policyRoles from './templates/policy-roles.handlebars'
import policyRolesPods from './templates/policy-roles-pods.handlebars'
import policyRolesSecrets from './templates/policy-roles-secrets.handlebars'
import policyRolesDeployments from './templates/policy-roles-deployments.handlebars'
import policyBindings from './templates/policy-bindings.handlebars'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'
import config from '../../lib/shared/config'

resources(() => {
  require('../../scss/creation-view.scss')
})

const intialValues = {
  name: 'my-policy',
  namespace: config.complianceNamespace,
  enforce: true,
  mutation: false,
  annotations: [
    {name: 'standards', values: []},
    {name: 'categories', values: []},
    {name: 'controls', values: []},
  ],
  validations: [
    {name: 'roles', values: []},
  ],
  bindings: [
    {name: 'selectors', values: []},
  ],
}

const initalAnnotations = {
  standards: ['NIST', 'PCI', 'FISMA', 'HIPAA', 'BSA'],
  categories: ['SystemAndCommunicationsProtections','SystemAndInformationIntegrity'],
  controls: ['MutationAdvisor','VA'],
}
const roles = ['mutation', 'deployments', 'pods', 'secrets', 'exists', 'role', 'security', 'network', 'limits']
const selectors = ['cloud: "IBM"', 'env: "Dev"']

export default class CreationView extends React.Component {

  constructor (props) {
    super(props)
    const {standards, categories, controls} = Object.assign({}, initalAnnotations)
    this.state = {
      annotations: {standards, categories, controls},
      currentParsed: Object.assign({}, intialValues),
      currentYaml: this.getYAML(intialValues),
      exceptions: [],
      userSelected: {},
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
    props.setGetPolicyJSON(this.getPolicyJSON.bind(this))
  }


  componentWillReceiveProps(nextProps) {
    const { locale } = this.context
    const {mutateErrorMsg, mutateStatus} = nextProps
    if (mutateStatus === 'ERROR') {
      this.setState({updateMsgKind: 'error', updateMessage: mutateErrorMsg||msgs.get('success.create.policy.check', locale)})
    }
  }

  render() {
    hideResourceToolbar()
    return (
      <div className='creation-view'>
        {this.renderControls()}
        {this.renderYAML()}
      </div>
    )
  }

  renderControls() {
    const { locale } = this.context
    const {currentParsed: {name}, annotations: {standards, categories, controls}} = this.state
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
          {this.renderMultiselect('validations', 'roles', roles)}
          {this.renderMultiselect('bindings', 'selectors', selectors)}
          {this.renderCheckbox('enforce')}
          {this.renderMultiselect('annotations', 'standards', standards)}
          {this.renderMultiselect('annotations', 'categories', categories)}
          {this.renderMultiselect('annotations', 'controls', controls)}
        </div>
      </div>
    )
  }

  renderCheckbox(key) {
    const { locale } = this.context
    const { currentParsed } = this.state
    const active = currentParsed[key]
    return (
      <React.Fragment>
        <div className='creation-view-controls-checkbox'>
          <Checkbox
            id={`policy-${key}`}
            className='checkbox'
            hideLabel
            checked={active}
            onChange={this.onChange.bind(this, key)} />
          <div>{msgs.get(`creation.view.policy.${key}`, locale)}</div>
          <TooltipIcon direction='top' tooltipText={'TBD'}>
            <svg className='info-icon'>
              <use href={'#diagramIcons_info'} ></use>
            </svg>
          </TooltipIcon>
        </div>
      </React.Fragment>
    )
  }

  renderMultiselect(parsedKey, key, available) {
    const { locale } = this.context
    const { currentParsed } = this.state
    const parsed = currentParsed[parsedKey]
    const parsedMap = _.keyBy(parsed, 'name')
    const active = parsedMap[key].values
    const itemToString = item => {
      if (parsedKey === 'validations') {
        return msgs.get(`creation.view.policy.choice.${item}`, locale)
      } else {
        return item
      }
    }
    return (
      <React.Fragment>
        <div className='creation-view-controls-multiselect'>
          <div className="creation-view-controls-multiselect-title">
            {msgs.get(`creation.view.policy.${key}`, locale)}
            <TooltipIcon direction='top' tooltipText={'TBD'}>
              <svg className='info-icon'>
                <use href={'#diagramIcons_info'} ></use>
              </svg>
            </TooltipIcon>
          </div>
          <MultiSelect.Filterable
            items={available}
            initialSelectedItems={active}
            placeholder={active.length===0 ?
              msgs.get(`creation.view.policy.select.${key}`, locale) :
              active.join(', ')}
            itemToString={itemToString}
            ref={this.setMultiSelectCmp.bind(this, key)}
            onChange={this.onChange.bind(this, key)} />
        </div>
      </React.Fragment>
    )
  }

  renderYAML() {
    const { locale } = this.context
    const { currentYaml, hasUndo, hasRedo, exceptions, updateMessage, updateMsgKind } = this.state
    const editorToolbarTitle = msgs.get('eitor.toolbar', this.context.locale)

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
          yaml={currentYaml} />
      </div>
    )
  }


  onChange(field, evt) {
    const { currentParsed, currentYaml, userSelected } = this.state
    const annotationMap = _.keyBy(currentParsed.annotations, 'name')
    const validationsMap = _.keyBy(currentParsed.validations, 'name')
    const selectorsMap = _.keyBy(currentParsed.bindings, 'name')
    switch (field) {
    case 'name':
    case 'namespace':
      currentParsed[field] = evt.target.value
      break

    case 'enforce':
      currentParsed[field] = evt
      break

    case 'standards':
    case 'categories':
    case 'controls':
      annotationMap[field].values = userSelected[field] = evt.selectedItems
      break

    case 'roles':
      validationsMap[field].values = evt.selectedItems
      break

    case 'selectors':
      selectorsMap[field].values = evt.selectedItems
      break
    }
    if (this.multiSelectCmpMap[field]) {
      this.multiSelectCmpMap[field].handleOnOuterClick()
    }
    this.setState({currentParsed, userSelected, currentYaml: this.getYAML(currentParsed, currentYaml)})
  }


  setMultiSelectCmp(field, ref) {
    this.multiSelectCmpMap[field] = ref
  }


  getYAML(values, currentYaml) {
    // failure to load templates?
    if (typeof policyHeader!=='function') {
      return ''
    }

    const {  validations } = values
    const validationsMap = _.keyBy(validations, 'name')
    const rolesSet = new Set(validationsMap['roles'].values)

    // policy header
    let yaml = policyHeader(Object.assign({}, values))

    // policy-templates
    if (rolesSet.has('mutation')) {
      yaml = yaml.concat(
        '  policy-templates:\n',
        policyMutation(Object.assign({}, values))
      )
    }

    // pod-templates
    if (rolesSet.has('exists') || rolesSet.has('role') ||
      rolesSet.has('security') || rolesSet.has('network') ||
      rolesSet.has('limits')) {
      yaml = yaml.concat('  object-templates:\n')
      if (rolesSet.has('exists')) {
        yaml = yaml.concat(policyPodExists(Object.assign({}, values)))
      }
      if (rolesSet.has('role')) {
        yaml = yaml.concat(policyPodRole(Object.assign({}, values)))
      }
      if (rolesSet.has('security')) {
        yaml = yaml.concat(policyPodSecurity(Object.assign({}, values)))
      }
      if (rolesSet.has('network')) {
        yaml = yaml.concat(policyPodNetwork(Object.assign({}, values)))
      }
      if (rolesSet.has('limits')) {
        yaml = yaml.concat(policyPodLimit(Object.assign({}, values)))
      }
    }

    // role-templates
    if (rolesSet.has('deployments') || rolesSet.has('pods') || rolesSet.has('secrets')) {
      yaml = yaml.concat('  role-templates:\n',
        policyRoles(Object.assign({}, values)))
      if (rolesSet.has('deployments')) {
        yaml = yaml.concat(policyRolesDeployments(Object.assign({}, values)))
      }
      if (rolesSet.has('pods')) {
        yaml = yaml.concat(policyRolesPods(Object.assign({}, values)))
      }
      if (rolesSet.has('secrets')) {
        yaml = yaml.concat(policyRolesSecrets(Object.assign({}, values)))
      }
    }

    // policy bindings
    yaml = yaml.concat(
      policyBindings(Object.assign({}, values)),
    )

    // mark any modified/added lines in editor
    if (currentYaml) {
      const ranges=[]
      let row=0
      let firstRow=undefined
      const range = this.editor.getSelectionRange()
      diffLines(currentYaml, yaml)
        .filter((diff, idx, diffs) =>{
          const {count, removed} = diff
          if (removed && count===1 && idx-1<diffs.length) {
            const nextDiff = diffs[idx+1]
            if (nextDiff) {
              const {count:c, added} = nextDiff
              if (added && c===1) {
                nextDiff.modified = true
                delete nextDiff.added
                return false
              }
            }
          }
          return true
        })
        .forEach(({count, value, added, removed, modified})=>{
          if (added || modified) {
            const r = Object.create(range)
            let column = modified ? value.indexOf(':')+1 : 0
            if (modified && value[column]===' ') column++
            const endRow = modified ? row : row+count-1
            r.start = {row, column}
            r.end = {row: endRow, column: 200}
            ranges.push(r)
            if (!firstRow) {
              firstRow = row
            }
            row+=count
          } else if (removed) {
            row-=count
          } else {
            row+=count
          }
        })
      setTimeout(() => {
        if (ranges.length) {
          const selection = this.editor.multiSelect
          selection.toSingleRange(ranges[0])
          for (var i = ranges.length; i--; ) {
            selection.addRange(ranges[i], true)
          }
        } else {
          this.editor.selection.clearSelection()
        }
      }, 0)
      if (firstRow) {
        this.editor.setAnimatedScroll(true)
        this.editor.scrollToLine(firstRow, true)
      }
    }
    return yaml
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

  handleEditorChange = (currentYaml) => {
    this.setState({currentYaml})
    delete this.resetUndoManager
    this.parseDebounced()
  }

  handleParse = () => {
    const { currentYaml, currentParsed, annotations, userSelected } = this.state
    const { parsed: customParsed, exceptions} = parse(currentYaml, validator, this.context.locale)

    // update editor annotations
    this.editor.session.setAnnotations(exceptions)

    // update current parsed with selected yaml changes
    let newParsed = currentParsed
    let newAnnotes = annotations
    if (exceptions.length===0) {
      newParsed = Object.assign({}, newParsed)
      newAnnotes = Object.assign({}, newAnnotes)
      const {$raw: {metadata: {name, annotations: annotes}, spec:{remediationAction}}} = customParsed.Policy[0]
      newParsed.name = name
      newParsed.enforce = remediationAction==='enforce'
      const keys = ['standards', 'categories', 'controls']
      const annotationMap = _.keyBy(newParsed.annotations, 'name')
      keys.forEach(key=>{
        let values = annotes[`policy.mcm.ibm.com/${key}`]
        if (values) {
          values = values.split(',').map((item) => {
            return item.trim()
          }).filter(v=>{return v!==''})
          // update available
          newAnnotes[key] = [...new Set(initalAnnotations[key].concat(values))]
          // update selected
          annotationMap[key].values = [...new Set((userSelected[key]||[]).concat(values))]
        }
      })
    }

    // update editor toolbar
    this.setState({currentParsed:newParsed, annotations:newAnnotes, exceptions})
  }

  handleUpdateMessageClosed = () => this.setState({ updateMessage: '' })

  getPolicyJSON() {
    const { locale } = this.context
    const { currentYaml } = this.state
    let errorMsg = null
    const { parsed, exceptions } = parse(currentYaml, validator, locale)
    if (exceptions.length>0) {
      errorMsg = msgs.get('error.create.policy.exceptions', locale)
    }
    if (!errorMsg) {
      const {$raw: {metadata: {name}, spec={}}} = parsed.Policy[0]
      const matchLabels = _.get(parsed.PlacementPolicy[0], '$raw.spec.clusterLabels.matchLabels')
      if (!name) {
        errorMsg = msgs.get('error.create.policy.noname', locale)
      } else if (!spec['policy-templates'] && !spec['object-templates'] && !spec['role-templates']) {
        errorMsg = msgs.get('error.create.policy.novalidation', locale)
      } else if (!matchLabels) {
        errorMsg = msgs.get('error.create.policy.nobinding', locale)
      }
    }
    this.setState({updateMsgKind: errorMsg?'error':'success', updateMessage: errorMsg||msgs.get('success.create.policy.check', locale)})
    if (!errorMsg) {
      const payload = []
      payload.push(parsed.Policy[0].$raw)
      payload.push(parsed.PlacementPolicy[0].$raw)
      payload.push(parsed.PlacementBinding[0].$raw)
      return payload
    }
    return null
  }

  resetEditor() {
    this.setState({ currentYaml:this.getYAML(), exceptions:[], hasUndo: false, hasRedo: false})
    this.resetUndoManager = true
  }
}

CreationView.propTypes = {
  mutateErrorMsg: PropTypes.string,
  mutateStatus: PropTypes.string,
  setGetPolicyJSON: PropTypes.func,
}
