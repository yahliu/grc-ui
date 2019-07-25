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

const formatClusterView = (key, value) => {
  let validNum = 0
  let nameSpace
  const nonCompliant = []

  value.forEach(item => {
    nameSpace = _.get(item, 'namespace', 'metadata.namespace')
    const status = _.get(item, `raw.status.status.${key}`, '')
    let compliant = false
    switch (typeof status) {
    case 'string':
      compliant = (status.toLowerCase() === 'compliant')
      break
    case 'object':
      compliant = (status['compliant'] && status['compliant'].toLowerCase() === 'compliant')
      break
    }
    if (compliant) {
      validNum += 1
    } else {
      nonCompliant.push(_.get(item, 'metadata.name', '-'))
    }
  })
  const result = {
    cluster: key,
    namespace: nameSpace,
    violation: `${value.length-validNum}/${value.length}`,
    nonCompliant: nonCompliant,
  }
  return result
}

const formatPoliciesToClustersTableData = (items) => {
  const result = []
  const map = new Map()
  for (const item of items) {
    const statuses = _.get(item, 'raw.status.status', {})
    Object.entries(statuses).forEach(([cluster]) => {
      if (!map.has(cluster)) map.set(cluster, [])
      map.get(cluster).push(item)
    })
  }
  for (const [key, value] of map.entries()) {
    result.push(formatClusterView(key, value))
  }

  return result
}

export default formatPoliciesToClustersTableData
