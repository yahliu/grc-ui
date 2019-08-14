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
import { policiesTestingDataSet1, policiesTestingDataSet2, findingsTestingDataSet1 } from './ModuleTestingData'
import TopInformationModule from '../../../../src-web/components/modules/TopInformationModule'

describe('TopInformationModule clusters view', () => {
  const viewState = {viewState: {topViolationChoice:'clusters'}}
  const activeFilters = {activeFilters:{}}
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet1
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><TopInformationModule  viewState={viewState}
      type='policies'
      updateViewState={updateViewState}
      items={filteredPolicies}
      activeFilters={activeFilters}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })
})

describe('TopInformationModule policies view', () => {
  const viewState = {viewState: {topViolationChoice:'policies'}}
  const activeFilters = {activeFilters:{}}
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet2
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><TopInformationModule  viewState={viewState}
      type='policies'
      updateViewState={updateViewState}
      items={filteredPolicies}
      activeFilters={activeFilters}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })
})

describe('TopInformationModule findings view', () => {
  const viewState = {viewState: {topFindingChoice:'findings'}}
  const activeFilters = {activeFilters:{}}
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredFindings = findingsTestingDataSet1
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><TopInformationModule  viewState={viewState}
      type='findings'
      updateViewState={updateViewState}
      items={filteredFindings}
      activeFilters={activeFilters}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })
})

describe('TopInformationModule findings clusters view', () => {
  const viewState = {viewState: {topViolationChoice:'clusters'}}
  const activeFilters = {activeFilters:{}}
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredFindings = findingsTestingDataSet1
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><TopInformationModule  viewState={viewState}
      type='findings'
      updateViewState={updateViewState}
      items={filteredFindings}
      activeFilters={activeFilters}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component).toMatchSnapshot()
  })
})
