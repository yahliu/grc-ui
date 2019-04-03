/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

module.exports.CFC_ACCESS_COOKIE = 'cfc-access-token-cookie'
module.exports.CFC_AUTH_COOKIE = 'cfc-acs-auth-cookie'

module.exports.REFRESH_TIMES = [5, 10, 30, 60, 5*60, 30*60, 0]
module.exports.DEFAULT_REFRESH_TIME = 10
module.exports.POLICY_REFRESH_INTERVAL_COOKIE = 'policy-refresh-interval-refresh-cookie'
module.exports.POLICY_OVERVIEW_STATE_COOKIE = 'policy-overview-state-cookie'

module.exports.RESOURCE_TYPES = {
  HCM_POLICIES: { name: 'HCMPolicy', list: 'HCMPolicyList' },
  HCM_POLICIES_PRE_CLUSTER: { name: 'HCMPolicyCluster', list: 'HCMPolicyClusterList' },
  HCM_POLICIES_PRE_POLICY: { name: 'HCMPolicyPolicy', list: 'HCMPolicyPolicyList' },
  HCM_COMPLIANCES: { name: 'HCMCompliance', list: 'HCMComplianceList' },
  HCM_CLUSTERS: { name: 'HCMCluster', list: 'HCMClusterList'},// filter: true },
}

// keep order from lowest to highest role
module.exports.ROLES = {
  VIEWER: 'Viewer',
  EDITOR: 'Editor',
  OPERATOR: 'Operator',
  ADMIN: 'Administrator',
  CLUSTER_ADMIN: 'ClusterAdministrator'
}
