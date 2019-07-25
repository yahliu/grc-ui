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
import { policiesTestingDataSet1, policiesTestingDataSet2 } from './ModuleTestingData'
import PolicyCardsModule from '../../../../src-web/components/modules/PolicyCardsModule'

describe('PolicyCardsModule categories view', () => {
  const viewState = {viewState: {policyCardChoice:'categories'}}
  const activeFilters = {activeFilters:{}}
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet1
  it('renders expand as expected', () => {
    const component = renderer.create(<BrowserRouter><PolicyCardsModule  viewState={viewState}
      updateViewState={updateViewState}
      policies={filteredPolicies}
      activeFilters={activeFilters}
      showPolicyCard={true}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })

  it('renders collapse as expected', () => {
    const component = renderer.create(<BrowserRouter><PolicyCardsModule  viewState={viewState}
      updateViewState={updateViewState}
      policies={filteredPolicies}
      activeFilters={activeFilters}
      showPolicyCard={false}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })
})

describe('PolicyCardsModule standards view', () => {
  const viewState = {viewState: {policyCardChoice:'standards'}}
  const activeFilters = {activeFilters:{}}
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet2
  it('renders expand as expected', () => {
    const component = renderer.create(<BrowserRouter><PolicyCardsModule  viewState={viewState}
      updateViewState={updateViewState}
      policies={filteredPolicies}
      activeFilters={activeFilters}
      showPolicyCard={true}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })

  it('renders collapse as expected', () => {
    const component = renderer.create(<BrowserRouter><PolicyCardsModule  viewState={viewState}
      updateViewState={updateViewState}
      policies={filteredPolicies}
      activeFilters={activeFilters}
      showPolicyCard={false}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })
})
