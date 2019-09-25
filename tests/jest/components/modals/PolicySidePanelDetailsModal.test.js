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
import { sidePanelPolicies, sidePanelResourceTypePolicies, sidePanelClusters, sidePanelResourceTypeClusters } from './ModalsTestingData'
import PolicySidePanelDetailsModal, { PoliciesTable, ClustersTable } from '../../../../src-web/components/modals/PolicySidePanelDetailsModal'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'

describe('PoliciesView view', () => {
  const updateModal = jest.fn()
  it('renders expand as expected', () => {
    const component = shallow(<PolicySidePanelDetailsModal
      title = {''}
      data = {sidePanelPolicies}
      resourceType = {sidePanelResourceTypePolicies}
      locale = {'en-US'}
      open = {true}
      updateModal = {updateModal}
    />)
    expect(component).toMatchSnapshot()
  })
})

describe('ClustersView view', () => {
  const updateModal = jest.fn()
  it('renders expand as expected', () => {
    const component = shallow(
      <PolicySidePanelDetailsModal
        title = {''}
        data = {sidePanelClusters}
        resourceType = {sidePanelResourceTypeClusters}
        locale = {'en-US'}
        open = {true}
        updateModal = {updateModal}
      />
    )
    expect(component).toMatchSnapshot()
  })
})

describe('PoliciesTable 1', () => {
  it('renders expand as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <PoliciesTable
          items = {sidePanelPolicies}
          type = {sidePanelResourceTypePolicies}
          inapplicable = {'N/A'}
        />
      </BrowserRouter>
    )
    expect(component).toMatchSnapshot()
  })
})

describe('PoliciesTable 2', () => {
  it('renders expand as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <PoliciesTable
          items = {[]}
          type = {sidePanelResourceTypePolicies}
          inapplicable = {'N/A'}
        />
      </BrowserRouter>
    )
    expect(component).toMatchSnapshot()
  })
})

describe('ClustersTable 1', () => {
  it('renders expand as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <ClustersTable
          items = {sidePanelClusters}
          type = {sidePanelResourceTypeClusters}
          inapplicable = {'N/A'}
        />
      </BrowserRouter>
    )
    expect(component).toMatchSnapshot()
  })
})

describe('ClustersTable 2', () => {
  it('renders expand as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <ClustersTable
          items = {[]}
          type = {sidePanelResourceTypeClusters}
          inapplicable = {'N/A'}
        />
      </BrowserRouter>
    )
    expect(component).toMatchSnapshot()
  })
})
