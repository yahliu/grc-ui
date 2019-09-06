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
import { getAge } from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'shortDescription',
  primaryKey: 'name',
  secondaryKey: 'finding.severity',
  tableActions: [
    'table.actions.finding.sidepanel',
  ],
  tableKeys: [
    {
      msgKey: 'table.header.description',
      resourceKey: 'shortDescription',
    },
    {
      msgKey: 'table.header.resources',
      resourceKey: 'context',
      transformFunction: showTypeAndName
    },
    {
      msgKey: 'table.header.severity',
      resourceKey: 'finding.severity',
      transformFunction: getSeverity
    },
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'context.clusterName',
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
    {
      msgKey: 'table.header.update.time',
      resourceKey: 'updateTime',
      transformFunction: getAge
    },
  ],
  securityFindingSidePanel: {
    headerRows: ['tabs.detail', ''],
    rows: [
      {
        cells: [
          {
            resourceKey: 'key',
          },
          {
            resourceKey: 'value',
          }
        ]
      }
    ]
  },
}

function getSeverity(item, locale) {
  const severity = _.get(item, 'finding.severity')
  switch(severity) {
  case 'HIGH':
    return msgs.get('finding.filter.category.severity.high', locale)
  case 'MEDIUM':
    return msgs.get('finding.filter.category.severity.medium', locale)
  case 'LOW':
    return msgs.get('finding.filter.category.severity.low', locale)
  default:
    return '-'
  }
}

function compressArray(items){
  if (items) {
    return items.map(item => _.startCase(item.trim())).join(', ')
  }
  return '-'
}

function showTypeAndName(item){
  const resourceType = _.get(item, 'context.resourceType', '-')
  const resourceName = _.get(item, 'context.resourceName', '-')
  return `${resourceType}: ${resourceName}`
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
