/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import resources from '../../lib/shared/resources'
// import { connect } from 'react-redux'
// import { getSingleResourceItem, resourceItemByName } from '../reducers/common'
import PolicyTemplates from '../components/common/PolicyTemplates'
// import { fetchResource } from '../actions/common'
// import { POLICY_REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
// import { getPollInterval } from '../components/common/RefreshTimeSelect'
// import { REQUEST_STATUS } from '../actions/index'
import { Notification, Loading } from 'carbon-components-react'
import msgs from '../../nls/platform.properties'

resources(() => {
  require('../../scss/policy-yaml-tab.scss')
})

class NewPolicyTemplateTab extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    const { loading, error, resourceType, params, staticResourceData, items } = this.props
    if (status === error) {
      return <Notification
        title=''
        className='persistent'
        subtitle={msgs.get(error, this.context.locale)}
        kind='error' />
    } else if (loading) {
      return <Loading className='resource-detail-content-spinner' />
    } else{
      const item = items[0]
      return <PolicyTemplates resourceType={resourceType} params={params} staticResourceData={staticResourceData} resourceData={item} key='Compliance Templates' headerKey={'table.header.complianceTemplate'} editable={true} />
    }
  }

}

NewPolicyTemplateTab.contextTypes = {
  locale: PropTypes.string
}

NewPolicyTemplateTab.propTypes = {
  error: PropTypes.any,
  items: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array
  ]),
  loading: PropTypes.bool,
  params: PropTypes.object,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object,
}

// const mapStateToProps = (state, ownProps) => {
//   const { resourceType, params } = ownProps
//   const name = decodeURIComponent(params.name)
//   const item = getSingleResourceItem(state, { storeRoot: resourceType.list, resourceType, name, predicate: resourceItemByName,
//     namespace: params.namespace ? decodeURIComponent(params.namespace) : null })
//   const { list: typeListName } = ownProps.resourceType, error = state[typeListName].err

//   return { item ,
//     status: state[typeListName].status,
//     statusCode: error && error.response && error.response.status
//   }
// }

// const mapDispatchToProps = (dispatch, ownProps) => {
//   const { resourceType, params } = ownProps
//   return {
//     fetchResource: () => dispatch(fetchResource(resourceType, params.namespace, params.name))
//   }
// }


// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewPolicyTemplateTab))
export default withRouter(NewPolicyTemplateTab)

