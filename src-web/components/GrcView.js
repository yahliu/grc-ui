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
import { updateResourceToolbar, updateActiveFilters } from '../actions/common'
import { Loading, Notification } from 'carbon-components-react'
import { GRC_VIEW_STATE_COOKIE, GRC_FILTER_STATE_COOKIE } from '../../lib/shared/constants'
import GrcCardsModule from './modules/GrcCardsModule'
import GrcToggleModule from './modules/GrcToggleModule'
import { filterPolicies, filterFindings, getAvailableGrcFilters, getSavedGrcState, saveGrcState, replaceGrcState, combineResourceFilters } from '../../lib/client/filter-helper'
import { showResourceToolbar, hideResourceToolbar } from '../../lib/client/resource-helper'
import NoResource from './common/NoResource'
import createDocLink from './common/CreateDocLink'
import ResourceFilterBar from './common/ResourceFilterBar'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'
import queryString from 'query-string'
import config from '../../lib/shared/config'

resources(() => {
  require('../../scss/grc-view.scss')
})

class GrcView extends React.Component {

  constructor (props) {
    super(props)
    this.state= {
      viewState: getSavedGrcState(GRC_VIEW_STATE_COOKIE)
    }
    this.onUnload = this.onUnload.bind(this)
    window.addEventListener('beforeunload', this.onUnload)
    this.handleCreatePolicy = this.handleCreatePolicy.bind(this)
    this.updateViewState = this.updateViewState.bind(this)
    this.handleDrillDownClickGrcView = this.handleDrillDownClickGrcView.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {refreshControl, grcItems, updateActiveFilters, updateResourceToolbar} = nextProps
    if (!_.isEqual(refreshControl, this.props.refreshControl) ||
        !_.isEqual(grcItems, this.props.grcItems)) {
      const { locale } = this.context
      const displayType = location.pathname.split('/').pop()

      let availableGrcFilters
      switch(displayType) {
      case 'all':
      default:
        availableGrcFilters = getAvailableGrcFilters(grcItems, [], locale)
        break
      case 'findings':
        availableGrcFilters = getAvailableGrcFilters([], grcItems, locale)
        break
      }
      updateResourceToolbar(refreshControl, availableGrcFilters)

      //get (activeFilters ∪ storedFilters) ∩ availableGrcFilters
      const activeFilters = _.cloneDeep(nextProps.activeFilters||{})
      const combinedFilters = combineResourceFilters(activeFilters, getSavedGrcState(GRC_FILTER_STATE_COOKIE), availableGrcFilters)
      //update sessionStorage
      replaceGrcState(GRC_FILTER_STATE_COOKIE, combinedFilters)
      //update active filters
      updateActiveFilters(combinedFilters)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload)
    this.onUnload()
  }

  render() {
    const { locale } = this.context
    const { viewState } = this.state
    const { loading, error, grcItems, activeFilters={}, secondaryHeaderProps, refreshControl, location } = this.props
    hideResourceToolbar()
    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    const displayType = location.pathname.split('/').pop()
    let filterGrcItems
    switch(displayType) {
    case 'all':
    default:
      if ((!grcItems || grcItems.length === 0) && !loading) {
        return (
          <NoResource
            title={msgs.get('no-resource.title', [msgs.get('routes.grc', locale)], locale)}
            detail={msgs.get('no-resource.detail.policy', locale)}>
            {createDocLink(locale, this.handleCreatePolicy, msgs.get('routes.create.policy', locale))}
          </NoResource>
        )
      }
      else {
        filterGrcItems = filterPolicies(grcItems, activeFilters, locale)
      }
      break
    case 'findings':
      if ((!grcItems || grcItems.length === 0) && !loading) {
        return (
          <NoResource
            title={msgs.get('no-resource.title', [msgs.get('routes.grc', locale)], locale)}
            detail={msgs.get('no-resource.detail.item', locale)}>
            {createDocLink(locale, this.handleCreatePolicy, msgs.get('routes.create.policy', locale), false)}
          </NoResource>
        )
      }
      else {
        filterGrcItems = filterFindings(grcItems, activeFilters, locale)
      }
      break
    }

    showResourceToolbar()
    const urlParams = queryString.parse(location.search)
    const showGrcCard = urlParams.card==='false' ? false : true
    const grcTabToggleIndex = urlParams.index ? Number(urlParams.index) : 0
    const showGrcTabToggle = urlParams.toggle==='false' ? false : true
    const highLightRowName = urlParams.name ? urlParams.name : ''
    const showSidePanel = urlParams.side==='true' ? true : false
    return (
      <div className='grc-view'>
        <ResourceFilterBar />
        <GrcCardsModule
          displayType={displayType}
          viewState={viewState}
          updateViewState={this.updateViewState}
          grcItems={filterGrcItems}
          activeFilters={activeFilters}
          showGrcCard={showGrcCard}
          handleDrillDownClick={this.handleDrillDownClickGrcView}
        />
        <GrcToggleModule
          displayType={displayType}
          refreshControl={refreshControl}
          grcItems={filterGrcItems}
          secondaryHeaderProps={secondaryHeaderProps}
          locale={locale}
          grcTabToggleIndex={grcTabToggleIndex}
          showGrcTabToggle={showGrcTabToggle}
          highLightRowName={highLightRowName}
          showSidePanel={showSidePanel}
          handleCreatePolicy={this.handleCreatePolicy} />
      </div>
    )
  }

  updateViewState(states) {
    this.setState(prevState=>{
      return {viewState:  Object.assign(prevState.viewState, states)}
    })
  }

  onUnload() {//saved grc view ui setting
    saveGrcState(GRC_VIEW_STATE_COOKIE, this.state.viewState)
  }

  handleDrillDownClickGrcView(key, value, type, level){
    //step 1 add activeFilters when click GrcCardsModule
    //here for severity level, will not update filter here but just update url
    //then acutally update it in componentWillReceiveProps()
    const {updateActiveFilters} = this.props
    const activeFilters = _.cloneDeep(this.props.activeFilters||{})//loadash recursively deep clone
    value = _.startCase(value.replace(' ', '-'))//covert filter name on policy card to start case to match
    let activeSet
    activeFilters[key] ? activeSet = activeFilters[key] : activeSet = activeFilters[key] = new Set()
    activeSet.add(value)
    //add severity level filter
    activeFilters[type] ? activeSet = activeFilters[type] : activeSet = activeFilters[type] = new Set()
    activeSet.add(level)
    replaceGrcState(GRC_FILTER_STATE_COOKIE, activeFilters)
    updateActiveFilters(activeFilters)

    //step 2 update url when click GrcCardsModule
    const paraURL = {}
    paraURL.card=false
    paraURL.toggle=false
    type.toLowerCase()==='cluster' ? paraURL.index=1 : paraURL.index=0
    let urlString = queryString.stringify(paraURL)
    //also append GrcToggleModule search input filter to the end of url if existing
    const curentURL = queryString.parse(location.search)
    if(curentURL.filters && curentURL.filters!==''){
      urlString = `${urlString}&filters=${curentURL.filters}`}
    this.props.history.push(`${this.props.location.pathname}?${urlString}`)
  }

  handleCreatePolicy(){
    this.props.history.push(`${config.contextPath}/policies/create`)
  }
}

GrcView.propTypes = {
  activeFilters: PropTypes.object,
  error: PropTypes.object,
  grcItems: PropTypes.array,
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  location: PropTypes.object,
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
    updateActiveFilters: (activeFilters) => dispatch(updateActiveFilters(activeFilters))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GrcView))

