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
import { typedResourcePageWithDetails } from '../components/common/ResourcePage'
// eslint-disable-next-line import/no-named-as-default
import CreateResourceModal from '../components/modals/CreateResourceModal'
import { createResources } from '../actions/common'
import StructuredListModule from '../components/common/StructuredListModuleWithActions'

// TODO: create new type call HCM_COMPLIANCE to hand create
const handleCreateResource = (dispatch, yaml) => dispatch(createResources(RESOURCE_TYPES.HCM_POLICIES, yaml))

const createComplianceModal = <CreateResourceModal
  key='createPolicy'
  headingTextKey='actions.create.policy'
  submitBtnTextKey='actions.create.policy'
  onCreateResource={ handleCreateResource }
  resourceDescriptionKey='modal.createresource.policy'
/>

export default withRouter(typedResourcePageWithDetails(
  RESOURCE_TYPES.HCM_COMPLIANCES,
  ['overview','violation','yaml'],
  [createComplianceModal],
  ['/violation', '/yaml','/compliancePolicy/:policyName/:policyNamespace'],
  // [<ResourceTableModule key='roleTemplates' definitionsKey='roleTemplates' />,
  //   <ResourceTableModule key='policyTemplates' definitionsKey='objectTemplates' />,
  [<StructuredListModule key='placementPolicies' rowsKey='placementPoliciesKeys' actions={['table.actions.edit']} left second />,
    <StructuredListModule key='placementBindings' rowsKey='placementBindingKeys' actions={['table.actions.edit']} right second />,]
))
