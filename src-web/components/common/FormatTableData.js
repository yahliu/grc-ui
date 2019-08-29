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

const formatPolicyClusterView = (clusterName, policiesUnderCluster) => {
  let validNum = 0
  let nameSpace
  const nonCompliant = []
  policiesUnderCluster.forEach(policy => {
    nameSpace = _.get(policy, 'namespace', 'metadata.namespace')
    const status = _.get(policy, `raw.status.status.${clusterName}`, '')
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
      nonCompliant.push(_.get(policy, 'metadata.name', '-'))
    }
  })
  const result = {
    cluster: clusterName,
    namespace: nameSpace,
    violation: `${policiesUnderCluster.length-validNum}/${policiesUnderCluster.length}`,
    nonCompliant: nonCompliant,
  }
  return result
}

export const formatPoliciesToClustersTableData = (policies) => {
  const result = []
  const map = new Map()
  if(policies) {
    policies.forEach((policy) => {
      const statuses = _.get(policy, 'raw.status.status', {})
      Object.entries(statuses).forEach(([cluster]) => {
        if (!map.has(cluster)) map.set(cluster, [])
        map.get(cluster).push(policy)
      })
    })
    for (const [key, value] of map.entries()) {
      result.push(formatPolicyClusterView(key, value))
    }
  }
  return result
}

const formatFindingClusterView = (clusterName, findingsUnderCluster) => {
  let validNum = 0
  // let nameSpace
  const highSeverity = {}
  findingsUnderCluster.forEach(finding => {
    // nameSpace = _.get(finding, 'context.namespaceName', '-')
    const status = _.get(finding, 'finding.severity', '')
    const isHigh = status.toUpperCase() === 'HIGH' ? true : false
    if (isHigh) {
      const description = _.get(finding, 'shortDescription', '-')
      highSeverity[description] = highSeverity[description] ? highSeverity[description]+1 : 1
    } else {
      validNum += 1
    }
  })
  const result = {
    cluster: clusterName,
    // namespace: nameSpace,
    severity: `${findingsUnderCluster.length-validNum}/${findingsUnderCluster.length}`,
    highSeverity: highSeverity,
    findingsUnderCluster: findingsUnderCluster,
  }
  return result
}

export const formatFindingsToClustersTableData = (findings) => {
  const result = []
  const map = new Map()
  if(findings) {
    findings.forEach((finding) => {
      const cluster = _.get(finding, 'context.clusterName', '-')
      if (!map.has(cluster)) map.set(cluster, [])
      map.get(cluster).push(finding)
    })
    for (const [key, value] of map.entries()) {
      result.push(formatFindingClusterView(key, value))
    }
  }
  return result
}

export const formatExpandablePolicies = (policies) => {
  const result = []
  policies.forEach(policy => {
    if(policy) {
      const subItems = [{name: 'policy.pb', items: policy.placementBindings.map(pb => pb.metadata.name)},
        {name: 'policy.pp', items: policy.placementPolicies.map(pp => pp.metadata.name)}]
      result.push({...policy, subItems})
    }
  })
  return result
}
