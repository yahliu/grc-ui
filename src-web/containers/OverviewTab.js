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
import PoliciesClusterPage from '../components/resource-pages/PoliciesClusterPage'
import PoliciesPage from '../components/resource-pages/PoliciesPage'
import { updateModal, updateSecondaryHeader} from '../actions/common'
import {getPollInterval} from '../components/common/RefreshTimeSelect'

import { HCMComplianceList } from '../../lib/client/queries'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'

const shouldInclude = (item, detailedName, displayType) => {
  const annotations = _.get(item, 'metadata.annotations')
  const targetName = detailedName.replace(/\s/g, '').toLowerCase()
  if (displayType === 'categories') {
    const categories = annotations['policy.mcm.ibm.com/categories'] || ''
    if (targetName === 'other') return true
    return categories.toLowerCase().includes(targetName)
  } else {
    const standards = annotations['policy.mcm.ibm.com/standards'] || ''
    if (targetName === 'other') return true
    return standards.toLowerCase().includes(targetName)
  }
}


const formatClusterView = (key, value) => {
  let validNum = 0
  const nonCompliant = []

  value.forEach(item => {
    const status = _.get(item, `raw.status.status.${key}`, '')
    if (typeof status === 'string' && status.toLowerCase() === 'compliant') validNum += 1
    if (typeof status === 'object' && status['compliant'].toLowerCase() === 'compliant') validNum += 1
    else nonCompliant.push(_.get(item, 'metadata.name', '-'))
  })
  const result = {
    cluster: key,
    violation: `${validNum}/${value.length}`,
    nonCompliant: nonCompliant
  }
  return result
}


const formatTableData = (items, detailedName, detailedType, displayType) => {
  const result = []
  if (detailedType === 'cluster') {
    const map = new Map()
    for (const item of items) {
      const statuses = _.get(item, 'raw.status.status', {})
      Object.entries(statuses).forEach(([cluster, status]) => {
        if ((status === 'NonCompliant' || status.compliant === 'NonCompliant') && shouldInclude(item, detailedName, displayType)) {
          if (!map.has(cluster)) map.set(cluster, [])
          map.get(cluster).push(item)
        }
      })
    }
    for (const [key, value] of map.entries()) {
      result.push(formatClusterView(key, value))
    }
  } else if (detailedType === 'policy') {
    for (const item of items) {
      const statuses = _.get(item, 'raw.status.status', {})
      //eslint-disable-next-line
      Object.entries(statuses).forEach(([cluster, status]) => {
        if ((status === 'NonCompliant' || status.compliant === 'NonCompliant') && shouldInclude(item, detailedName, displayType)) {
          result.push(item)
        }
      })
    }
  }
  return result
}


class OverviewTab extends React.Component {

  static propTypes = {
    openDesModal: PropTypes.func,
    secondaryHeaderProps: PropTypes.object,
    updateSecondaryHeader: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.firstLoad = true
    this.state = {
      currentTab: 'overview',
      displayType: 'categories'
    }
  }

  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    const { title, tabs } = secondaryHeaderProps
    updateSecondaryHeader(msgs.get(title, this.context.locale), tabs)
  }

  handleDrillDownClick = (targetTab) => (name, type, classes) => () => {
    if (classes !== 'card-count-violations') {
      this.setState({
        currentTab: targetTab,
        detailedName: name,
        detailedType: type,
      })
    }
  }

  handleOverviewClick = (targetTab) => () => {
    this.setState({currentTab: targetTab})
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    const { title, tabs } = secondaryHeaderProps
    updateSecondaryHeader(msgs.get(title, this.context.locale), tabs)
  }

  handleDisplayChange = (value) => {
    this.setState({
      displayType: value
    })
  }

  handleDescription = (title, content = 'placeholder') => () => {
    const {openDesModal} = this.props
    openDesModal(content, title)
  }

  render () {
    const pollInterval = getPollInterval(POLICY_REFRESH_INTERVAL_COOKIE)
    const { currentTab, detailedName = '', detailedType = '', displayType = '' } = this.state
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
            let content
            if (!reloading) {
              this.timestamp = new Date().toString()
            }

            const refreshControl = {
              reloading,
              refreshCookie: POLICY_REFRESH_INTERVAL_COOKIE,
              startPolling, stopPolling, refetch,
              timestamp: this.timestamp
            }

            let detailedData = []
            if (currentTab === 'details') {
              detailedData = formatTableData(items, detailedName, detailedType, displayType)
            }

            const title = `#${detailedType === 'cluster' ? msgs.get('policy.header.cluster', this.context.locale) :
              msgs.get('policy.header.policy', this.context.locale)}: ${detailedName} (${detailedData.length})#`
            const SECONDARY_HEADER_PROPS = {
              title,
              breadcrumbItems: [
                {
                  id: 'policy-overview',
                  label: 'tabs.policy.back',
                  handleClick: this.handleOverviewClick('overview')
                },
              ]
            }

            //TODO: need apollo query to fetch policy description
            if (content) {
              SECONDARY_HEADER_PROPS['description'] = {
                display: 'Description',
                action: this.handleDescription(title.replace(/#/g, ''), content)
              }
            }

            return (
              <div>
                {(currentTab === 'overview') &&
                  <OverviewView
                    loading={!items && loading}
                    error={error}
                    policies={items}
                    refreshControl={refreshControl}
                    handleDrillDownClick={this.handleDrillDownClick('details')}
                    handleDisplayChange={this.handleDisplayChange}
                  />
                }
                {(currentTab === 'details') && (detailedType === 'cluster') &&
                  <PoliciesClusterPage
                    tableResources={detailedData}
                    secondaryHeaderProps={SECONDARY_HEADER_PROPS}
                    normalizedKey={'cluster'}
                  />
                }
                {(currentTab === 'details') && (detailedType === 'policy') &&
                  <PoliciesPage
                    tableResources={detailedData}
                    secondaryHeaderProps={SECONDARY_HEADER_PROPS}
                    normalizedKey={'metadata.name'}
                  />
                }
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
    updateSecondaryHeader: (title, tabs, breadcrumbItems) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems)),
    openDesModal: (content, title) => dispatch(updateModal({ open: true, type: 'description', content: content, title: title})),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(OverviewTab))

