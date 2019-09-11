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
//curly braces means pure component without redux
//which is what we want in unit test
import { GrcView } from '../../../src-web/components/GrcView'
import renderer from 'react-test-renderer'

describe('GrcView view 1', () => {
  const location = {
    pathname: '/multicloud/policies'
  }
  it('renders expand as expected', () => {
    const component = shallow(<GrcView
      title='hello world'
      location={location}
      loading={!GrcViewItem && false}
      error={null}
      policies={GrcViewItem}
      refreshControl={GrcViewRefreshControl}
      secondaryHeaderProps={GrcViewSecondaryHeaderProps} />)
    expect(component).toMatchSnapshot()
  })
})

describe('GrcView component 2', () => {
  const location = {
    pathname: '/multicloud/policies'
  }
  it('renders as expected', () => {
    const component = renderer.create(
      <GrcView
        title='hello world'
        location={location}
        loading={!GrcViewItem && false}
        error={null}
        policies={GrcViewItem}
        refreshControl={GrcViewRefreshControl}
        secondaryHeaderProps={GrcViewSecondaryHeaderProps}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
