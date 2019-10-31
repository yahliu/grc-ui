/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import jsYaml from 'js-yaml'
import YamlParser from '../components/YamlParser'
import _ from 'lodash'


export const updateControls = (controlData, oldParsed, newParsed) => {

  // stuff newly parsed yaml object into a control's active values using the object to control path (reverse)
  let isCustomName = false
  controlData.forEach(control=>{
    const {type, reverse} = control
    switch (type) {
    case 'text':
      isCustomName = isCustomName || updateTextControl(control, reverse, newParsed)
      break
    case 'checkbox':
      updateCheckboxControl(control, reverse, newParsed)
      break
    case 'multiselect':
      updateMultiSelectControl(control, reverse, oldParsed, newParsed)
    }
  })
  return isCustomName
}

const updateTextControl = (control, reverse, newParsed) => {
  const newActive = _.get(newParsed, reverse[0])
  const isCustomName = control.id==='name' && control.active!==newActive
  control.active = newActive
  return isCustomName
}

const updateCheckboxControl = (control, reverse, newParsed) => {
  const newActive = _.get(newParsed, reverse[0])
  if (typeof newActive == 'boolean') {
    control.active = control.available.indexOf(newActive.toString())>0
  }
  else {
    control.active = control.available.indexOf(newActive)>0
  }
}

const updateMultiSelectControl = (control, reverse, oldParsed, newParsed) => {
  const {hasLabels, hasReplacements} = control
  if (hasLabels) {
    updateMultiSelectLabelControl(control, reverse, newParsed)
  } else if (hasReplacements) {
    updateMultiSelectReplacementControl(control, reverse, oldParsed, newParsed)
  } else {
    updateMultiSelectStringControl(control, reverse, newParsed)
  }
}


const updateMultiSelectStringControl = (control, reverse, newParsed) => {
  let values = _.get(newParsed, reverse[0])
  if (values && typeof values==='string') {
    const set = new Set(control.available)
    values = values.split(',').map((item) => {
      return item.trim()
    }).filter(v=>{return v!==''})
    control.userData = values.filter(value=>{
      return !set.has(value)
    })
  } else {
    values = []
  }
  control.active = values
}

const updateMultiSelectLabelControl = (control, reverse, newParsed) => {
  const selectors = []
  const userData = []
  const userMap = {}
  const {availableMap} = control
  const matchLabels = _.get(newParsed, `${reverse[0]}.matchLabels`)
  if (matchLabels instanceof Object) {
    Object.entries(matchLabels).forEach(([key, value]) => {
      const selection = `${key}: "${value}"`
      selectors.push(selection)
      if (!availableMap[selection]) {
        userMap[selection] = {key, value}
        userData.push(selection)
      }
    })
  }
  const matchExpressions = _.get(newParsed, `${reverse[0]}.matchExpressions`)
  if (matchExpressions instanceof Object) {
    matchExpressions.forEach(({key, operator, values})=>{
      if (operator==='In') {
        values.forEach(value => {
          const selection = `${key}: "${value}"`
          selectors.push(selection)
          if (!availableMap[selection]) {
            userMap[selection] = {key, value}
            userData.push(selection)
          }
        })
      }
    })
  }
  if (userData.length>0) {
    control.userData = userData
    control.userMap = userMap
  }
  control.active = selectors
}

const updateMultiSelectReplacementControl = (control, reverse, oldParsed, newParsed) => {

  // get all objects this control can possibly add to the template
  const oldObjects = getTemplateObjects(reverse, oldParsed)
  const newObjects = getTemplateObjects(reverse, newParsed)

  // if old and new have objects
  if (oldObjects && newObjects) {
    // did user an edit an object?
    control.hasCapturedUserSource = control.hasCapturedUserSource || !_.isEqual(oldObjects, newObjects)
  } else if (!oldObjects && newObjects) {
    // did user paste in some objects?
    control.hasCapturedUserSource = true
  } else if (oldObjects && !newObjects) {
    // did user delete the objects?
    control.hasCapturedUserSource = false
  }

  // if user has manually changed the objects, save their changes to stuff back into template
  if (control.hasCapturedUserSource) {
    control.userData = getTemplateSource(reverse, newParsed)
  } else {
    delete control.userData
  }
}
const getTemplateObjects = (reverse, parsed) => {
  const objects = []
  reverse.forEach(path=>{
    const object = _.get(parsed, path)
    if (object) {
      objects.push(object)
    }
  })
  return objects.length>0 ? objects : undefined
}

const getTemplateSource = (reverse, parsed) => {
  let ret = []
  reverse.forEach(path=>{
    path = path.split('.')
    const pathBase = path.shift()
    path.shift()

    // dig out the yaml and the object that points to it
    const yaml = _.get(parsed, `${pathBase}.$yml`)
    path = path.length>0 ? pathBase + `.$synced.${path.join('.$v.')}` : pathBase
    const synced = _.get(parsed, path)
    if (yaml && synced) {
      // capture the source lines
      const lines = yaml.split('\n')
      ret = [...ret, ...lines.slice(synced.$r, synced.$r+synced.$l+1)]
    }
  })
  return ret.join('\n')
}


export const parseYAML = (yaml) => {
  let absLine=0
  const parsed = {}
  const yamls = yaml.split(/^---$/gm)
  const exceptions = []
  // check for syntax errors
  try {
    yamls.forEach((snip)=>{
      const obj = jsYaml.safeLoad(snip)
      const key = _.get(obj, 'kind', 'unknown')
      let values = parsed[key]
      if (!values) {
        values = parsed[key] = []
      }
      const post = snip.endsWith('\n')
      snip = snip.trim()
      const $synced = new YamlParser().parse(snip, absLine)
      $synced.$r = absLine
      $synced.$l = snip.split('\n').length
      values.push({$raw: obj, $yml: snip, $synced})
      absLine += $synced.$l
      if (post) absLine++
    })
  } catch (e) {
    const {mark={}, reason, message} = e
    const {line=0, column=0} = mark
    exceptions.push({
      row: line+absLine,
      column,
      text: _.capitalize(reason||message),
      type: 'error',
    })
  }
  return {parsed, exceptions}
}

