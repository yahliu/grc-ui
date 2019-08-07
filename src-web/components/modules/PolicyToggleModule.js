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
import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import msgs from '../../../nls/platform.properties'
import { ContentSwitcher, Switch } from 'carbon-components-react'
import getResourceDefinitions from '../../definitions'
import { makeGetVisibleTableItemsSelector } from '../../reducers/common'
import ResourceList from '../common/ResourceList'
import formatPoliciesToClustersTableData from '../common/FormatTableData'
import pageWithUrlQuery from '../common/withUrlQuery'
import queryString from 'query-string'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/grc-toggle-module.scss')
})

class PolicyToggleModule extends React.Component {

  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.toggleClick = this.toggleClick.bind(this)
  }

  render() {
    const { locale } = this.context
    const { policies, secondaryHeaderProps, showPolicyTabToggle, policyTabToggleIndex, highLightRowName, showSidePanel, handleCreatePolicy } = this.props
    const policyTabSwitcher = showPolicyTabToggle ? this.renderTabSwitcher(policyTabToggleIndex) : []
    return (
      <div className='module-toggle-tab'>
        {policyTabToggleIndex===0 && <ResourceList
          {...this.props}
          detailsTabs={['policies']}
          resourceType={RESOURCE_TYPES.HCM_POLICIES_PER_POLICY}
          listData={this.formatExpandablePolicies(policies)}
          staticResourceData={getResourceDefinitions(RESOURCE_TYPES.HCM_POLICIES_PER_POLICY)}
          getVisibleResources={makeGetVisibleTableItemsSelector(RESOURCE_TYPES.HCM_POLICIES_PER_POLICY)}
          tabs={secondaryHeaderProps.tabs}
          links={secondaryHeaderProps.links}
          title={secondaryHeaderProps.title}
          information={secondaryHeaderProps.information}
          placeHolderText={msgs.get('tabs.policy.toggle.allPolicies.placeHolderText', locale)}
          autoAction='table.actions.sidepanel'
          highLightRowName={highLightRowName}
          showSidePanel={showSidePanel}
          handleCreatePolicy={handleCreatePolicy}>
          {policyTabSwitcher}
        </ResourceList>}
        {policyTabToggleIndex===1 && <ResourceList
          {...this.props}
          detailsTabs={['clusters']}
          resourceType={RESOURCE_TYPES.HCM_POLICIES_PER_CLUSTER}
          listData={formatPoliciesToClustersTableData(policies)}
          staticResourceData={getResourceDefinitions(RESOURCE_TYPES.HCM_POLICIES_PER_CLUSTER)}
          getVisibleResources={makeGetVisibleTableItemsSelector(RESOURCE_TYPES.HCM_POLICIES_PER_CLUSTER)}
          tabs={secondaryHeaderProps.tabs}
          links={secondaryHeaderProps.links}
          title={secondaryHeaderProps.title}
          information={secondaryHeaderProps.information}
          placeHolderText={msgs.get('tabs.policy.toggle.clusterViolations.placeHolderText', locale)}
          autoAction='table.actions.sidepanel'
          highLightRowName={highLightRowName}
          showSidePanel={showSidePanel}
          topButton={policyTabSwitcher}>
          {policyTabSwitcher}
        </ResourceList>}
      </div>
    )
  }

  renderTabSwitcher(policyTabToggleIndex) {
    const { locale } = this.context
    const allPolicies = msgs.get('tabs.policy.toggle.allPolicies', locale)
    const clusterViolations = msgs.get('tabs.policy.toggle.clusterViolations', locale)
    return (
      <div className='module-toggle-tab-switch'>
        <ContentSwitcher onChange={this.onChange} selectedIndex={policyTabToggleIndex}>
          <Switch text={allPolicies} onClick={this.toggleClick} />
          <Switch text={clusterViolations} onClick={this.toggleClick} />
        </ContentSwitcher>
      </div>
    )
  }

  formatExpandablePolicies(policies) {
    const result = []
    policies.forEach(policy => {
      const subItems = [{name: 'policy.pb', items: policy.placementBindings.map(pb => pb.metadata.name)},
        {name: 'policy.pp', items: policy.placementPolicies.map(pp => pp.metadata.name)}]
      result.push({...policy, subItems})
    })
    return result
  }

  onChange() {
    //current do nothing, just required by carbon ContentSwitcher otherwise error
  }

  toggleClick({...props}) {
    const {history, location} = this.props
    const paraURL = queryString.parse(location.search)
    paraURL.index = props.index
    history.push(`${location.pathname}?${queryString.stringify(paraURL)}`)
  }
}

PolicyToggleModule.propTypes = {
  handleCreatePolicy: PropTypes.func,
  highLightRowName: PropTypes.string,
  history: PropTypes.object.isRequired,
  location: PropTypes.object,
  policies: PropTypes.array,
  policyTabToggleIndex: PropTypes.number,
  secondaryHeaderProps: PropTypes.object,
  showPolicyTabToggle: PropTypes.bool,
  showSidePanel: PropTypes.bool,
}

export default withRouter(pageWithUrlQuery(PolicyToggleModule))
