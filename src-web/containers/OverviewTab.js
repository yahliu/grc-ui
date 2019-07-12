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
//import getMockData from './OverviewTabMock'

const shouldInclude = (item, detailedChoice, detailedName, detailedDescription) => {
  let annotations = _.get(item, 'metadata.annotations')
  const itemName = _.get(item, 'metadata.name')

  if (detailedChoice.toLowerCase()===msgs.get('overview.top.violations.clusters').toLowerCase()){
    return detailedDescription.toLowerCase().includes(itemName.toLowerCase())
  }

  if (detailedChoice.toLowerCase()===msgs.get('overview.top.violations.policies').toLowerCase()){
    return detailedName.toLowerCase().includes(itemName.toLowerCase())
  }

  if (detailedChoice === 'categories') {
    annotations = annotations['policy.mcm.ibm.com/categories'] || ''
  } else {
    annotations = annotations['policy.mcm.ibm.com/standards'] || ''
  }
  // an "other" policy
  if (detailedName.toLowerCase() === 'other' && annotations.length===0) {
    return true
  }
  return annotations.includes(detailedName)
}


const formatClusterView = (key, value) => {
  let validNum = 0
  const nonCompliant = []

  value.forEach(item => {
    const status = _.get(item, `raw.status.status.${key}`, '')
    let compliant = false
    switch (typeof status) {
    case 'string':
      compliant = (status.toLowerCase() === 'compliant')
      break
    case 'object':
      compliant = (status['compliant'] && status['compliant'].toLowerCase() === 'compliant')
      break
    }
    if (compliant) {
      validNum += 1
    } else {
      nonCompliant.push(_.get(item, 'metadata.name', '-'))
    }
  })
  const result = {
    cluster: key,
    violation: `${value.length-validNum}/${value.length}`,
    nonCompliant: nonCompliant
  }
  return result
}

const formatTableData = (items, detailedChoice, detailedName, detailedType, detailedDescription) => {
  const result = []
  const map = new Map()
  for (const item of items) {
    const statuses = _.get(item, 'raw.status.status', {})
    Object.entries(statuses).forEach(([cluster, status]) => {
      const compliant = status.compliant
      const noncompliant = !compliant || compliant.toLowerCase()==='noncompliant'
      if (noncompliant && shouldInclude(item, detailedChoice, detailedName, detailedDescription)) {
        if (detailedType === 'cluster') {
          if (!map.has(cluster)) map.set(cluster, [])
          map.get(cluster).push(item)
        } else {
          result.push(item)
        }
      }
    })
  }
  if (detailedType === 'cluster') {
    for (const [key, value] of map.entries()) {
      result.push(formatClusterView(key, value))
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
      detailedChoice: 'standards',
    }
  }

  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    const { title, tabs, links, information } = secondaryHeaderProps
    updateSecondaryHeader(msgs.get(title, this.context.locale), tabs, links, msgs.get(information, this.context.locale))
  }

  handleDrillDownClick = (targetTab, choice, name, type, description) => {
    this.setState({
      currentTab: targetTab,
      detailedChoice: choice,
      detailedName: name,
      detailedType: type,
      detailedDescription: description,
    })
  }

  handleOverviewClick = (targetTab) => () => {
    this.setState({currentTab: targetTab})
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
    const { currentTab, detailedChoice = '', detailedName = '', detailedType = '', detailedDescription = '' } = this.state
    return (
      <Page>
        <Query query={HCMComplianceList} pollInterval={pollInterval} notifyOnNetworkStatusChange >
          {( result ) => {
            const {loading, startPolling, stopPolling, refetch} = result
            const {data={}} = result
            const { items } = data
            //                        if (items) {
            //                          const mockArr = []
            //                          items.forEach(item=>{
            //                            const mockData = {}
            //                            for (var key in item) {
            //                              mockData[key] = item[key]
            //                            }
            //                            mockArr.push(mockData)
            //                          })
            //                          console.log(JSON.stringify(mockArr))
            //                        }
            //
            //
            //            const items = getMockData().policies

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
              detailedData = formatTableData(items, detailedChoice, detailedName, detailedType, detailedDescription)
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

            const handleDrillDownClick = this.handleDrillDownClick.bind(this, 'details')
            return (
              <div>
                {(currentTab === 'overview') &&
                  <OverviewView
                    loading={!items && loading}
                    error={error}
                    policies={items}
                    refreshControl={refreshControl}
                    handleDrillDownClick={handleDrillDownClick}
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
    updateSecondaryHeader: (title, tabs, links, information) => dispatch(updateSecondaryHeader(title, tabs, undefined, links, '', information)),
    openDesModal: (content, title) => dispatch(updateModal({ open: true, type: 'description', content: content, title: title})),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(OverviewTab))

