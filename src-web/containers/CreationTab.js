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
import { Query } from 'react-apollo'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { createResources, updateSecondaryHeader, clearRequestStatus } from '../actions/common'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Page from '../components/common/Page'
import { GRCCreation } from '../../lib/client/queries'
import CreationView from '../components/CreationView'
import msgs from '../../nls/platform.properties'
import config from '../../lib/shared/config'

class CreationTab extends React.Component {

  static propTypes = {
    cleanReqStatus: PropTypes.func,
    handleCreateResources: PropTypes.func,
    mutateErrorMsg: PropTypes.string,
    mutateStatus: PropTypes.string,
    secondaryHeaderProps: PropTypes.object,
    updateSecondaryHeader: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.setGetPolicyJSON = this.setGetPolicyJSON.bind(this)
    this.setResetNewPolicy = this.setResetNewPolicy.bind(this)
  }

  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    const { title, tabs, breadcrumbItems, information } = secondaryHeaderProps
    const links = [
      {
        id: 'policy-cancel',
        label: 'button.cancel',
        kind: 'secondary',
        handleClick: this.handleCancel.bind(this)
      },
      {
        id: 'policy-create',
        label: 'button.create',
        handleClick: this.handleCreate.bind(this)
      }]
    updateSecondaryHeader(msgs.get(title, this.context.locale), tabs, breadcrumbItems, links, msgs.get(information, this.context.locale))
  }

  setGetPolicyJSON = getNewPolicyJSON => {
    this.getNewPolicyJSON = getNewPolicyJSON
  }

  setResetNewPolicy = resetNewPolicy => {
    this.resetNewPolicy = resetNewPolicy
  }

  handleCreate = () => {
    const newPolicyJSON = this.getNewPolicyJSON()
    if (newPolicyJSON) {
      const {handleCreateResources} = this.props
      handleCreateResources(newPolicyJSON)
    }
  }

  handleCancel = () => {
    window.history.back()
  }

  render () {
    const { mutateStatus, mutateErrorMsg } = this.props
    if (mutateStatus && mutateStatus === 'DONE') {
      this.resetNewPolicy()
      this.props.cleanReqStatus()
      return <Redirect to={`${config.contextPath}/policies/all`} />
    }
    return (
      <Page>
        <Query query={GRCCreation}>
          {( result ) => {
            const { loading } = result
            const { data={} } = result
            const { existing } = data
            const error = existing ? null : result.error
            return (
              <CreationView
                loading={!existing && loading}
                error={error}
                setResetNewPolicy={this.setResetNewPolicy}
                setGetPolicyJSON={this.setGetPolicyJSON}
                existing={existing}
                mutateStatus={mutateStatus}
                mutateErrorMsg={mutateErrorMsg}
              />
            )
          }
          }
        </Query>
      </Page>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mutateStatus: state['HCMPolicyList'].mutateStatus,
    mutateErrorMsg: state['HCMPolicyList'].mutateErrorMsg,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links, information) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links, '', information)),
    handleCreateResources: (json) => dispatch(createResources(RESOURCE_TYPES.HCM_POLICIES, json)),
    cleanReqStatus: () => dispatch(clearRequestStatus(RESOURCE_TYPES.HCM_POLICIES))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreationTab))
