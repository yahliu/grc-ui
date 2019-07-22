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
import ResourceFilterView from '../../../../src-web/components/common/ResourceFilterView'
import renderer from 'react-test-renderer'

describe('ResourceFilterView component', () => {
  it('renders as expected', () => {
    const fn = jest.fn()
    const component = renderer.create(
      <ResourceFilterView
        updateFilters={fn}
        onClose={fn}
        activeFilters={{}}
        availableFilters={{}}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
