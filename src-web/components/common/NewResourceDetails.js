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
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { Notification, Loading } from 'carbon-components-react'
// import { REQUEST_STATUS } from '../../actions/index'
import { getTabs } from '../../../lib/client/resource-helper'
import { updateSecondaryHeader } from '../../actions/common'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import lodash from 'lodash'
import msgs from '../../../nls/platform.properties'
import NewResourceOverview from './NewResourceOverview'
import CompliancePolicyDetail from './CompliancePolicyDetail'
import { POLICY_REFRESH_INTERVAL_COOKIE } from '../../../lib/shared/constants'
import { getPollInterval } from './RefreshTimeSelect'
import NewPolicyTemplateTab from '../../containers/NewPolicyTemplateTab'
import NewPolicyViolationTab from '../../containers/NewPolicyViolationTab'

const withResource = (Component) => {
  // const mapDispatchToProps = (dispatch, ownProps) => {
  //   const { resourceType, params } = ownProps
  //   return {
  //     fetchResource: () => dispatch(fetchResource(resourceType, params.namespace, params.name))
  //   }
  // }

  const mapStateToProps = (state, ownProps) => {
    const { list: typeListName } = ownProps.resourceType,
          error = state[typeListName].err
    return {
      status: state[typeListName].status,
      statusCode: error && error.response && error.response.status
    }
  }

  return connect(mapStateToProps)(class extends React.PureComponent {
    static displayName = 'ResourceDetailsWithResouce'
    static propTypes = {
      // fetchResource: PropTypes.func,
      // status: PropTypes.string,
      // statusCode: PropTypes.object,
      error: PropTypes.any,
      loading: PropTypes.any,
    }

    constructor(props) {
      super(props)
      this.state = {
        xhrPoll: false,
      }
    }

    componentWillMount() {
      const pollInterval = getPollInterval(POLICY_REFRESH_INTERVAL_COOKIE)
      if (pollInterval) {
        var intervalId = setInterval(this.reload.bind(this), pollInterval)
        this.setState({ intervalId: intervalId })
      }
    }

    componentWillUnmount() {
      clearInterval(this.state.intervalId)
    }

    reload() {
      if (!this.props.loading) {
        this.setState({ xhrPoll: true })
      }
    }

    render() {
      const { error, loading } = this.props
      if (error) {
        return <Notification
          title=''
          className='persistent'
          subtitle={msgs.get(error, this.context.locale)}
          kind='error' />
      } else if (loading) {
        return <Loading className='resource-detail-content-spinner' />
      }
      return <Component  {...this.props} />
    }
  })
}

const OverviewTab = withResource(NewResourceOverview)

const components = {
  '/compliancePolicy/:policyName/:policyNamespace': CompliancePolicyDetail,
  '/violation': NewPolicyViolationTab,
  '/yaml': NewPolicyTemplateTab,
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
    const { updateSecondaryHeader, tabs, launch_links, match, refreshControl, location } = this.props
    updateSecondaryHeader(this.getPolicyName(location), getTabs(tabs, (tab, index) => index === 0 ? match.url : `${match.url}/${tab}`), this.getBreadcrumb(), launch_links)
    refreshControl.stopPolling()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      const { updateSecondaryHeader, tabs, launch_links, match } = this.props
      updateSecondaryHeader(this.getPolicyName(nextProps.location), getTabs(tabs, (tab, index) => index === 0 ? match.url : `${match.url}/${tab}`), this.getBreadcrumb(nextProps.location), launch_links)
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
    const { match, resourceType, staticResourceData, children, refreshControl, items } = this.props
    refreshControl.stopPolling()
    return (
      <div>
        <OverviewTab
          resourceType={resourceType}
          params={match.params}
          item={items}
          staticResourceData={staticResourceData}
          modules={children}
        />
      </div>
    )
  }

  renderOther(route) {
    const { match, resourceType, staticResourceData, tabs, refreshControl, items, loading, error} = this.props
    refreshControl.stopPolling()
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
    const { tabs, resourceType } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.replace(/\/$/, '').split('/'),
          lastSegment = urlSegments[urlSegments.length - 1],
          currentTab = tabs.find(tab => tab === lastSegment)

    // The base path, calculated by the current location minus params
    const paramsLength = 2

    breadcrumbItems.push({
      label: msgs.get(`tabs.${resourceType.name.toLowerCase()}`, locale),
      url: urlSegments.slice(0, (urlSegments.length - (paramsLength + (currentTab ? 1 : 0)))).join('/')
    })
    breadcrumbItems.push({
      label: this.getPolicyName(location),
      url: currentTab ? location.pathname.replace(`/${currentTab}`, '') : location.pathname
    })
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
  updateSecondaryHeader: PropTypes.func,
}

const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(() => ({}), mapDispatchToProps)(ResourceDetails))
