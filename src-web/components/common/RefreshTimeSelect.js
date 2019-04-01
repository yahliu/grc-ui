/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../lib/shared/resources'
import { Select, SelectItem, Loading } from 'carbon-components-react'
import '../../../graphics/diagramIcons.svg'
import config from '../../../lib/shared/config'
import msgs from '../../../nls/platform.properties'
import moment from 'moment'


resources(() => {
  require('../../../scss/refresh-time-select.scss')
})

export default class RefreshTimeSelect extends React.Component {

  static propTypes = {
    refreshControl: PropTypes.object,
    refreshValues: PropTypes.array,
  }

  constructor (props) {
    super(props)
    const { refreshControl: {refreshCookie} } = props
    this.state = {
      pollInterval: getPollInterval(refreshCookie),
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    const { locale } = this.context
    const { refreshValues=[] } = this.props
    this.autoRefreshChoices = refreshValues.map(pollInterval=>{
      let text
      if (pollInterval>=60) {
        text = msgs.get('refresh.interval.minutes', [pollInterval/60], locale)
      } else if (pollInterval!==0) {
        text = msgs.get('refresh.interval.seconds', [pollInterval], locale)
      } else {
        text = msgs.get('refresh.interval.never', locale)
      }
      pollInterval*=1000
      return {text, pollInterval}
    })
  }

  handleClick = () => {
    const {refreshControl: {refetch}} = this.props
    refetch()
  }

  handleKeyPress(e) {
    if ( e.key === 'Enter') {
      const {refreshControl: {refetch}} = this.props
      refetch()
    }
  }


  handleChange = (e) => {
    const {pollInterval} = this.autoRefreshChoices[e.currentTarget.selectedIndex]
    const {refreshControl: {refreshCookie, startPolling, stopPolling}} = this.props
    if (pollInterval===0) {
      stopPolling()
    } else {
      startPolling(pollInterval)
    }
    savePollInterval(refreshCookie, pollInterval)
    this.setState({ pollInterval })
  }

  componentWillReceiveProps(){
    this.setState((prevState, props) => {
      const {refreshControl: {refreshCookie}} = props
      return {pollInterval: getPollInterval(refreshCookie)}
    })
  }

  render() {
    const { pollInterval } = this.state
    if (pollInterval!==undefined) {
      const refresh = msgs.get('refresh', this.context.locale)
      const {refreshControl: {reloading}} = this.props
      return (
        <div className='refresh-time-selection'>
          {reloading?
            <Loading withOverlay={false} small /> :
            <div className='button' tabIndex='0' role={'button'}
              title={refresh} aria-label={refresh}
              onClick={this.handleClick} onKeyPress={this.handleKeyPress}>
              <svg className='button-icon'>
                <use href={'#diagramIcons_autoRefresh'} ></use>
              </svg>
            </div>}
          <Select id='refresh-select' className='selection'
            value={pollInterval}
            hideLabel={true}
            onChange={this.handleChange}>
            {this.autoRefreshChoices.map(({text, pollInterval:value})=> {
              return (
                <SelectItem key={value} text={text} value={value} />
              )
            })}
          </Select>
        </div>
      )
    }
    return null
  }
}

export const getPollInterval = (cookieKey, dfault) => {
  let pollInterval = pollInterval = parseInt(config['featureFlags:liveUpdates']) === 2 ?
    config['featureFlags:liveUpdatesPollInterval'] : dfault
  if (cookieKey) {
    const savedInterval = localStorage.getItem(cookieKey)
    if (savedInterval) {
      try {
        const saved = JSON.parse(savedInterval)
        if (saved.pollInterval !== undefined) {
          pollInterval = saved.pollInterval
        }
      } catch (e) {
        //
      }
    } else {
      savePollInterval(cookieKey, dfault)
    }
  }
  return pollInterval
}

export const savePollInterval = (cookieKey, pollInterval) => {
  localStorage.setItem(cookieKey, JSON.stringify({pollInterval}))
}

export const getTimeAgoMsg = (msgKey, startTime, endTime, locale) => {
  let ago = ''
  const seconds = Math.abs(moment(new Date(startTime)).diff(new Date(endTime))) / 1000
  let interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    ago = msgs.get('time.days.ago', [interval], locale)
  } else {
    interval = Math.floor(seconds / 3600)
    if (interval >= 1) {
      ago = msgs.get('time.hours.ago', [interval], locale)
    } else {
      interval = Math.floor(seconds / 60)
      if (interval >= 1) {
        ago = msgs.get('time.minutes.ago', [interval], locale)
      } else if (seconds>1) {
        ago = msgs.get('time.seconds.ago', [seconds], locale)
      } else {
        ago = msgs.get('time.just.now', locale)
      }
    }
  }
  return msgs.get(msgKey, [ago], locale)
}

