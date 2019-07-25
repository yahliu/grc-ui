/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import policyMutation from './policy-mutation.handlebars'
import policyPodRole from './policy-rolebinding.handlebars'
import policyPodSecurity from './policy-psp.handlebars'
import policyPodNetwork from './policy-network.handlebars'
import policyPodLimit from './policy-mem-limit.handlebars'
import policyPodExists from './policy-pod.handlebars'
import policyRoles from './policy-roles.handlebars'
import policyNamespace from './policy-namespace.handlebars'
import policyCert from './policy-cert.handlebars'
import policyClustrolebinding from './policy-clusterrolebinding.handlebars'

export {
  policyMutation,
  policyPodRole,
  policyPodSecurity,
  policyPodNetwork,
  policyPodLimit,
  policyPodExists,
  policyRoles,
  policyNamespace,
  policyCert,
  policyClustrolebinding,
}
