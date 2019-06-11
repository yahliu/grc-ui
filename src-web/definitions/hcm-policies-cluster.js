/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import TruncateText from '../components/common/TruncateText'

export default {
  defaultSortField: 'cluster',
  primaryKey: 'cluster',
  secondaryKey: 'metadata.namespace',
  tableActions: [
    'table.actions.sidepanel',
  ],
  tableKeys: [
    {
      msgKey: 'table.header.cluster.name',
      resourceKey: 'cluster',
    },
    {
      msgKey: 'table.header.violation',
      resourceKey: 'violation',
    },
    {
      msgKey: 'table.header.violated',
      resourceKey: 'nonCompliant',
      transformFunction: getLabels,
    }
  ],
  violatedTable: {
    // title: 'cluster.violated.policy',
    headerRows: ['', 'table.header.policy.name', 'table.header.rule.violation', 'table.header.control'],
    subHeaders: ['table.header.name', 'table.header.message', 'table.header.reason'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'metadata.name',
          },
          {
            resourceKey: 'violatedNum',
          },
          {
            resourceKey: 'metadata.annotations["policy.mcm.ibm.com/controls"]',
          }
        ]
      }
    ]
  },
}

export function getLabels(item) {
  return getTruncatedText(item.nonCompliant.join(', '))
}

export function getTruncatedText(item){
  return <TruncateText text={item} />
}
