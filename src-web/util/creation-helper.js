/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import {diffTrimmedLines} from 'diff'
import * as Templates from '../templates'
import policyHeader from '../templates/policy-header.handlebars'
import policyBindings from '../templates/policy-bindings.handlebars'
import policyExistingBinding from '../templates/policy-bindings-existing.handlebars'
import config from '../../lib/shared/config'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'


export const initialTemplateData = {
  name: 'policy-grc',
  namespace: config.complianceNamespace,
  enforce: false,
  mutation: false,
  annotations: [
    {name: 'standards', values: []},
    {name: 'categories', values: []},
    {name: 'controls', values: []},
  ],
  validations: [
    {name: 'specs', values: []},
  ],
  bindings: [
    {name: 'selectors', values: []},
  ],
}

const initalAnnotations = {
  standards: ['NIST', 'PCI', 'FISMA', 'HIPAA'],
  categories: ['SystemAndCommunicationsProtections','SystemAndInformationIntegrity'],
  controls: ['MutationAdvisor','VA'],
}

const specs = Object.values(Templates).map(template => {
  const value = template.call()
  let kindDes = value.match(/kind:(.*) #(.*)/)
  let type = ''
  if (value.match(/apiVersion: roletemplate.mcm.ibm.com\/v1alpha1/g)) { // role-templates
    type = 'role-templates'
    kindDes = value.match(/apiVersion:(.*)template.mcm.ibm.com\/v1alpha1 #(.*)/)
  } else if (value.match(/complianceType/g)) { // object-templates
    type = 'object-templates'
  } else { // policy-templates
    type = 'policy-templates'
  }
  return { key: `${_.capitalize(kindDes[1].trim())}-${kindDes[2].trim()}`, kind: _.capitalize(kindDes[1].trim()), description: kindDes[2].trim(), value, type}
})

///////////////////////////////////////////////////////////////////////////////////////////
const multiSelectKeys = ['specs', 'selectors', 'standards', 'categories', 'controls']

export const getMultiSelectData = (existing={}) => {
  const multiSelectData={} // what's available for multi select
  const {compliances=[]} = existing
  const existingAnnotations = getAnnotations(compliances.map(({annotations})=>{return annotations}))
  multiSelectKeys.forEach(key=>{
    switch (key) {
    case 'specs':
      multiSelectData[key] = specs
      break
    case 'selectors':
      multiSelectData[key] = getSelectorData(existing)
      break
    case 'standards':
    case 'categories':
    case 'controls':
      multiSelectData[key] = getAnnotationData(key, existingAnnotations)
      break
    }
  })
  return multiSelectData
}

const getSelectorData = (existing) => {
  const available = new Set()
  const {clusterLabels=[], placements=[]} = existing
  placements.forEach(({name})=>{
    available.add(name)
  })
  clusterLabels.forEach(({key, value}) => {
    available.add(`${key}: "${value}"`)
  })
  return  Array.from(available)
}

const getAnnotationData = (field, existingAnnotations) => {
  const available = new Set([...initalAnnotations[field], ...existingAnnotations[field]])
  return Array.from(available)
}

const getAnnotations = (annotations) => {
  const ret = {}
  Object.keys(initalAnnotations).forEach(key=>{
    ret[key] = new Set()
    annotations.forEach(annotation=>{
      const types= annotation[`policy.mcm.ibm.com/${key}`] || ''
      types.split(',').forEach(type=>{
        type=type.trim()
        if (type) {
          ret[key].add(type)
        }
      })
    })
  })
  return ret
}

///////////////////////////////////////////////////////////////////////////////////////////
export const getPolicyYAML = (templateData) => {
  // failure to load Templates?
  if (typeof policyHeader!=='function') {
    return ''
  }

  // policy header
  let yaml = policyHeader(Object.assign({}, templateData))

  // validations
  if (templateData.customValidations) {
    // user customize validations
    yaml += templateData.customValidations
  } else {
    // use template validation(s)
    const { validations } = templateData
    // sort array for yaml concatenation
    const validationsArray = _.keyBy(validations, 'name')['specs'].values.sort((a,b)=>{
      const specA = specs.find(spec=>spec.key===a)
      const specB = specs.find(spec=>spec.key===b)
      return specA.type > specB.type ? 1 : specA.type < specB.type ? -1 : 0
    })

    validationsArray.forEach(validation => {
      const spec = specs.find(spec=>spec.key===validation)
      if (spec.type === 'role-templates') { // role-templates
        if (yaml.match(/role-templates:/) == null) {
          yaml = yaml.concat('  role-templates:\n')
        }
      } else if (spec.type === 'object-templates') { // object-templates
        if (yaml.match(/object-templates:/) == null) {
          yaml = yaml.concat('  object-templates:\n')
        }
      } else { // policy-templates
        if (yaml.match(/policy-templates:/) == null) {
          yaml = yaml.concat('  policy-templates:\n')
        }
      }
      yaml = yaml.concat(spec.value)
    })
  }

  // policy bindings
  const bindings = _.get(templateData, 'bindings[0].values')
  if (bindings.length>0 && bindings[0].indexOf(':')===-1) {
    yaml = yaml.concat(
      policyExistingBinding(Object.assign({existing: bindings[0]}, templateData)),
    )
  } else {
    yaml = yaml.concat(
      policyBindings(Object.assign({}, templateData)),
    )
  }
  //

  return yaml
}


/////////////////////////////////////////////////////////////////////////////////

export const setCustomPolicyData = (oldParsed, newParsed, templateData, multiSelectData, userMultiSelectData) => {
  const {$raw: {metadata: {name, annotations}, spec:{remediationAction}}} = newParsed.Policy[0]
  Object.keys(templateData).forEach(key=>{
    switch (key) {
    case 'name':
      templateData.name = name
      break

    case 'enforce':
      templateData.enforce = remediationAction==='enforce'
      break

    case 'validations':
      setCustomValidationData(oldParsed, newParsed, templateData, multiSelectData, userMultiSelectData)
      break

    case 'annotations':
      setCustomAnnotationsData(annotations, templateData, multiSelectData, userMultiSelectData)
      break
    case 'bindings':
      setCustomSelectorData(newParsed, templateData, multiSelectData, userMultiSelectData)
      break
    }
  })
}

// determine if user has manually edited the specs
const setCustomValidationData = (oldParsed, newParsed, templateData, multiSelectData, userMultiSelectData) => {
  const oldSpec = _.get(oldParsed, 'Policy[0].$raw.spec')
  const newSpec = _.get(newParsed, 'Policy[0].$raw.spec')
  if (oldSpec && newSpec) {
    // did user delete new spec?
    if (!newSpec['role-templates'] && !newSpec['object-templates'] && !newSpec['policy-templates']) {
      userMultiSelectData.customValidations = false
    } else {
      // did user do a simple edit of the specs?
      userMultiSelectData.customValidations =
        templateData.customValidations !== undefined ||
        !_.isEqual(oldSpec['role-templates'], newSpec['role-templates'])||
        !_.isEqual(oldSpec['object-templates'], newSpec['object-templates'])||
        !_.isEqual(oldSpec['policy-templates'], newSpec['policy-templates'])
    }
  } else if (!oldSpec && newSpec) {
    // did the user paste in some specs?
    userMultiSelectData.customValidations = true
  } else if (oldSpec && !newSpec) {
    // did the user just delete the specs
    // if they did, now allow user to automatically add templated specs
    userMultiSelectData.customValidations = false
  }

  // if user has edited the specs, save their changes to stuff back into template
  if (userMultiSelectData.customValidations) {
    const lines = newParsed.Policy[0].$yml.split('\n')
    const specs =  _.get(newParsed.Policy[0], '$synced.spec.$v', {})
    templateData.customValidations = getCustomSpec(lines, specs, 'policy-templates')
      .concat(getCustomSpec(lines, specs, 'object-templates'))
      .concat(getCustomSpec(lines, specs, 'policy-templates')).join('\n')
  } else {
    delete templateData.customValidations
  }
}

const getCustomSpec = (lines, specs, key) => {
  let ret = []
  if (specs[key]) {
    const beg = specs[key].$r
    const end = beg+specs[key].$l+1
    ret = lines.slice(beg, end)
  }
  return ret
}

const setCustomAnnotationsData = (annotations, templateData, multiSelectData, userMultiSelectData) => {
  const keys = ['standards', 'categories', 'controls']
  const annotationMap = _.keyBy(templateData.annotations, 'name')
  keys.forEach(key=>{
    let values = annotations[`policy.mcm.ibm.com/${key}`]
    if (values) {
      values = values.split(',').map((item) => {
        return item.trim()
      }).filter(v=>{return v!==''})
      userMultiSelectData[key] = values.filter(value=>{
        return multiSelectData[key].indexOf(value) === -1
      })
      annotationMap[key].values = values
    }
  })
}


const setCustomSelectorData = (newParsed, templateData, multiSelectData, userMultiSelectData) => {
  const matchLabels = _.get(newParsed, 'PlacementPolicy[0].$raw.spec.clusterLabels.matchLabels')
  if (matchLabels) {
    const selectors = []
    Object.entries(matchLabels).forEach(([key, value]) => {
      selectors.push(`${key}: "${value}"`)
    })
    userMultiSelectData.selectors = selectors.filter(selector=>{
      return multiSelectData.selectors.indexOf(selector) === -1
    })
    templateData.bindings[0].values = selectors
  }
}


/////////////////////////////////////////////////////////////////////////////////

export const getCreateErrors = (parsed, {compliances=[]}, locale) => {
  let errorMsg = null
  const {$raw: {metadata: {name}, spec={}}} = parsed.Policy[0]
  const nameMap = _.keyBy(compliances, 'name')
  const matchLabels = _.get(parsed, 'PlacementPolicy[0].$raw.spec.clusterLabels.matchLabels')
  if (!name) {
    errorMsg = msgs.get('error.create.policy.noname', locale)
  } else if (nameMap[name]!==undefined) {
    errorMsg = msgs.get('error.create.policy.name.exists', [name], locale)
  } else if (!spec['policy-templates'] && !spec['object-templates'] && !spec['role-templates']) {
    errorMsg = msgs.get('error.create.policy.novalidation', locale)
  } else if (!matchLabels && parsed.PlacementPolicy) {
    errorMsg = msgs.get('error.create.policy.nobinding', locale)
  }
  return errorMsg
}



/////////////////////////////////////////////////////////////////////////////////

export const highliteDifferences = (editor, oldYAML, newYAML) => {
  // mark any modified/added lines in editor
  const ranges=[]
  let row=0
  let firstRow=undefined
  const range = editor.getSelectionRange()
  diffTrimmedLines(oldYAML, newYAML)
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
  // wait until editor has content before highlighting
  setTimeout(() => {
    if (ranges.length) {
      const selection = editor.multiSelect
      selection.toSingleRange(ranges[0])
      for (var i = ranges.length; i--; ) {
        selection.addRange(ranges[i], true)
      }
    } else {
      editor.selection.clearSelection()
    }
  }, 0)
  if (firstRow) {
    editor.setAnimatedScroll(true)
    editor.scrollToLine(firstRow, true)
  }
}

