/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Loading } from 'carbon-components-react'
// import { connect } from 'react-redux'
// import StructuredListModule from '../../components/common/StructuredListModule'
// import { getSingleResourceItem, resourceItemByName } from '../../reducers/common'
import { MCM_OPEN_DIAGRAM_TAB_COOKIE } from '../../../lib/shared/constants'
import resources from '../../../lib/shared/resources'
// import _ from 'lodash'
import NewStructuredList from './NewStructuredList'
import ResourceTableModule from './ResourceTableModuleFromProps'

resources(() => {
  require('../../../scss/new-resource-overview.scss')
})

const NewResourceOverview = ({
  staticResourceData,
  item,
  params,
  modules,
  resourceType
}) => {
  localStorage.removeItem(MCM_OPEN_DIAGRAM_TAB_COOKIE)
  if (!item) {
    return <Loading withOverlay={false} className='content-spinner' />
  } else {
    item = item[0]
  }

  const modulesSecond = []
  const modulesBottom = []
  const templates = NewResourceOverview.getTemplates(item.raw.spec)

  if (templates){
    for( const template of templates){
      const templateType = template.templateType
      const templateWithResource = {}
      templateWithResource[templateType] = [template]
      switch( templateType ){
      case 'role-templates':
        modulesBottom.push(React.createElement(ResourceTableModule, {key: templateType, definitionsKey: 'roleTemplates', staticResourceData: staticResourceData, resourceType: resourceType, resourceData: templateWithResource, showSearch: false, showPagination:false, params}))
        break
      case 'policy-templates':
        modulesBottom.push(React.createElement(ResourceTableModule, {key: templateType, definitionsKey: 'policyTemplates', staticResourceData: staticResourceData, resourceType: resourceType, resourceData: templateWithResource, showSearch: false, showPagination:false, params}))
        break
      case 'object-templates':
        modulesBottom.push(React.createElement(ResourceTableModule, {key: templateType, definitionsKey: 'objectTemplates', staticResourceData: staticResourceData, resourceType: resourceType, resourceData: templateWithResource, showSearch: false, showPagination:false, params}))
        break
      default:
        break
      }
    }
  }
  React.Children.map(modules, module => {
    if (module.props.second) {
      modulesSecond.push(React.cloneElement(module, { staticResourceData: staticResourceData, resourceType: resourceType, resourceData: item, params }))
    }
    else {
      modulesBottom.push(React.cloneElement(module, { staticResourceData: staticResourceData, resourceType: resourceType, resourceData: item, params }))
    }
  })

  return (
    <div className='overview-content'>
      <NewStructuredList
        numRows = {3}
        numColumns = {3}
        listData = {item}
        listItem = {staticResourceData.detailKeys.rows}
        title = {staticResourceData.detailKeys.title}
      />
      {modulesSecond.length > 0 &&
      <div className='overview-content-second'>
        <div className='overview-content-second-left'>{React.cloneElement(modulesSecond[0], { ...staticResourceData.placementPolicyKeys.detailKeys, data:item.placementPolicies[0], params })}</div>
        <div className='overview-content-second-left'>{React.cloneElement(modulesSecond[1], { ...staticResourceData.placementBindingKeys.detailKeys, data:item.placementBindings[0], params })}</div>
      </div>}
      {<div className='overview-content-bottom'>
        {modulesBottom}
      </div>}
    </div>
  )
}

NewResourceOverview.getTemplates = (spec = {}, templateType = '') => {
  const templates = []
  Object.entries(spec || []).forEach(([key, value]) => {
    if (key.endsWith(`${templateType}-templates`)) {
      value.forEach(item => templates.push({ ...item, templateType: key }))
    }
  })
  return templates
}

NewResourceOverview.contextTypes = {
  locale: PropTypes.string
}

NewResourceOverview.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array
  ]),
  modules: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  params: PropTypes.object,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object,
}

// const mapStateToProps = (state, ownProps) => {
//   const { resourceType, params } = ownProps
//   const name = decodeURIComponent(params.name)
//   const item = getSingleResourceItem(state, { storeRoot: resourceType.list, resourceType, name, predicate: resourceItemByName,
//     namespace: params.namespace ? decodeURIComponent(params.namespace) : null })
//   // eslint-disable-next-line
//   // console.log('item', JSON.stringify(item))
//   // item.roleTemplates = _.filter(item.allTemplates, {'templateType':'role-templates'})
//   // item.objectTemplates = _.filter(item.allTemplates, {'templateType':'object-templates'})
//   return { item }
// }

// export default withRouter(connect(mapStateToProps)(NewResourceOverview))
export default withRouter(NewResourceOverview)
