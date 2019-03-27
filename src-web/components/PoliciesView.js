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
import resources from '../../lib/shared/resources'
import ClusterComplianceTab from '../containers/ClusterComplianceTab'

resources(() => {
  require('../../scss/policies-view.scss')
})

export default class PoliciesView extends React.Component {

  constructor (props) {
    super(props)
  }

  render() {
    const { secondaryHeaderProps } = this.props
    return (
      <div className='policies-view'>
        <ClusterComplianceTab secondaryHeaderProps={secondaryHeaderProps} />
      </div>
    )
  }
}

PoliciesView.propTypes = {
  secondaryHeaderProps: PropTypes.object,
}
