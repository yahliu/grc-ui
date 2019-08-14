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
import GrcCardsModule from '../../../../src-web/components/modules/GrcCardsModule'

describe('GrcCardsModule policies page categories view', () => {
  const viewState = {viewState: {grcCardChoice:'categories'}}
  const activeFilters = {activeFilters:{}}
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet1
  it('renders expand as expected', () => {
    const component = renderer.create(<BrowserRouter><GrcCardsModule  viewState={viewState}
      updateViewState={updateViewState}
      grcItems={filteredPolicies}
      activeFilters={activeFilters}
      showGrcCard={true}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })

  it('renders collapse as expected', () => {
    const component = renderer.create(<BrowserRouter><GrcCardsModule  viewState={viewState}
      updateViewState={updateViewState}
      grcItems={filteredPolicies}
      activeFilters={activeFilters}
      showGrcCard={false}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })
})

describe('GrcCardsModule policies page standards view', () => {
  const viewState = {viewState: {grcCardChoice:'standards'}}
  const activeFilters = {activeFilters:{}}
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet2
  it('renders expand as expected', () => {
    const component = renderer.create(<BrowserRouter><GrcCardsModule  viewState={viewState}
      updateViewState={updateViewState}
      grcItems={filteredPolicies}
      activeFilters={activeFilters}
      showGrcCard={true}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })

  it('renders collapse as expected', () => {
    const component = renderer.create(<BrowserRouter><GrcCardsModule  viewState={viewState}
      updateViewState={updateViewState}
      grcItems={filteredPolicies}
      activeFilters={activeFilters}
      showGrcCard={false}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })
})
