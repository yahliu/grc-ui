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
import TruncateText from '../components/common/TruncateText'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  tableActions: [
    'table.actions.policy.applications.sidepanel',
  ],
  tableKeys: [
    {
      msgKey: 'table.header.application',
      resourceKey: 'name',
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'nameSpace',
    },
    {
      msgKey: 'table.header.violation',
      resourceKey: 'violations',
    },
    {
      msgKey: 'table.header.violated',
      resourceKey: 'violatedPolicies',
      transformFunction: getLabels,
    }
  ],
  applicationViolatedSidePanel: {
    headerRows: ['', 'table.header.policy.name', 'table.header.rule.violation', 'table.header.control', 'table.header.cluster',],
    subHeaders: ['table.header.name', 'table.header.message', 'table.header.reason', '',],
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
          },
          {
            resourceKey: 'cluster',
          },
        ]
      }
    ]
  },
}

export function getLabels(item) {
  const violatedPoliciesName = []
  item.violatedPolicies.forEach(policy => {
    violatedPoliciesName.push(policy.name)
  })
  return getTruncatedText(violatedPoliciesName.join(', '))
}

export function getTruncatedText(item){
  return <TruncateText text={item} />
}
