/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

/* eslint-disable react/no-array-index-key, react/prop-types */

import React from 'react'
import PropTypes from 'prop-types'
import { StructuredListWrapper, StructuredListRow, StructuredListCell, StructuredListBody } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'

const ResourceTableRowExpandableContent = ({ items }, context) =>
  <StructuredListWrapper>
    <StructuredListBody>
      {items.map((item, index) => (
        <StructuredListRow className={'nested-expandable-row'} key={`${item.name}-${index}`} data-row-name={item.name} >
          <StructuredListCell className={'nested-expandable-row-header'} noWrap>{msgs.get(item.name, context.locale)}</StructuredListCell>
          <StructuredListCell className={'nested-expandable-row-content'} noWrap>{item.items.join(', ')}</StructuredListCell>
        </StructuredListRow>
      ))}
    </StructuredListBody>
  </StructuredListWrapper>

ResourceTableRowExpandableContent.contextTypes = {
  locale: PropTypes.string
}

export default ResourceTableRowExpandableContent
