/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import {getCategories, getControls, getStandards} from './hcm-compliances'

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey: 'metadata.namespace',
  tableActions: [
    'table.actions.sidepanel',
  ],
  tableKeys: [
    {
      msgKey: 'table.header.policy.name',
      resourceKey: 'metadata.name',
    },
    {
      msgKey: 'table.header.remediation',
      resourceKey: 'remediation',
    },
    {
      msgKey: 'table.header.cluster.violation',
      resourceKey: 'clusterCompliant',
    },
    {
      msgKey: 'table.header.controls',
      resourceKey: 'metadata.annotations["policy.mcm.ibm.com/controls"]',
      transformFunction: getControls,
    },
    {
      msgKey: 'table.header.standards',
      resourceKey: 'metadata.annotations["policy.mcm.ibm.com/standards"]',
      transformFunction: getStandards,
    },
    {
      msgKey: 'table.header.categories',
      resourceKey: 'metadata.annotations["policy.mcm.ibm.com/categories"]',
      transformFunction: getCategories
    },
  ],
  violatedTable: {
    // title: 'policy.violated.cluster',
    headerRows: ['', 'table.header.cluster.name', 'table.header.rule.violation', ''],
    subHeaders: ['table.header.name', 'table.header.message', 'table.header.reason'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'metadata.name',
          },
          {
            resourceKey: 'violated',
          },
          {
            resourceKey: 'spec.consoleURL',
          }
        ]
      }
    ]
  },
}

