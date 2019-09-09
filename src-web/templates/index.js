/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import policyPodRole from './policy-rolebinding.handlebars'
import policyPodSecurity from './policy-psp.handlebars'
import policyPodNetwork from './policy-network.handlebars'
import policyPodLimit from './policy-mem-limit.handlebars'
import policyPodExists from './policy-pod.handlebars'
import policyRoles from './policy-roles.handlebars'
import policyNamespace from './policy-namespace.handlebars'
import policyClustadminrole from './policy-clusteradminrole.handlebars'
import policyCertmgmtexp from './policy-certmgmtexp.handlebars'
import policyMutationAdvisor from './policy-mutationadvisor.handlebars'
import policyVAsecurity from './policy-vasecurity.handlebars'
import policyKubeEncryption from './policy-kubeencryption.handlebars'
import policyAudit from './policy-audit.handlebars'
import policyCis from './policy-cis.handlebars'
import policyCisOcp from './policy-cis-ocp.handlebars'

export {
  policyPodRole,
  policyPodSecurity,
  policyPodNetwork,
  policyPodLimit,
  policyPodExists,
  policyRoles,
  policyNamespace,
  policyClustadminrole,
  policyCertmgmtexp,
  policyMutationAdvisor,
  policyVAsecurity,
  policyKubeEncryption,
  policyAudit,
  policyCis,
  policyCisOcp,
}
