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
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateResourceToolbar } from '../actions/common'
import { Loading, Notification } from 'carbon-components-react'
import { filterPolicies, filterFindings, getAvailableGrcFilters, getSavedViewState, saveViewState } from '../../lib/client/filter-helper'
import { showResourceToolbar, hideResourceToolbar } from '../../lib/client/resource-helper'
import {POLICY_OVERVIEW_STATE_COOKIE} from '../../lib/shared/constants'
import RecentActivityModule from './modules/RecentActivityModule'
import ImpactedControlsModule from './modules/ImpactedControlsModule'
import PolicySummaryModule from './modules/PolicySummaryModule'
import config from '../../lib/shared/config'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'
import NoResource from '../components/common/NoResource'
import ResourceFilterBar from '../components/common/ResourceFilterBar'
import createDocLink from '../components/common/CreateDocLink'
import queryString from 'query-string'

export class OverviewView extends React.Component {

  constructor (props) {
    super(props)
    this.state= {
      viewState: getSavedViewState(POLICY_OVERVIEW_STATE_COOKIE),
    }
    this.onUnload = this.onUnload.bind(this)
    window.addEventListener('beforeunload', this.onUnload)
    this.updateViewState = this.updateViewState.bind(this)
    this.handleCreatePolicy = this.handleCreatePolicy.bind(this)
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
      updateResourceToolbar(refreshControl, getAvailableGrcFilters(policies, findings, locale))
    }
  }

  render() {
    const { locale } = this.context
    const { loading, error, policies, findings, activeFilters={} } = this.props
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
          {createDocLink(locale, this.handleCreatePolicy, msgs.get('routes.create.policy', locale))}
        </NoResource>
      )
    }
    showResourceToolbar()
    const { viewState } = this.state
    const availableFilters =  getAvailableGrcFilters(policies, findings, locale)
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

  handleCreatePolicy(){
    this.props.history.push(`${config.contextPath}/policies/create`)
  }

  handleDrillDownClickOverview(parentType, parentName){
    if(parentType){
      let page = 'all'
      const paraURL = {}
      switch(parentType.toLowerCase()){
      case 'policy violations'://RecentActivityModule to policies page, all policy violations
        paraURL.index = 0
        break
      case 'cluster violations'://RecentActivityModule to policies page, all cluster violations
        paraURL.index = 1
        break
      case 'high'://RecentActivityModule to security findings page, all high severity findings
      case 'medium'://all medium severity findings
      case 'low'://all low severity findings
        page = 'findings'
        paraURL.index = 0
        paraURL.filters = `{"textsearch":["${parentType}"]}`
        break
      case 'policies'://TopInformationModule to policies page with specific policy violation name
        paraURL.index = 0
        if(parentName){
          paraURL.name = parentName //highlight this policy violation name
          paraURL.side = true //auto open side panel under this highlight name
        }
        break
      case 'clusters'://TopInformationModule to policies page with specific cluster violation name
        paraURL.index = 1
        if(parentName){
          paraURL.name = parentName //highlight this cluster violation name
          paraURL.side = true //auto open side panel under this highlight name
        }
        break
      case 'security findings'://TopInformationModule to security findings page with specific security finding name
        page = 'findings'
        paraURL.index = 0
        if(parentName){
          paraURL.filters = `{"textsearch":["${parentName}"]}` //current no highlight and side panel for security findings page, just filter name
        }
        break
      case 'finding clusters'://TopInformationModule to security findings page with specific finding cluster name
        page = 'findings'
        paraURL.index = 1
        if(parentName){
          paraURL.filters = `{"textsearch":["${parentName}"]}` //current no highlight and side panel for finding clusters page, just filter name
        }
        break
      default:
        break
      }
      this.props.history.push(`${this.props.location.pathname}/${page}?${queryString.stringify(paraURL)}`)
    }
  }
}

OverviewView.propTypes = {
  activeFilters: PropTypes.object,
  error: PropTypes.object,
  findings: PropTypes.array,
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
    updateResourceToolbar: (refreshControl, availableFilters) => dispatch(updateResourceToolbar(refreshControl, availableFilters))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OverviewView))

