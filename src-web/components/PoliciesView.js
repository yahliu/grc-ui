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
import ClusterComplianceTab from '../containers/ClusterComplianceTab'
import ResourceToolbar from './common/ResourceToolbar'
import { getPolicyFilters, filterPolicies } from '../../lib/client/filter-helper'
import msgs from '../../nls/platform.properties'

resources(() => {
  require('../../scss/policies-view.scss')
})

export default class PoliciesView extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      filters: {},
    }
    this.updateFilters = this.updateFilters.bind(this)
  }

  componentWillReceiveProps(nextProps){
    this.setState({ filters: getPolicyFilters(nextProps.policies) })
  }

  render() {
    const { locale } = this.context
    const { loading, error, policies, refreshControl, timestamp, secondaryHeaderProps } = this.props
    const { filters } = this.state

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    const filteredPolicies = filterPolicies(policies, filters)
    return (
      <div className='policies-view'>
        <ResourceToolbar
          refreshControl={refreshControl}
          timestamp={timestamp}
          filters={filters}
          updateFilters={this.updateFilters} />
        <ClusterComplianceTab policies={filteredPolicies} secondaryHeaderProps={secondaryHeaderProps} />
      </div>
    )
  }

  updateFilters = (filters) => {
    this.setState(()=>{
      return {filters}
    })
  }

}

PoliciesView.propTypes = {
  error: PropTypes.object,
  loading: PropTypes.bool,
  policies: PropTypes.array,
  refreshControl: PropTypes.object,
  secondaryHeaderProps: PropTypes.object,
  timestamp: PropTypes.string,
}
