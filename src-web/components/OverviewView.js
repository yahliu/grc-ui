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
import PropTypes from 'prop-types'
import resources from '../../lib/shared/resources'
import { Loading, Notification } from 'carbon-components-react'
import ResourceToolbar from './common/ResourceToolbar'
import { getPolicyFilters, filterPolicies } from '../../lib/client/filter-helper'
import TopViolationsModule from './modules/TopViolationsModule'
import PolicyCardsModule from './modules/PolicyCardsModule'
import msgs from '../../nls/platform.properties'

resources(() => {
  require('../../scss/overview-view.scss')
})

export default class OverviewView extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      filters: {},
    }
    this.updateFilters = this.updateFilters.bind(this)
  }

  componentWillReceiveProps(){
    this.setState((prevState, props) => {
      return { filters: getPolicyFilters(props.policies, prevState.filters) }
    })
  }

  render() {
    const { locale } = this.context
    const { loading, error, policies, refreshControl, timestamp } = this.props
    const { filters } = this.state

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    const filteredPolicies = filterPolicies(policies, filters, locale)
    return (
      <div className='overview-view'>
        <ResourceToolbar
          refreshControl={refreshControl}
          timestamp={timestamp}
          filters={filters}
          updateFilters={this.updateFilters} />
        <TopViolationsModule policies={filteredPolicies} />
        <PolicyCardsModule policies={filteredPolicies} />
      </div>
    )
  }

  updateFilters = (filters) => {
    this.setState(()=>{
      return {filters}
    })
  }
}

OverviewView.propTypes = {
  error: PropTypes.object,
  loading: PropTypes.bool,
  policies: PropTypes.array,
  refreshControl: PropTypes.object,
  timestamp: PropTypes.string,
}
