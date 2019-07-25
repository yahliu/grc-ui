/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { shallow } from 'enzyme'
import { policiesViewItem, policiesViewRefreshControl, policiesViewSecondaryHeaderProps } from './ComponentsTestingData'
import { default as PoliciesView } from '../../../src-web/components/PoliciesView'

describe('PoliciesView view', () => {
  it('renders expand as expected', () => {
    const component = shallow(<PoliciesView
      loading={!policiesViewItem && false}
      error={null}
      policies={policiesViewItem}
      refreshControl={policiesViewRefreshControl}
      secondaryHeaderProps={policiesViewSecondaryHeaderProps} />)
    expect(component).toMatchSnapshot()
  })
})
