/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
//FindingsView might be merged with PoliciesView as GrcView in future for reuse after finding hifi is done
import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../lib/shared/resources'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { createResources, updateResourceToolbar, updateActiveFilters } from '../actions/common'
import { Loading, Notification } from 'carbon-components-react'
import { POLICY_OVERVIEW_STATE_COOKIE, RESOURCE_TYPES } from '../../lib/shared/constants'
import FindingCardModule from './modules/FindingCardModule'
import FindingToggleModule from './modules/FindingToggleModule'
import { filterPolicies, getAvailablePolicyFilters, getSavedViewState, saveViewState } from '../../lib/client/filter-helper'
import { showResourceToolbar, hideResourceToolbar } from '../../lib/client/resource-helper'
import NoResource from './common/NoResource'
import createDocLink from './common/CreateDocLink'
import ResourceFilterBar from './common/ResourceFilterBar'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'
import queryString from 'query-string'

resources(() => {
  require('../../scss/policies-view.scss')
})

class FindingsView extends React.Component {

  constructor (props) {
    super(props)
    this.state= {
      viewState: getSavedViewState(POLICY_OVERVIEW_STATE_COOKIE),
    }
    this.onUnload = this.onUnload.bind(this)
    window.addEventListener('beforeunload', this.onUnload)
    this.updateViewState = this.updateViewState.bind(this)
    this.handleDrillDownClickPoliciesView = this.handleDrillDownClickPoliciesView.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {refreshControl, policies, updateResourceToolbar} = nextProps
    if (!_.isEqual(refreshControl, this.props.refreshControl) ||
        !_.isEqual(policies, this.props.policies)) {
      const { locale } = this.context
      updateResourceToolbar(refreshControl, getAvailablePolicyFilters(policies, [], locale))
    }
  }

  render() {
    const { locale } = this.context
    const { viewState } = this.state
    const { loading, error, policies, activeFilters={}, secondaryHeaderProps, refreshControl, handleCreateResource, location } = this.props
    hideResourceToolbar()

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    if ((!policies || policies.length === 0) && !loading) {
      return (
        <NoResource
          title={msgs.get('no-resource.title', [msgs.get('routes.policies', locale)], locale)}
          detail={msgs.get('no-resource.detail.policy', locale)}>
          {createDocLink(this.context.locale, handleCreateResource)}
        </NoResource>
      )
    }

    showResourceToolbar()
    const filteredPolicies = filterPolicies(policies, activeFilters, locale)
    const urlParams = queryString.parse(location.search)
    const showPolicyCard = urlParams.card==='false' ? false : true
    const policyTabToggleIndex = urlParams.index ? Number(urlParams.index) : 0
    const showPolicyTabToggle = urlParams.toggle==='false' ? false : true
    const highLightRowName = urlParams.name ? urlParams.name : ''
    const showSidePanel = urlParams.side==='true' ? true : false
    return (
      <div className='policies-view'>
        <ResourceFilterBar />
        <FindingCardModule
          viewState={viewState}
          updateViewState={this.updateViewState}
          policies={filteredPolicies}
          activeFilters={activeFilters}
          showPolicyCard={showPolicyCard}
          handleDrillDownClick={this.handleDrillDownClickPoliciesView}
        />
        <FindingToggleModule refreshControl={refreshControl} policies={filteredPolicies} secondaryHeaderProps={secondaryHeaderProps} locale={locale} policyTabToggleIndex={policyTabToggleIndex} showPolicyTabToggle={showPolicyTabToggle} highLightRowName={highLightRowName} showSidePanel={showSidePanel} />
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

  handleDrillDownClickPoliciesView(key, value, type){
    //step 1 add activeFilters when click PolicyCardsModule
    const {updateActiveFilters} = this.props
    const activeFilters = _.cloneDeep(this.props.activeFilters||{})//loadash recursively deep clone
    value = _.startCase(value.replace(' ', '-'))//covert filter name on policy card to start case to match side bar filter
    let activeSet = activeFilters[key]
    if (!activeSet) {
      activeSet = activeFilters[key] = new Set()}
    activeSet.add(value)
    updateActiveFilters(activeFilters)

    //step 2 update url when click PolicyCardsModule
    const paraURL = {}
    paraURL.card=false
    paraURL.toggle=false
    type.toLowerCase()==='cluster' ? paraURL.index=1 : paraURL.index=0
    let urlString = queryString.stringify(paraURL)
    //also append PolicyToggleModule search input filter to the end of url if existing
    const curentURL = queryString.parse(location.search)
    if(curentURL.filters && curentURL.filters!==''){
      urlString = `${urlString}&filters=${curentURL.filters}`}
    this.props.history.push(`${this.props.location.pathname}?${urlString}`)
  }
}

FindingsView.propTypes = {
  activeFilters: PropTypes.object,
  error: PropTypes.object,
  handleCreateResource: PropTypes.func,
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  location: PropTypes.object,
  policies: PropTypes.array,
  refreshControl: PropTypes.object,
  secondaryHeaderProps: PropTypes.object,
  updateActiveFilters: PropTypes.func,
  updateResourceToolbar: PropTypes.func,
}

const mapStateToProps = (state) => {
  const {resourceToolbar: {activeFilters}} = state
  return { activeFilters }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateResourceToolbar: (refreshControl, availableFilters) => dispatch(updateResourceToolbar(refreshControl, availableFilters)),
    handleCreateResource: (dispatch, yaml) => dispatch(createResources(RESOURCE_TYPES.HCM_POLICIES, yaml)),
    updateActiveFilters: (activeFilters) => dispatch(updateActiveFilters(activeFilters))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FindingsView))

