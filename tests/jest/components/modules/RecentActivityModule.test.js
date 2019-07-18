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
import { policiesTestingDataSet1, findingsTestingDataSet1 } from './ModuleTestingData'
import RecentActivityModule from '../../../../src-web/components/modules/RecentActivityModule'

describe('RecentActivityModule view', () => {
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet1
  const filteredFindings = findingsTestingDataSet1
  const viewState = {}
  const updateViewState = jest.fn()
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><RecentActivityModule
      policies={filteredPolicies}
      findings={filteredFindings}
      viewState={viewState}
      updateViewState={updateViewState}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })
})
