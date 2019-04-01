/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

// seems to be an issue with this rule and redux connect method in SecondaryHeader
/* eslint-disable import/no-named-as-default */


import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { POLICY_REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import Page from '../components/common/Page'
import PoliciesView from '../components/PoliciesView'
import {updateSecondaryHeader} from '../actions/common'
import { HCMComplianceList } from '../../lib/client/queries'
import msgs from '../../nls/platform.properties'


class PoliciesTab extends React.Component {

  static propTypes = {
    secondaryHeaderProps: PropTypes.object,
    updateSecondaryHeader: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.firstLoad = true
  }

  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    const { title, tabs } = secondaryHeaderProps
    updateSecondaryHeader(msgs.get(title, this.context.locale), tabs)
  }

  render () {
    const { secondaryHeaderProps } = this.props
    const pollInterval = getPollInterval(POLICY_REFRESH_INTERVAL_COOKIE, 20*1000)
    return (
      <Page>
        <Query query={HCMComplianceList} pollInterval={pollInterval} notifyOnNetworkStatusChange >
          {( result ) => {
            const {data={}, loading, startPolling, stopPolling, refetch} = result
            const { items } = data
            const error = items ? null : result.error
            const firstLoad = this.firstLoad
            this.firstLoad = false
            const reloading = !firstLoad && loading
            if (!reloading) {
              this.timestamp = new Date().toString()
            }
            const refreshControl = {
              reloading,
              refreshCookie: POLICY_REFRESH_INTERVAL_COOKIE,
              startPolling, stopPolling, refetch,
              timestamp: this.timestamp
            }

            return (
              <PoliciesView
                loading={!items && loading}
                error={error}
                policies={items}
                refreshControl={refreshControl}
                secondaryHeaderProps={secondaryHeaderProps}
              />
            )
          }
          }
        </Query>
      </Page>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(PoliciesTab))

