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
import resources from '../../../lib/shared/resources'
import { updateActiveFilters } from '../../actions/common'
import moment from 'moment'
import RefreshTimeSelect from './RefreshTimeSelect'
import ResourceFilterView from './ResourceFilterView'
import { CSSTransition } from 'react-transition-group'
import { Loading } from 'carbon-components-react'
import { REFRESH_TIMES } from '../../../lib/shared/constants'
import '../../../graphics/diagramIcons.svg'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/resource-toolbar.scss')
})

const RefreshTime = ({ reloading, timestamp }) => {
  const time = moment(new Date(timestamp)).format('h:mm:ss A')
  return (
    <div className='refresh-time-container'>
      {reloading ?<Loading withOverlay={false} small /> : null }
      <div>{time}</div>
    </div>
  )
}

RefreshTime.propTypes = {
  reloading: PropTypes.bool,
  timestamp: PropTypes.string,
}

export class ResourceToolbar extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      filterViewOpen: props.filterViewOpen,
    }
    this.handleFilterClose = this.handleFilterClose.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.toggleFilterModel = this.toggleFilterModel.bind(this)
    this.toggleFilterModelPress = this.toggleFilterModelPress.bind(this)
  }

  render() {
    const { locale } = this.context
    const { availableFilters={}, activeFilters={}, refreshControl={} } = this.props
    if (Object.keys(refreshControl).length===0) {
      return null
    }
    const { reloading, timestamp } = refreshControl
    const { filterViewOpen } = this.state
    return (
      <div id='resource-toolbar' className='resource-toolbar'>
        <div className='resource-toolbar-container' >
          <div className='resource-toolbar-buttons' >
            {/* refresh time button */}
            <RefreshTimeSelect
              refreshValues = {REFRESH_TIMES}
              refreshControl = {refreshControl}
            />
            {/* filter results button */}
            <div tabIndex='0' role={'button'}
              onClick={this.toggleFilterModel} onKeyPress={this.toggleFilterModelPress}>
              <svg className='button-icon'>
                <use href={'#diagramIcons_filter'} ></use>
              </svg>
              <div className='button-label'>
                {msgs.get('overview.menu.filter', locale)}
              </div>
            </div>
          </div>
          {timestamp&&<RefreshTime timestamp={timestamp} reloading={reloading} />}
        </div>
        <CSSTransition
          in={filterViewOpen}
          timeout={300}
          classNames="transition"
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <ResourceFilterView
            updateFilters={this.updateFilters}
            onClose={this.handleFilterClose}
            activeFilters={activeFilters}
            availableFilters={availableFilters}
          />
        </CSSTransition>
      </div>)
  }

  toggleFilterModel() {
    this.setState(({filterViewOpen})=>{
      return { filterViewOpen: !filterViewOpen }
    })
  }

  toggleFilterModelPress(e) {
    if ( e.key === 'Enter') {
      this.toggleFilterModel()
    }
  }

  handleFilterClose = () => {
    this.setState({ filterViewOpen: false })
  }

  updateFilters = (key, value, checked) => {
    this.updateActiveFilter(key, value, checked)
  }

  updateActiveFilter = (key, value, checked) => {
    const {updateActiveFilters} = this.props
    const activeFilters = _.cloneDeep(this.props.activeFilters||{})
    let activeSet = activeFilters[key]
    if (!activeSet) {
      activeSet = activeFilters[key] = new Set()
    }
    if (value==='all') {
      activeSet.clear()
    } else {
      if (checked) {
        activeSet.add(value)
      } else {
        activeSet.delete(value)
      }
    }
    updateActiveFilters(activeFilters)
  }
}

ResourceToolbar.propTypes = {
  activeFilters: PropTypes.object,
  availableFilters: PropTypes.object,
  filterViewOpen: PropTypes.bool,
  refreshControl: PropTypes.object,
  updateActiveFilters: PropTypes.func,
}


const mapStateToProps = (state) => {
  const {resourceToolbar: {availableFilters, activeFilters, refreshControl}} = state
  return { availableFilters, activeFilters, refreshControl }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateActiveFilters: (activeFilters) => dispatch(updateActiveFilters(activeFilters))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceToolbar))
