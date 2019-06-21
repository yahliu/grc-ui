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
import { BrowserRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import { policiesTestingDataSet1 } from './ModuleTestingData'
import TopFindingsModule from '../../../../src-web/components/modules/TopFindingsModule'

describe('TopFindingsModule view', () => {
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet1
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><TopFindingsModule
      policies={filteredPolicies}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })
})
