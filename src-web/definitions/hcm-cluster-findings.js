/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

export default {
  defaultSortField: 'context.clusterName',
  primaryKey: 'name',
  secondaryKey: 'finding.severity',
  tableKeys: [
    {
      msgKey: 'table.header.cluster.name',
      resourceKey: 'context.clusterName',
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'context.namespaceName',
    },
    {
      msgKey: 'table.header.severity',
      resourceKey: 'finding.severity',
    },
    {
      msgKey: 'table.header.description',
      resourceKey: 'shortDescription',
    },
    {
      msgKey: 'table.header.resources',
      resourceKey: 'context.resourceName',
    },
    {
      msgKey: 'table.header.findingSource',
      resourceKey: 'reportedBy.title',
    },
  ],
}
