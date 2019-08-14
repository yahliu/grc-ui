/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import _ from 'lodash'

export default {
  defaultSortField: 'shortDescription',
  primaryKey: 'name',
  secondaryKey: 'finding.severity',
  tableKeys: [
    {
      msgKey: 'table.header.description',
      resourceKey: 'shortDescription',
    },
    {
      msgKey: 'table.header.resources',
      resourceKey: 'context.resourceName',
    },
    {
      msgKey: 'table.header.severity',
      resourceKey: 'finding.severity',
    },
    {
      msgKey: 'table.header.standards',
      resourceKey: 'securityClassification.securityStandards',
      transformFunction: getFindingStandards
    },
    {
      msgKey: 'table.header.controls',
      resourceKey: 'securityClassification.securityControl',
      transformFunction: getFindingControl
    },
    {
      msgKey: 'table.header.categories',
      resourceKey: 'securityClassification.securityCategories',
      transformFunction: getFindingCategories
    },
  ],
}

function compressArray(items){
  if (items) {
    return items.map(item => _.startCase(item.trim())).join(', ')
  }
  return '-'
}

export function getFindingStandards(item) {
  const securityStandards = compressArray(_.get(item, 'securityClassification.securityStandards') || [])
  return securityStandards ? securityStandards : '-'
}

export function getFindingControl(item) {
  const securityControl = _.startCase((_.get(item, 'securityClassification.securityControl') || '').trim())
  return securityControl ? securityControl : '-'
}

export function getFindingCategories(item) {
  const securityCategories = compressArray(_.get(item, 'securityClassification.securityCategories') || [])
  return securityCategories ? securityCategories : '-'
}
