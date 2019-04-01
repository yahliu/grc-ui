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
import { filterPolicies, getAvailablePolicyFilters } from '../../lib/client/filter-helper'
import TopViolationsModule from './modules/TopViolationsModule'
import PolicyCardsModule from './modules/PolicyCardsModule'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../scss/overview-view.scss')
})

export class OverviewView extends React.Component {

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

  render() {
    const { locale } = this.context
    const { loading, error, policies, activeFilters={}, handleDrillDownClick, handleDisplayChange } = this.props

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    const filteredPolicies = filterPolicies(policies, activeFilters, locale)
    return (
      <div className='overview-view'>
        <TopViolationsModule policies={filteredPolicies} />
        <PolicyCardsModule policies={filteredPolicies}
          activeFilters={activeFilters}
          handleDrillDownClick={handleDrillDownClick}
          handleDisplayChange={handleDisplayChange} />
      </div>
    )
  }
}

OverviewView.propTypes = {
  activeFilters: PropTypes.object,
  error: PropTypes.object,
  handleDisplayChange: PropTypes.func,
  handleDrillDownClick: PropTypes.func,
  loading: PropTypes.bool,
  policies: PropTypes.array,
  refreshControl: PropTypes.object,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OverviewView))

