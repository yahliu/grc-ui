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
import { Modal } from 'carbon-components-react'
import ResourceOverviewModule from '../modules/SubResourceListModule'
import getResourceDefinitions from '../../definitions'
import msgs from '../../../nls/platform.properties'
import queryString from 'query-string'

resources(() => {
  require('../../../scss/side-panel-modal.scss')
})

function getHeader(data) {
  const kind = _.get(data, 'kind', '')
  let header = '', descr = ''
  if (kind === 'HCMSecurityFindings') {
    header = _.get(data, 'shortDescription', '')
    descr = _.get(data, '', '')
  } else if (kind === 'HCMClusterFindings') {
    header = _.get(data, 'cluster', '')
    descr = _.get(data, '', '')
  }
  return {kind, header, descr}
}

class FindingSidePanelDetailsModal extends React.PureComponent {

  handleModalClose = () => {
    const { updateModal, location, history } = this.props
    updateModal()

    //update url and refresh finding page after closing sidepanel
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
    const { kind, header, descr } = getHeader(data)
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
            </div>
            <div className={'bx--modal-content-body'}>
              { kind.toLowerCase() === 'hcmsecurityfindings' &&  <SecurityFindingsTable singleFinding={data} type={resourceType} inapplicable={inapplicable} locale={locale} /> }
              { kind.toLowerCase() === 'hcmclusterfindings' &&  <ClusterFindingsTable items={data} type={resourceType} inapplicable={inapplicable} locale={locale} /> }
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

const SecurityFindingsTable = ({singleFinding, type, inapplicable, locale}) => {
  const items = []
  const updateTime  = _.get(singleFinding, 'updateTime', inapplicable)
  items.push({'id': '1', 'key': msgs.get('table.header.update.time', locale), 'value': updateTime,})
  const clusterName  = _.get(singleFinding, 'context.clusterName', inapplicable)
  items.push({'id': '2', 'key': msgs.get('table.header.cluster.name', locale), 'value': clusterName,})
  const namespaceName  = _.get(singleFinding, 'context.namespaceName', inapplicable)
  items.push({'id': '3', 'key': msgs.get('table.header.namespace', locale), 'value': namespaceName,})
  const resourceId  = _.get(singleFinding, 'context.resourceId', inapplicable)
  items.push({'id': '4', 'key': msgs.get('table.header.resources.id', locale), 'value': resourceId,})
  const resourceName  = _.get(singleFinding, 'context.resourceName', inapplicable)
  items.push({'id': '5', 'key': msgs.get('table.header.resources.name', locale), 'value': resourceName,})
  const resourceType  = _.get(singleFinding, 'context.resourceType', inapplicable)
  items.push({'id': '6', 'key': msgs.get('table.header.resources.type', locale), 'value': resourceType,})
  const serviceName  = _.get(singleFinding, 'context.serviceName', inapplicable)
  items.push({'id': '7', 'key': msgs.get('table.header.serviceName', locale), 'value': serviceName,})

  const staticResourceData = getResourceDefinitions(type)
  return (
    <div className='overview-content'>
      <ResourceOverviewModule
        staticResourceData={staticResourceData.securityFindingSidePanel}
        items={items}
        listSubItems={false}
      />
    </div>
  )
}

const ClusterFindingsTable = ({items, type, inapplicable, locale}) => {
  items = _.get(items, 'findingsUnderCluster', [])
  items = items.map((finding, index) => {
    const id = _.get(finding, 'context.resourceId', 'finding'+index)
    const updateTime  = _.get(finding, 'updateTime', inapplicable)
    const clusterName  = _.get(finding, 'context.clusterName', inapplicable)
    const namespaceName  = _.get(finding, 'context.namespaceName', inapplicable)
    const resourceId  = _.get(finding, 'context.resourceId', inapplicable)
    const resourceName  = _.get(finding, 'context.resourceName', inapplicable)
    const resourceType  = _.get(finding, 'context.resourceType', inapplicable)
    const subItems = _.without([
      id,
      {
        subRowsArray : [
          {
            id: id+'updateTime',
            cells: [ msgs.get('table.header.update.time', locale), updateTime ]
          },
          {
            id: id+'clusterName',
            cells: [ msgs.get('table.header.cluster.name', locale), clusterName ]
          },
          {
            id: id+'namespaceName',
            cells: [ msgs.get('table.header.namespace', locale), namespaceName ]
          },
          {
            id: id+'resourceId',
            cells: [ msgs.get('table.header.resources.id', locale), resourceId ]
          },
          {
            id: id+'resourceName',
            cells: [ msgs.get('table.header.resources.name', locale), resourceName ]
          },
          {
            id: id+'resourceType',
            cells: [ msgs.get('table.header.resources.type', locale), resourceType ]
          },
        ]
      }
    ], undefined, null)

    return {...finding, id, subItems}
  })

  const staticResourceData = getResourceDefinitions(type)
  return (
    <div className='overview-content'>
      <ResourceOverviewModule
        staticResourceData={staticResourceData.clusterFindingSidePanel}
        items={items}
        listSubItems={true}
      />
    </div>
  )
}

SecurityFindingsTable.propTypes = {
  inapplicable: PropTypes.string,
  locale: PropTypes.string,
  singleFinding: PropTypes.object,
  type: PropTypes.object,
}

ClusterFindingsTable.propTypes = {
  inapplicable: PropTypes.string,
  items: PropTypes.object,
  locale: PropTypes.string,
  type: PropTypes.object,
}

FindingSidePanelDetailsModal.propTypes = {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FindingSidePanelDetailsModal))
