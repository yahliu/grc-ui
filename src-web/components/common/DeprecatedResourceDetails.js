/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import _ from 'lodash'
// import { REQUEST_STATUS } from '../../actions/index'
import { getTabs } from '../../../lib/client/resource-helper'
import { updateSecondaryHeader, updateResourceToolbar } from '../../actions/common'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import lodash from 'lodash'
import msgs from '../../../nls/platform.properties'
import PolicyDetailsOverview from './PolicyDetailsOverview'
import PolicyClusterDetail from './PolicyClusterDetail'
// import PolicyTemplateTab from '../../containers/PolicyTemplateTab'
// import PolicyViolationTab from '../../containers/PolicyViolationTab'

const components = {
  '/compliancePolicy/:policyName/:policyNamespace': PolicyClusterDetail,
  // '/violation': PolicyViolationTab,
  // '/yaml': PolicyTemplateTab,
}

class ResourceDetails extends React.Component {

  constructor(props) {
    super(props)
    this.getBreadcrumb = this.getBreadcrumb.bind(this)

    this.otherBinding = {}
    const { routes } = this.props
    this.renderOverview = this.renderOverview.bind(this)
    routes.forEach(route=>{
      this.otherBinding[route] = this.renderOther.bind(this, route)
    })
  }

  componentWillMount() {
    const { updateSecondaryHeader, tabs, launch_links, match, location } = this.props
    updateSecondaryHeader(this.getPolicyName(location), getTabs(tabs, (tab, index) => index === 0 ? match.url : `${match.url}/${tab}`), this.getBreadcrumb(), launch_links)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      const { updateSecondaryHeader, tabs, launch_links, match } = this.props
      updateSecondaryHeader(this.getPolicyName(nextProps.location), getTabs(tabs, (tab, index) => index === 0 ? match.url : `${match.url}/${tab}`), this.getBreadcrumb(nextProps.location), launch_links)
    }
    const {refreshControl, items, updateResourceToolbar} = nextProps
    if (!_.isEqual(refreshControl, this.props.refreshControl) ||
        !_.isEqual(items, this.props.items)) {
      updateResourceToolbar(refreshControl, {})
    }
  }

  render() {
    const { match, routes } = this.props
    return (
      <Switch>
        <Route exact path={match.url} render={this.renderOverview} />
        {routes && routes.map((route) =>
          <Route key={route} path={`${match.url}${route}`} render={this.otherBinding[route]} />
        )}
        <Redirect to={match.url} />
      </Switch>
    )
  }

  renderOverview() {
    const { match, resourceType, staticResourceData, children, items, error, loading } = this.props
    return (
      <div>
        <PolicyDetailsOverview
          resourceType={resourceType}
          params={match.params}
          item={items}
          staticResourceData={staticResourceData}
          modules={children}
          error={error}
          loading={loading}
        />
      </div>
    )
  }

  renderOther(route) {
    const { match, resourceType, staticResourceData, tabs, items, loading, error} = this.props
    const Component = components[route]
    return (
      <Component
        resourceType={resourceType}
        params={match.params}
        tabs={tabs}
        items={items}
        baseUrl={match.url}
        staticResourceData={staticResourceData}
        loading={loading}
        error={error}
      />
    )
  }

  getBreadcrumb(location) {
    const breadcrumbItems = []
    location = location || this.props.location
    const { tabs, resourceType, refreshControl } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.replace(/\/$/, '').split('/'),
          lastSegment = urlSegments[urlSegments.length - 1],
          currentTab = tabs.find(tab => tab === lastSegment)

    if(currentTab === 'violation'){
      refreshControl.stopPolling()
    }
    // The base path, calculated by the current location minus params
    const paramsLength = 2

    breadcrumbItems.push({
      label: msgs.get(`tabs.${resourceType.name.toLowerCase()}`, locale),
      url: urlSegments.slice(0, (urlSegments.length - (paramsLength + (currentTab ? 1 : 0)))).join('/')
    })
    breadcrumbItems.push({
      label: this.getPolicyName(location),
      noLocale: true,
      url: currentTab ? location.pathname.replace(`/${currentTab}`, '') : location.pathname
    })

    // eslint-disable-next-line no-console
    console.log('Goes to that')
    return breadcrumbItems
  }

  getPolicyName(location) {
    const urlSegments = location.pathname.split('/')
    const lastSegment = urlSegments[urlSegments.length - 1]
    if( lastSegment === 'violation'|| lastSegment === 'yaml' ){
      return urlSegments[urlSegments.length - 2]
    }
    return lastSegment
  }
}

ResourceDetails.contextTypes = {
  locale: PropTypes.string
}

ResourceDetails.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  error: PropTypes.any,
  items: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.array
  ]),
  launch_links: PropTypes.object,
  loading: PropTypes.bool,
  location: PropTypes.object,
  match: PropTypes.object,
  refreshControl: PropTypes.object,
  resourceType: PropTypes.object,
  routes: PropTypes.array,
  staticResourceData: PropTypes.object,
  tabs: PropTypes.array,
  updateResourceToolbar: PropTypes.func,
  updateSecondaryHeader: PropTypes.func,
}

const mapStateToProps = (state) => {
  const {resourceToolbar: {activeFilters}} = state
  return { activeFilters }
}

const mapDispatchToProps = dispatch => {
  return {
    updateResourceToolbar: (refreshControl) => dispatch(updateResourceToolbar(refreshControl, {})),
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceDetails))
