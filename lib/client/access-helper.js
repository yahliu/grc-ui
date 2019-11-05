/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { ROLES } from '../shared/constants'

export function fliterTableAction(actions,userRole,resourceType) {
  let actionList = []
  switch (userRole) {
  case ROLES.VIEWER:
    return actionList
  case ROLES.EDITOR:
  case ROLES.OPERATOR:
    if(resourceType && resourceType.name ==='HCMCompliance' || resourceType.name === 'HCMPolicyPolicy') {
      return actionList
    }
    actionList = actions.filter((action) => (action === 'table.actions.edit' || action === 'table.actions.cluster.edit.labels' || action==='table.actions.cluster.view.pods'))
    return actionList
  case ROLES.ADMIN:
  case ROLES.ACCOUNT_ADMIN:
  case ROLES.CLUSTER_ADMIN:
  default:
    return actions
  }
}
