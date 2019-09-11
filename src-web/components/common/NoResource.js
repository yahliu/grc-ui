/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/no-resource.scss')
})

const NoResource = ({
  title,
  detail,
  children,
  topButton
}, context) =>
  <div>
    {topButton}
    <div className='no-resource'>
      <img className='no-resource-icon' src={`${config.contextPath}/policies/graphics/no-policy.svg`} alt={msgs.get('svg.description.noresource', context.locale)} />
      <div className='no-resource-title'>{title}</div>
      {detail && <div className='no-resource-detail'>{detail}</div>}
      {children}
    </div>
  </div>

NoResource.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  detail: PropTypes.string,
  title:PropTypes.string,
  topButton: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
}

NoResource.contextTypes = {
  locale: PropTypes.string
}

export default NoResource
