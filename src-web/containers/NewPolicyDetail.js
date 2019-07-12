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
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import {POLICY_REFRESH_INTERVAL_COOKIE, RESOURCE_TYPES} from '../../lib/shared/constants'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import Page from '../components/common/Page'
import {updateSecondaryHeader} from '../actions/common'
import { HCMCompliance } from '../../lib/client/queries'
import msgs from '../../nls/platform.properties'
import getResourceDefinitions from '../definitions'
import NewResourceDetails from '../components/common/NewResourceDetails'
import StructuredListModule from '../components/common/StructuredListModuleWithActions'


class PolicyDetail extends React.Component {

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
    const { title, tabs, information } = secondaryHeaderProps
    updateSecondaryHeader(msgs.get(title, this.context.locale), tabs, msgs.get(information, this.context.locale))
  }

  render () {
    const url = _.get(this.props, 'match.url')
    const urlSegments = url.split('/')
    const policyName = urlSegments[urlSegments.length - 1]
    const policyNamespace = urlSegments[urlSegments.length - 2]
    const pollInterval = getPollInterval(POLICY_REFRESH_INTERVAL_COOKIE)
    return (
      <Page>
        <Query query={HCMCompliance} variables={{name: policyName, namespace: policyNamespace}} pollInterval={pollInterval} notifyOnNetworkStatusChange >
          {( result ) => {
            const {data={}, loading, startPolling, stopPolling, refetch} = result
            const { items } = data
            const error = items ? null : result.error
            const firstLoad = this.firstLoad
            this.firstLoad = false
            const reloading = !firstLoad && loading
            const resourceType = RESOURCE_TYPES.HCM_COMPLIANCES
            const staticResourceData = getResourceDefinitions(resourceType)
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
              <Switch>
                <Route path={url} render={() => (
                  <NewResourceDetails
                    loading={!items && loading}
                    error={error}
                    items={items}
                    refreshControl={refreshControl}
                    resourceType={resourceType}
                    staticResourceData={staticResourceData}
                    tabs={['overview','violation','yaml']}
                    routes={['/violation', '/yaml','/compliancePolicy/:policyName/:policyNamespace']}
                    // eslint-disable-next-line react/no-children-prop
                    children={[<StructuredListModule key='placementPolicies' rowsKey='placementPoliciesKeys' actions={['table.actions.edit']} left second />,
                      <StructuredListModule key='placementBindings' rowsKey='placementBindingKeys' actions={['table.actions.edit']} right second />,]}
                  />
                )} />
              </Switch>
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
    updateSecondaryHeader: (title, tabs, information) => dispatch(updateSecondaryHeader(title, tabs, undefined, undefined, information)),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(PolicyDetail))

