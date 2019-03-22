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
import { Loading, Notification } from 'carbon-components-react'
import ResourceToolbar from './common/ResourceToolbar'
import PolicyCardsModule from './modules/PolicyCardsModule'
import TopViolationsModule from './modules/TopViolationsModule'
import msgs from '../../nls/platform.properties'

resources(() => {
  require('../../scss/overview-view.scss')
})

export default class OverviewTab extends React.Component {

  constructor (props) {
    super(props)
  }

  render() {
    const { locale } = this.context
    const { loading, error, policies, refreshControl } = this.props

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    return (
      <div className='overview-view'>
        <ResourceToolbar refreshControl={refreshControl} />
        <TopViolationsModule policies={policies} />
        <PolicyCardsModule policies={policies}  />
      </div>
    )
  }
}

OverviewTab.propTypes = {
  error: PropTypes.object,
  loading: PropTypes.bool,
  policies: PropTypes.array,
  refreshControl: PropTypes.object,
}
