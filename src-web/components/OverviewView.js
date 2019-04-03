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
import { filterPolicies, getAvailablePolicyFilters, getSavedViewState, saveViewState} from '../../lib/client/filter-helper'
import { POLICY_OVERVIEW_STATE_COOKIE } from '../../lib/shared/constants'
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
    this.state= {
      viewState: getSavedViewState(POLICY_OVERVIEW_STATE_COOKIE),
    }
    this.onUnload = this.onUnload.bind(this)
    window.addEventListener('beforeunload', this.onUnload)
    this.updateViewState = this.updateViewState.bind(this)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload)
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

    const { viewState } = this.state
    const filteredPolicies = filterPolicies(policies, activeFilters, locale)
    return (
      <div className='overview-view'>
        <TopViolationsModule
          viewState={viewState}
          updateViewState={this.updateViewState}
          policies={filteredPolicies} />
        <PolicyCardsModule
          viewState={viewState}
          updateViewState={this.updateViewState}
          policies={filteredPolicies}
          activeFilters={activeFilters}
          handleDrillDownClick={handleDrillDownClick}
          handleDisplayChange={handleDisplayChange} />
      </div>
    )
  }

  updateViewState(states) {
    this.setState(prevState=>{
      return {viewState:  Object.assign(prevState.viewState, states)}
    })
  }

  onUnload() {
    saveViewState(POLICY_OVERVIEW_STATE_COOKIE, this.state.viewState)
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

