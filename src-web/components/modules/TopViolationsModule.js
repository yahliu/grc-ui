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
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/module-top-violations.scss')
})

export default class TopViolationsModule extends React.Component {

  constructor (props) {
    super(props)
  }

  render() {
    return (
      <div className='policy-cards-module'>
        {this.renderHeader()}
        {this.renderCards()}
      </div>
    )
  }

  renderHeader() {
    //const { startPolling, stopPolling, pollInterval, refetch, timestamp, reloading } = this.props

    return (
      <div className='resource-card-view-header'>
      </div>
    )
  }

  renderCards() {
    //const { item } = this.props
    return (
      <div className='policy-card' >
        Top Violations TBD
      </div>
    )
  }
}

TopViolationsModule.propTypes = {
}
