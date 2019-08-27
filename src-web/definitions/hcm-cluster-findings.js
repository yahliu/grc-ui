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
  defaultSortField: 'cluster',
  primaryKey: 'cluster',
  secondaryKey: 'metadata.namespace',
  tableActions: [
    'table.actions.finding.sidepanel',
  ],
  tableKeys: [
    {
      msgKey: 'table.header.cluster.name',
      resourceKey: 'cluster',
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace',
    },
    {
      msgKey: 'table.header.severity',
      resourceKey: 'severity',
    },
    {
      msgKey: 'table.header.highSeverity',
      resourceKey: 'highSeverity',
      transformFunction: getHighSeverityObjTostring,
    },
  ],
}

export function getHighSeverityObjTostring(item) {
  const highSeverityMap = _.get(item, 'highSeverity')
  let highSeverityString = ''
  if (highSeverityMap) {
    Object.keys(highSeverityMap).forEach((key) => {
      highSeverityString = `${highSeverityString} ${key} (${highSeverityMap[key]}),`
    })
  }
  highSeverityString = highSeverityString.trim()
  return highSeverityString.substring(0, highSeverityString.length-1)
}
