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
import { GrcViewItem, GrcViewRefreshControl, GrcViewSecondaryHeaderProps } from './ComponentsTestingData'
import { default as GrcView } from '../../../src-web/components/GrcView'

describe('GrcView view', () => {
  it('renders expand as expected', () => {
    const component = shallow(<GrcView
      loading={!GrcViewItem && false}
      error={null}
      policies={GrcViewItem}
      refreshControl={GrcViewRefreshControl}
      secondaryHeaderProps={GrcViewSecondaryHeaderProps} />)
    expect(component).toMatchSnapshot()
  })
})
