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
import Page from '../components/common/Page'
import OverviewView from '../components/OverviewView'
import {POLICY_REFRESH_INTERVAL_COOKIE} from '../../lib/shared/constants'
import { updateModal, updateSecondaryHeader} from '../actions/common'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import { GRCList } from '../../lib/client/queries'
import msgs from '../../nls/platform.properties'
//import getMockData from './OverviewTabMock'

class OverviewTab extends React.Component {

  static propTypes = {
    openDesModal: PropTypes.func,
    secondaryHeaderProps: PropTypes.object,
    updateSecondaryHeader: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.firstLoad = true
  }

  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    const { title, tabs, links, information } = secondaryHeaderProps
    updateSecondaryHeader(msgs.get(title, this.context.locale), tabs, links, msgs.get(information, this.context.locale))
  }

  handleDescription = (title, content = 'placeholder') => () => {
    const {openDesModal} = this.props
    openDesModal(content, title)
  }

  render () {
    const pollInterval = getPollInterval(POLICY_REFRESH_INTERVAL_COOKIE)
    return (
      <Page>
        <Query query={GRCList} pollInterval={pollInterval} notifyOnNetworkStatusChange >
          {( result ) => {
            const {loading, startPolling, stopPolling, refetch} = result
            const {data={}} = result
            const { policies, findings } = data

            const error = policies ? null : result.error
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
              <div>
                <OverviewView
                  loading={!policies && loading}
                  error={error}
                  policies={policies}
                  findings={findings}
                  refreshControl={refreshControl}
                />
              </div>
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
    updateSecondaryHeader: (title, tabs, links, information) => dispatch(updateSecondaryHeader(title, tabs, undefined, links, '', information)),
    openDesModal: (content, title) => dispatch(updateModal({ open: true, type: 'description', content: content, title: title})),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(OverviewTab))

