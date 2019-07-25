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
import { updateModal } from '../../actions/common'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import resources from '../../../lib/shared/resources'
import _ from 'lodash'
import {AllPoliciesInCluster, AllClustersInPolicy} from '../../../lib/client/queries'
import { Query } from 'react-apollo'
import { Modal, Loading, InlineNotification } from 'carbon-components-react'
import ResourceOverviewModule from '../modules/SubResourceListModule'
import getResourceDefinitions from '../../definitions'
import msgs from '../../../nls/platform.properties'
import queryString from 'query-string'

resources(() => {
  require('../../../scss/side-panel-modal.scss')
})

function getHeader(data) {
  const kind = _.get(data, 'kind', '')
  let header = '', descr = '', percent = 0, violation = '0/0', cluster = undefined, policy = undefined
  if (kind === 'HCMPolicyPolicy') {
    header = _.get(data, 'raw.metadata.name', '')
    descr = _.get(data, 'raw.metadata.description', '')
    violation = _.get(data, 'clusterCompliant', '0/0')
    const [vioNum, totalNum] = violation.split('/')
    if (!isNaN(vioNum) && !isNaN(totalNum)) {
      percent = +vioNum / +totalNum
    }
    violation += ' Clusters'
    policy = data.name
  } else if (kind === 'HCMPolicyCluster') {
    header = _.get(data, 'cluster', '')
    descr = _.get(data, '', '')
    violation = _.get(data, 'violation', '0/0')
    const [vioNum, totalNum] = violation.split('/')
    if (!isNaN(vioNum) && !isNaN(totalNum)) {
      percent = +vioNum / +totalNum
    }
    violation += ' Policies'
    cluster = data.cluster
  }
  return {header, descr, percent, violation, cluster, policy}
}


class SidePanelDetailsModal extends React.PureComponent {

  handleModalClose = () => {
    const { updateModal, location, history } = this.props
    updateModal()

    //update url and refresh policy page after closing sidepanel
    //text search input filter will not be removed, which is controled by itself
    const paraURL = {}
    let op = ''
    const curentURL = queryString.parse(location.search)
    if(curentURL.index) {
      paraURL.index = curentURL.index
      op = '?'
    }
    if(curentURL.filters) {
      paraURL.filters = curentURL.filters
      op = '?'
    }
    history.push(`${location.pathname}${op}${queryString.stringify(paraURL)}`)
  }

  render(){
    const { title, data, resourceType, locale } = this.props
    const { header, descr, percent, violation, cluster, policy } = getHeader(data)
    const inapplicable = msgs.get('table.actions.inapplicable', locale)
    return (
      <div className={'side-panel-modal'}>
        <Modal
          passiveModal
          open={this.props.open}
          onRequestClose={this.handleModalClose}
          modalHeading={title}
          primaryButtonDisabled={true}
        >
          <div>
            <div className={'bx--modal-header special-header'}>
              {header}
              <div className={'bx--modal-content-header-content'}>
                {descr}
              </div>
              <div className={'bx--modal-content-header-main'}>
                <ProcessBar percent={percent} />
                <div className={'bx-modal-content-sub-header'}>{`${violation}`}</div>
              </div>
            </div>
            <div className={'bx--modal-content-body'}>
              <Query query={cluster ? AllPoliciesInCluster :  AllClustersInPolicy}
                variables={cluster ? {cluster} : {policy}} pollInterval={3600000}
                /*side panel auto refresh every 60 minutes*/
              >
                {( {data, loading, error} ) => {
                  if (loading) {
                    // spinner if loading
                    return <Loading withOverlay={false} />
                  }
                  if (error) {
                    // return inline error
                    return (
                      <InlineNotification key={`inline-notification-${error}`}
                        kind='error' title=''
                        subtitle={error.message}
                        iconDescription={'inline-error'} />
                    )
                  }
                  const { items } = data
                  if (cluster) {
                    return (
                      <ClustersTable items={items} type={resourceType} inapplicable={inapplicable} />
                    )
                  } else {
                    return (
                      <PoliciesTable items={items} type={resourceType} inapplicable={inapplicable} />
                    )
                  }
                }
                }
              </Query>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

//eslint-disable-next-line
const ClustersTable = ({items, type, inapplicable}) => {
  items = items.map((policy, index) => {
    let violatedNum = 0
    const spec = _.get(policy, 'raw.spec', '')
    const objectTemplates = _.get(spec, 'object-templates', [])
    const roleTemplates = _.get(spec, 'role-templates', [])
    const policyTemplates = _.get(spec, 'policy-templates', [])
    const id = _.get(policy, 'metadata.name', 'policy'+index)
    for (const template of objectTemplates) {
      if (_.get(template, 'status.Compliant','').toLowerCase() !== 'compliant') {
        violatedNum += 1
      }
    }
    for (const template of roleTemplates) {
      if (_.get(template, 'status.Compliant','').toLowerCase() !== 'compliant') {
        violatedNum += 1
      }
    }
    for (const template of policyTemplates) {
      if (_.get(template, 'status.Compliant','').toLowerCase() !== 'compliant') {
        violatedNum += 1
      }
    }

    if(violatedNum > 0) {
      const objectStatus = objectTemplates.map(item => {
        if (_.get(item, 'status.Compliant','').toLowerCase() !== 'compliant') {
          return {
            id: _.get(item, 'objectDefinition.metadata.name'),
            cells: [_.get(item, 'objectDefinition.metadata.name'), _.get(item, 'status.conditions[0].message', '-'), _.get(item, 'status.conditions[0].reason', '-')]
          }}}
      )
      const roleStatus = roleTemplates.map(item => {
        if (_.get(item, 'status.Compliant','').toLowerCase() !== 'compliant') {
          return {
            id: _.get(item, 'metadata.name'),
            cells: [_.get(item, 'metadata.name'), _.get(item, 'status.conditions[0].message', '-'), _.get(item, 'status.conditions[0].reason', '-')]
          }}}
      )
      const policyStatus = policyTemplates.map(item => {
        if (_.get(item, 'status.Compliant','').toLowerCase() !== 'compliant') {
          return {
            id: _.get(item, 'objectDefinition.metadata.name'),
            cells: [_.get(item, 'objectDefinition.metadata.name'), _.get(item, 'status.conditions[0].message', '-'), _.get(item, 'status.conditions[0].reason', '-')]
          }}}
      )
      //add id and remove null/undefined
      const subItems = _.without([id, ...objectStatus, ...roleStatus, ...policyStatus], undefined, null)
      return {...policy, id, violatedNum, subItems}
    }
    else {
      const subItems = [{ id: 'inapplicable'+index, cells: [inapplicable, inapplicable+' ', inapplicable+'  '] }]
      return {...policy, id, violatedNum, subItems}
    }
  })

  const staticResourceData = getResourceDefinitions(type)
  return (
    <div className='overview-content'>
      <ResourceOverviewModule
        staticResourceData={staticResourceData.violatedTable}
        items={items}
        listSubItems={true}
      />
    </div>
  )
}

//eslint-disable-next-line
const PoliciesTable = ({items, type, inapplicable}) => {
  items = items.map((cluster, index) => {
    const policy = _.get(cluster, 'policy', [])
    const violatedNum = _.get(cluster, 'violated', 0)
    const id = _.get(cluster, 'metadata.name', 'cluster'+index)

    if(violatedNum > 0) {
      const spec = _.get(policy, 'spec', '')
      const objectTemplates = _.get(spec, 'object-templates', [])
      const roleTemplates = _.get(spec, 'role-templates', [])
      const policyTemplates = _.get(spec, 'policy-templates', [])
      const subItems = _.without([
        id,
        ...objectTemplates.map(item => {
          if (_.get(item, 'status.Compliant','').toLowerCase() !== 'compliant') {
            return {
              id: _.get(item, 'objectDefinition.metadata.name'),
              cells: [_.get(item, 'objectDefinition.metadata.name'), _.get(item, 'status.conditions[0].message', '-'), _.get(item, 'status.conditions[0].reason', '-')]
            }}}
        ),
        ...roleTemplates.map(item => {
          if (_.get(item, 'status.Compliant','').toLowerCase() !== 'compliant') {
            return {
              id: _.get(item, 'objectDefinition.metadata.name'),
              cells: [_.get(item, 'objectDefinition.metadata.name'), _.get(item, 'status.conditions[0].message', '-'), _.get(item, 'status.conditions[0].reason', '-')]
            }}}
        ),
        ...policyTemplates.map(item => {
          if (_.get(item, 'status.Compliant','').toLowerCase() !== 'compliant') {
            return {
              id: _.get(item, 'objectDefinition.metadata.name'),
              cells: [_.get(item, 'objectDefinition.metadata.name'), _.get(item, 'status.conditions[0].message', '-'), _.get(item, 'status.conditions[0].reason', '-')]
            }}}
        )
      ], undefined, null)

      return {...cluster, id, subItems}
    }
    else {
      const subItems = [{ id: 'inapplicable'+index, cells: [inapplicable, inapplicable+' ', inapplicable+'  '] }]
      return {...cluster, id, subItems}
    }
  })

  const staticResourceData = getResourceDefinitions(type)

  //Link columns with fixed title name and target direction
  const linkFixedName = {2 : {fixedName:'table.actions.launch.cluster', urlTarget:'_blank'}}
  return (
    <div className='overview-content'>
      <ResourceOverviewModule
        staticResourceData={staticResourceData.violatedTable}
        items={items}
        listSubItems={true}
        linkFixedName={linkFixedName}
      />
    </div>
  )
}

//eslint-disable-next-line
const ProcessBar = ({percent}) => {
  const width = Math.min(window.innerWidth * 0.3, window.innerHeight * 0.4), height = 12, label = 'label', r = 6, w = width * percent
  return (
    <svg width={width} height={height} aria-label={label}>
      <rect className={'bx--modal-side-panel-process-bar-body'} width={width} height={height} rx={r} ry={r} />
      <rect className={'bx--modal-side-panel-process-bar-fill'} width={w} height={height} rx={r} ry={r} />
    </svg>
  )
}


SidePanelDetailsModal.propTypes = {
  data: PropTypes.object,
  history: PropTypes.object.isRequired,
  locale: PropTypes.string,
  location: PropTypes.object,
  open: PropTypes.bool,
  resourceType: PropTypes.object,
  title: PropTypes.string,
  updateModal: PropTypes.func
}

const mapStateToProps = state =>  {
  return state.modal
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateModal: () => dispatch(updateModal({ open: false }))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SidePanelDetailsModal))

