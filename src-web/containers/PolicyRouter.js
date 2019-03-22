/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ROLES } from '../../lib/shared/constants'
import loadable from 'loadable-components'
import config from '../../lib/shared/config'
import withAccess from '../components/common/withAccess'
// import ClusterComplianceTab from './ClusterComplianceTab'

export const OverviewTab = loadable(() => import(/* webpackChunkName: "empty" */ './OverviewTab'))
export const PoliciesTab = loadable(() => import(/* webpackChunkName: "empty" */ './PoliciesTab'))
export const ClusterComplianceTab = loadable(() => import(/* webpackChunkName: "empty" */ './ClusterComplianceTab'))

const BASE_PAGE_PATH = `${config.contextPath}`

const SECONDARY_HEADER_PROPS = {
  title: 'routes.policies',
  tabs: [
    {
      id: 'policy-overview',
      label: 'tabs.policy.overview',
      url: `${BASE_PAGE_PATH}`
    },
    {
      id: 'policy-all-policies',
      label: 'tabs.policy.all.policies',
      url: `${BASE_PAGE_PATH}/policies`
    },
    {
      id: 'policy-configuration',
      label: 'tabs.policy.configuration',
      url: `${BASE_PAGE_PATH}/configuration`
    },
  ]
}

const PolicyRouter = ({ match }) =>
  <Switch>
    <Route exact path={`${match.url}`} render={() => <OverviewTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
    <Route exact path={`${match.url}/policies`} render={() => <PoliciesTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
    <Route path={`${match.url}/configuration`} render={() => <ClusterComplianceTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
  </Switch>


PolicyRouter.propTypes = {
  match: PropTypes.object,
}

export default withRouter(withAccess(PolicyRouter, ROLES.OPERATOR))
