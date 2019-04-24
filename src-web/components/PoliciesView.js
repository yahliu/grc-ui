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
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateResourceToolbar } from '../actions/common'
import { Loading, Notification } from 'carbon-components-react'
import ClusterComplianceTab from '../containers/ClusterComplianceTab'
import { filterPolicies, getAvailablePolicyFilters } from '../../lib/client/filter-helper'
import { showResourceToolbar, hideResourceToolbar } from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../scss/policies-view.scss')
})

export class PoliciesView extends React.Component {

  constructor (props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    const {refreshControl, policies, updateResourceToolbar} = nextProps
    if (!_.isEqual(refreshControl, this.props.refreshControl) ||
        !_.isEqual(policies, this.props.policies)) {
      const { locale } = this.context
      updateResourceToolbar(refreshControl, getAvailablePolicyFilters(policies, locale))
    }
  }

  formatExpandablePolicies(policies) {
    const result = []
    policies.forEach(policy => {
      const subItems = [{name: 'policy.pb', items: policy.placementBindings.map(pb => pb.metadata.name)},
        {name: 'policy.pp', items: policy.placementPolicies.map(pp => pp.metadata.name)}]
      result.push({...policy, subItems})
    })
    return result
  }

  render() {
    const { locale } = this.context
    const { loading, error, policies, activeFilters={}, secondaryHeaderProps, refreshControl } = this.props
    hideResourceToolbar()

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    showResourceToolbar()
    const filteredPolicies = filterPolicies(policies, activeFilters, locale)
    const expandablePolicies = this.formatExpandablePolicies(filteredPolicies)
    return (
      <div className='policies-view'>
        <ClusterComplianceTab refreshControl={refreshControl} policies={expandablePolicies} secondaryHeaderProps={secondaryHeaderProps} />
      </div>
    )
  }

}

PoliciesView.propTypes = {
  activeFilters: PropTypes.object,
  error: PropTypes.object,
  loading: PropTypes.bool,
  policies: PropTypes.array,
  refreshControl: PropTypes.object,
  secondaryHeaderProps: PropTypes.object,
  updateResourceToolbar: PropTypes.func,
}

const mapStateToProps = (state) => {
  const {resourceToolbar: {activeFilters}} = state
  return { activeFilters }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateResourceToolbar: (refreshControl, availableFilters) => dispatch(updateResourceToolbar(refreshControl, availableFilters)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PoliciesView))

