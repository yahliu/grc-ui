/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

/* eslint-disable react/jsx-no-bind */

import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ROLES } from '../../lib/shared/constants'
import config from '../../lib/shared/config'
// disable local policies
// import LocalPoliciesTab from './LocalPoliciesTab'
import ClusterComplianceTab from './ClusterCompliances'
import withAccess from '../components/common/withAccess'

const BASE_PAGE_PATH = `${config.contextPath}`
const SECONDARY_HEADER_PROPS = {
  title: 'routes.policies',
  tabs: [
    {
      id: 'policy-overview',
      label: 'tabs.policy.overview',
      url: `${BASE_PAGE_PATH}/overview`
    },
    {
      id: 'policy-security',
      label: 'tabs.policy.security',
      url: `${BASE_PAGE_PATH}/security`
    },
    {
      id: 'policy-configuration',
      label: 'tabs.policy.configuration',
      url: `${BASE_PAGE_PATH}/configuration`
    },
  ]
}

const Policies = ({ match }) =>
  <Switch>
    {/*<Route path={`${match.url}/local`} render={() => <LocalPoliciesTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />*/}
    <Route path={`${match.url}/configuration`} render={() => <ClusterComplianceTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
  </Switch>


Policies.propTypes = {
  match: PropTypes.object,
}

export default withRouter(withAccess(Policies, ROLES.OPERATOR))
