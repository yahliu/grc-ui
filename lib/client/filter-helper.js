/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import msgs from '../../nls/platform.properties'
import _ from 'lodash'

/*
* UI helpers to help with data transformations
* */

export const PolicyFilterTypes = Object.freeze({
  standards: 'standards',
  categories: 'categories',
  controls: 'controls',
  type: 'type',
})

export const getAvailablePolicyFilters = (policies=[], locale) => {

  // initialize filter
  const filters = {}
  Object.keys(PolicyFilterTypes).forEach(type=>{
    let name
    let availableSet=new Set()
    switch (type) {
    case PolicyFilterTypes.standards:
      name = msgs.get('policy.filter.category.standards', locale)
      break
    case PolicyFilterTypes.categories:
      name = msgs.get('policy.filter.category.categories', locale)
      break
    case PolicyFilterTypes.controls:
      name = msgs.get('policy.filter.category.controls', locale)
      break
    case PolicyFilterTypes.type:
      name = msgs.get('policy.filter.category.type', locale)
      availableSet=new Set([
        msgs.get('policy.filter.category.type.enforce', locale),
        msgs.get('policy.filter.category.type.inform', locale)
      ])
      break
    }
    filters[type] ={
      name, availableSet
    }
  })

  // loop thru policies adding available filters
  policies.map(policy=>{
    Object.keys(PolicyFilterTypes).forEach(filterType=>{
      let types=''
      const filter = filters[filterType]
      const annotations = _.get(policy, 'metadata.annotations', {})
      switch (filterType) {
      case PolicyFilterTypes.standards:
        types = annotations['policy.mcm.ibm.com/standards'] || ''
        break
      case PolicyFilterTypes.categories:
        types = annotations['policy.mcm.ibm.com/categories'] || ''
        break
      case PolicyFilterTypes.controls:
        types = annotations['policy.mcm.ibm.com/controls'] || ''
        break
      }
      if (filterType!==PolicyFilterTypes.type && types.length===0) {
        types=msgs.get('overview.policy.overview.other', locale)
      }
      types.split(',').forEach(type=>{
        type=type.trim()
        if (type) {
          let name = type
          if (filterType===PolicyFilterTypes.categories) {
            name = _.capitalize(_.startCase(name))
          }
          filter.availableSet.add(name)
        }
      })
    })
  })
  return filters
}

export const filterPolicies = (policies, activeFilters, locale) => {
  return policies.filter(policy => {
    return Object.keys(PolicyFilterTypes).every(filterType=>{
      const activeSet = activeFilters[filterType]
      if (activeSet && activeSet.size>0) {
        let types=''
        const annotations = _.get(policy, 'metadata.annotations', {})
        switch (filterType) {
        case PolicyFilterTypes.standards:
          types = annotations['policy.mcm.ibm.com/standards'] || ''
          break
        case PolicyFilterTypes.categories:
          types = annotations['policy.mcm.ibm.com/categories'] || ''
          break
        case PolicyFilterTypes.controls:
          types = annotations['policy.mcm.ibm.com/controls'] || ''
          break
        case PolicyFilterTypes.type:
          types = policy.remediation.toLowerCase() === 'enforce' ?
            msgs.get('policy.filter.category.type.enforce', locale) :
            msgs.get('policy.filter.category.type.inform', locale)
          break
        }
        if (filterType!==PolicyFilterTypes.type && types.length===0) {
          types=msgs.get('overview.policy.overview.other', locale)
        }
        return types.split(',').some(type=>{
          type=type.trim()
          if (type) {
            let name = type
            if (filterType===PolicyFilterTypes.categories) {
              name = _.capitalize(_.startCase(name))
            }
            return activeSet.has(name)
          }
        })
      }
      return true
    })
  })
}

