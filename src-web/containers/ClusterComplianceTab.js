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
import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { typedResourcePageWithListAndDetails } from '../components/common/ResourcePage'
import PolicyTemplates from '../components/common/PolicyTemplates'
import ResourceTableModule from '../components/common/ResourceTableModuleFromProps'

export default withRouter(typedResourcePageWithListAndDetails(
  RESOURCE_TYPES.HCM_COMPLIANCES,
  ['overview'], [],
  ['/compliancePolicy/:policyName/:policyNamespace', '/compliancePolicy/:policyName'],
  [<PolicyTemplates key='Compliance Templates' headerKey={'table.header.complianceTemplate'} editable={true} right />,
    <ResourceTableModule key='complianceStatus' definitionsKey='complianceStatus' />,
    <ResourceTableModule key='compliancePolicies' definitionsKey='compliancePolicies' />,
    <ResourceTableModule key='placementPolicies' definitionsKey='placementPolicyKeys' />,
    <ResourceTableModule key='placementBindings' definitionsKey='placementBindingKeys' />,]
))
