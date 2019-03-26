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
import resources from '../../lib/shared/resources'

resources(() => {
  require('../../scss/policies-view.scss')
})

export default class PoliciesView extends React.Component {

  constructor (props) {
    super(props)
  }

  render() {
    return (
      <div className='policies-view'>
      </div>
    )
  }
}

PoliciesView.propTypes = {
}
