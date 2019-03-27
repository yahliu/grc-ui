/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Page from '../components/common/Page'
import PoliciesView from '../components/PoliciesView'
import {updateSecondaryHeader} from '../actions/common'
import {GET_COMPLIANCES_QUERY} from './PolicyQueries'
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
    const pollInterval = 500000//Math.max(getPollInterval(OVERVIEW_REFRESH_INTERVAL_COOKIE), 20*1000)
    return (
      <Page>
        <Query query={GET_COMPLIANCES_QUERY} pollInterval={pollInterval} notifyOnNetworkStatusChange >
          {( result ) => {
            const {loading, data={}, refetch, startPolling, stopPolling} = result
            let {error} = result
            const { items } = data
            //overview = getFreshOrStoredObject(OVERVIEW_QUERY_COOKIE, overview)
            if (items) {
              error = null
            }
            const firstLoad = this.firstLoad
            this.firstLoad = false
            return (
              <PoliciesView
                loading={!items && loading}
                reloading={!firstLoad && loading}
                error={error}
                refetch={refetch}
                startPolling={startPolling}
                stopPolling={stopPolling}
                pollInterval={pollInterval}
                secondaryHeaderProps={secondaryHeaderProps}
                items={items} />
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

