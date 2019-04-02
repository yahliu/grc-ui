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
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'cluster',
    },
    {
      msgKey: 'table.header.violation',
      resourceKey: 'violation',
    },
    {
      msgKey: 'table.header.standards',
      resourceKey: 'nonCompliant',
      transformFunction: getLabels,
    }
  ],
}

export function getLabels(item) {
  return getTruncatedText(item.nonCompliant.join(', '))
}

export function getTruncatedText(item){
  return <TruncateText text={item} />
}
