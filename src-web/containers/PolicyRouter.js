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

export const OverviewTab = loadable(() => import(/* webpackChunkName: "overview" */ './OverviewTab'))
export const PoliciesTab = loadable(() => import(/* webpackChunkName: "policies" */ './PoliciesTab'))
export const CreationTab = loadable(() => import(/* webpackChunkName: "policies" */ './CreationTab'))
export const PolicyDetail = loadable(() => import(/* webpackChunkName: "policies" */ './NewPolicyDetail'))

const BASE_PAGE_PATH = `${config.contextPath}/policies`

const SECONDARY_HEADER_PROPS = {
  title: 'routes.grc',
  information: 'policy.header.tooltip',
  links: [
    {
      id: 'create-policy',
      label: 'button.create.policy',
      url: `${BASE_PAGE_PATH}/create`
    }
  ],
  tabs: [
    {
      id: 'policy-overview',
      label: 'tabs.policy.overview',
      url: `${BASE_PAGE_PATH}`
    },
    {
      id: 'policy-all',
      label: 'tabs.policy.all',
      url: `${BASE_PAGE_PATH}/all`
    },
    {
      id: 'policy-findings',
      label: 'tabs.policy.findings',
      url: `${BASE_PAGE_PATH}/findings`
    },
  ]
}

const CREATION_HEADER_PROPS = {
  title: 'routes.create.policy',
  information: 'policy.create.tooltip',
  breadcrumbItems: [
    {
      id: 'policy-overview',
      label: 'routes.grc',
      url: `${BASE_PAGE_PATH}/all`
    }
  ],
}

const PolicyRouter = ({ match }) =>
  <Switch>
    <Route exact path={`${match.url}`} render={() => <OverviewTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
    <Route path={`${match.url}/all/:namespace/:name`} render={() => <PolicyDetail secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
    <Route path={`${match.url}/all`} render={() => <PoliciesTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
    <Route path={`${match.url}/findings`} /*SecurityFindingsTab to do later*/render={() => <PoliciesTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
    <Route path={`${match.url}/create`} render={() => <CreationTab secondaryHeaderProps={CREATION_HEADER_PROPS} />} />
  </Switch>

PolicyRouter.propTypes = {
  match: PropTypes.object,
}

export default withRouter(withAccess(PolicyRouter, ROLES.OPERATOR))
