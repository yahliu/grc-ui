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
import {createResources, updateResourceToolbar} from '../actions/common'
import { Loading, Notification } from 'carbon-components-react'
import { filterPolicies, filterFindings, getAvailablePolicyFilters, getSavedViewState, saveViewState} from '../../lib/client/filter-helper'
import { showResourceToolbar, hideResourceToolbar } from '../../lib/client/resource-helper'
import {POLICY_OVERVIEW_STATE_COOKIE, RESOURCE_TYPES} from '../../lib/shared/constants'
import RecentActivityModule from './modules/RecentActivityModule'
// import TopViolationsModule from './modules/TopViolationsModule'
// import TopFindingsModule from './modules/TopFindingsModule'
import ImpactedControlsModule from './modules/ImpactedControlsModule'
import PolicySummaryModule from './modules/PolicySummaryModule'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'
import NoResource from '../components/common/NoResource'
import ResourceFilterBar from '../components/common/ResourceFilterBar'
import createDocLink from '../components/common/CreateDocLink'
import queryString from 'query-string'

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
    this.handleDrillDownClickOverview = this.handleDrillDownClickOverview.bind(this)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload)
    this.onUnload()
  }

  componentWillReceiveProps(nextProps) {
    const {refreshControl, policies, findings, updateResourceToolbar} = nextProps
    if (!_.isEqual(refreshControl, this.props.refreshControl) ||
        !_.isEqual(policies, this.props.policies)) {
      const { locale } = this.context
      updateResourceToolbar(refreshControl, getAvailablePolicyFilters(policies, findings, locale))
    }
  }

  render() {
    const { locale } = this.context
    const { loading, error, policies, findings, activeFilters={}, handleCreateResource } = this.props
    hideResourceToolbar()

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    if ((!policies || policies.length === 0) && !loading) {
      return (
        <NoResource
          title={msgs.get('no-resource.title', [msgs.get('routes.grc', locale)], locale)}
          detail={msgs.get('no-resource.detail.policy', locale)}>
          {createDocLink(this.context.locale, handleCreateResource)}
        </NoResource>
      )
    }
    showResourceToolbar()
    const { viewState } = this.state
    const availableFilters =  getAvailablePolicyFilters(policies, findings, locale)
    const filteredPolicies = filterPolicies(policies, activeFilters, locale)
    const filteredFindings = filterFindings(findings, activeFilters, locale)
    return (
      <div className='overview-view'>
        <ResourceFilterBar />
        <RecentActivityModule
          policies={filteredPolicies}
          findings={filteredFindings}
          handleDrillDownClick={this.handleDrillDownClickOverview}
          viewState={viewState}
          updateViewState={this.updateViewState} />
        <ImpactedControlsModule
          viewState={viewState}
          updateViewState={this.updateViewState}
          policies={filteredPolicies}
          findings={filteredFindings}
          activeFilters={activeFilters}
          availableFilters={availableFilters}
          handleDrillDownClick={this.handleDrillDownClickOverview} />
        <PolicySummaryModule
          policies={filteredPolicies}
          findings={filteredFindings} />
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

  handleDrillDownClickOverview(parentType, parentName){
    if(parentType){
      const paraURL = {}
      paraURL.card = false
      switch(parentType.toLowerCase()){
      case 'policy violations'://RecentActivityModule
        paraURL.index = 0
        break
      case 'cluster violations'://RecentActivityModule
        paraURL.index = 1
        break
      case 'policies'://TopViolationsModule
        paraURL.index = 0
        if(parentName){
          paraURL.name = parentName //highlight name
          paraURL.side = true //auto open side panel under highlight name
        }
        break
      case 'clusters'://TopViolationsModule
        paraURL.index = 1
        if(parentName){
          paraURL.name = parentName
          paraURL.side = true
        }
        break
      default:
        break
      }
      this.props.history.push(`${this.props.location.pathname}/all?${queryString.stringify(paraURL)}`)
    }
  }
}

OverviewView.propTypes = {
  activeFilters: PropTypes.object,
  error: PropTypes.object,
  findings: PropTypes.array,
  handleCreateResource: PropTypes.func,
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  location: PropTypes.object,
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
    handleCreateResource: (dispatch, yaml) => dispatch(createResources(RESOURCE_TYPES.HCM_POLICIES, yaml))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OverviewView))

