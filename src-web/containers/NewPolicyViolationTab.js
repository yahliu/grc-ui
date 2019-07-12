/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSecondaryHeader } from '../actions/common'
import { POLICY_REFRESH_INTERVAL_COOKIE, RESOURCE_TYPES } from '../../lib/shared/constants'
import { getPollInterval } from '../components/common/RefreshTimeSelect'
import ResourceTableModule from '../components/common/ResourceTableModuleFromProps'
// import { RESOURCE_TYPES } from '../../lib/shared/constants'
import {  Loading } from 'carbon-components-react'
import lodash from 'lodash'
import msgs from '../../nls/platform.properties'
import { Query } from 'react-apollo'
import { HCMPolicyViolations } from '../../lib/client/queries'
import { getTabs } from '../../lib/client/resource-helper'
import NoResource from '../components/common/NoResource'


class NewPolicyViolationTab extends React.Component{
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { updateSecondaryHeader, baseUrl, params, tabs } = this.props
    // details page mode
    if (params) {
      updateSecondaryHeader(this.getPolicyName(), getTabs(tabs, (tab, index) => {
        return index === 0 ? baseUrl : `${baseUrl}/${tab}`
      }), this.getBreadcrumb())
    }
  }

  getPolicyName() {
    const { location } = this.props,
          urlSegments = location.pathname.split('/')
    return urlSegments[urlSegments.length - 2]
  }

  getBreadcrumb() {
    const breadcrumbItems = []
    const { tabs, location, resourceType } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.split('/'),
          lastSegment = urlSegments[urlSegments.length - 1],
          currentTab = tabs.find(tab => tab === lastSegment)

    // The details path
    if (resourceType.name === RESOURCE_TYPES.HCM_COMPLIANCES.name) {
      breadcrumbItems.push({
        label: msgs.get(`tabs.${resourceType.name.toLowerCase()}`, locale),
        url: urlSegments.slice(0, 4).join('/')
      })

      breadcrumbItems.push({
        label: urlSegments[5],
        url: location.pathname.replace(/compliancePolicy\/[A-Za-z0-9-]+\/[A-Za-z0-9-]+/, '')
      })

      if (location.pathname.includes('/compliancePolicy')) {
        const label = location.pathname.match(/compliancePolicy\/[A-Za-z0-9-]+/)[0].replace('compliancePolicy/', '')
        breadcrumbItems.push({
          label,
          url: currentTab ? location.pathname.replace(`/${currentTab}`, '') : location.pathname
        })
      }
    }

    return breadcrumbItems
  }

  render() {
    const url = lodash.get(this.props, 'match.url')
    const urlSegments = url.split('/')
    const policyName = urlSegments[urlSegments.length - 2]
    const {staticResourceData, params} = this.props
    const pollInterval = getPollInterval(POLICY_REFRESH_INTERVAL_COOKIE)

    return (
      <Query query={HCMPolicyViolations} pollInterval={pollInterval} variables={{policyName: policyName}}>
        {({ data, loading }) => {
          if (loading) {
            return (<Loading withOverlay={false} className='content-spinner' />)
          }
          if( data.violations && data.violations.length > 0){
            return <ResourceTableModule definitionsKey='policyViolations' staticResourceData={staticResourceData} resourceData={data} {...params} />
          }
          else {
            return <NoResource title={msgs.get('table.title.no.violation', this.context.locale)} />
          }
        }}
      </Query>
    )
  }
}

NewPolicyViolationTab.contextTypes = {
  locale: PropTypes.string
}

NewPolicyViolationTab.propTypes = {
  baseUrl: PropTypes.string,
  location: PropTypes.object,
  params: PropTypes.object,
  // reload: PropTypes.func,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object,
  tabs: PropTypes.array,
  updateSecondaryHeader: PropTypes.func,

}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewPolicyViolationTab))
