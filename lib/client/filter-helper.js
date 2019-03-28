/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { POLICY_ACTIVE_FILTER_COOKIE  } from '../shared/constants'
//import msgs from '../../nls/platform.properties'
//import _ from 'lodash'

/*
* UI helpers to help with data transformations
* */

export const PolicyFilterTypes = Object.freeze({
  standards: 'standards',
  categories: 'categories',
  controls: 'controls',
  type: 'type',
})

export const getPolicyFilters = () => { //policies, prevFilters, locale) => {

  // initialize filter
  const filters = {}
  //  Object.keys(PolicyFilterTypes).forEach(type=>{
  //    let name
  //    const activeSet=new Set()
  //    let availableSet=new Set()
  //    switch (type) {
  //    case PolicyFilterTypes.standards:
  //      name = msgs.get('policy.filter.category.standards', locale)
  //      break
  //    case PolicyFilterTypes.categories:
  //      name = msgs.get('policy.filter.category.categories', locale)
  //      break
  //    case PolicyFilterTypes.controls:
  //      name = msgs.get('policy.filter.category.controls', locale)
  //      break
  //    case PolicyFilterTypes.type:
  //      name = msgs.get('policy.filter.category.type', locale)
  //      availableSet=new Set([
  //        msgs.get('policy.filter.category.type.enforce', locale),
  //        msgs.get('policy.filter.category.type.inform', locale)
  //      ])
  //      break
  //    }
  //    filters[type] ={
  //      name, activeSet, availableSet
  //    }
  //  })
  //
  //  // loop thru policies adding available/active filters
  //  const activeFilters = getActivePolicyFilters()
  //  policies.map(policy=>{
  //    Object.keys(PolicyFilterTypes).forEach(type=>{
  //      let types
  //      const filter = filters[type]
  //      const annotations = _.get(policy, 'metadata.annotations', {})
  //      switch (type) {
  //      case PolicyFilterTypes.standards:
  //        types = annotations['policy.mcm.ibm.com/categories'] || ''
  //        break
  //      case PolicyFilterTypes.categories:
  //        types = annotations['policy.mcm.ibm.com/categories'] || ''
  //        break
  //      case PolicyFilterTypes.controls:
  //        types = annotations['policy.mcm.ibm.com/controls'] || ''
  //        break
  //      }
  //      types.split(',').forEach(type=>{
  //        type=type.trim()
  //        if (type) {
  //          let name = type
  //          if (type===PolicyFilterTypes.categories) {
  //            name = _.capitalize(_.startCase(name))
  //          }
  //          filter.availableSet.add(name)
  //        }
  //      })
  //    })
  //  })
  return filters
}

export const filterPolicies = (policies, filters) => {
  return filters ? policies : []
}


export const getActivePolicyFilters = () => {
  let activeFilters = {}
  try {
    activeFilters = JSON.parse(sessionStorage.getItem(POLICY_ACTIVE_FILTER_COOKIE))
  } catch (error) {
    // no privileges
  }
  return activeFilters || {}

}

export const saveActivePolicyFilters = (activeFilters) => {
  try {
    sessionStorage.setItem(POLICY_ACTIVE_FILTER_COOKIE, JSON.stringify(activeFilters))
  } catch (error) {
    // no privileges
  }
}

