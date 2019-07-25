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
import { sidePanelDetailsModalDataPolicies, sidePanelDetailsModalResourceTypePolicies, sidePanelDetailsModalDataClusters, sidePanelDetailsModalResourceTypeClusters } from './ModalsTestingData'
import SidePanelDetailsModal from '../../../../src-web/components/modals/SidePanelDetailsModal'

describe('SidePanelDetailsModal PoliciesView view', () => {
  const updateModal = jest.fn()
  it('renders expand as expected', done => {
    const component = shallow(<SidePanelDetailsModal
      title = {''}
      data = {sidePanelDetailsModalDataPolicies}
      resourceType = {sidePanelDetailsModalResourceTypePolicies}
      locale = {'en-US'}
      open = {true}
      updateModal = {updateModal}
    />)
    expect(component).toMatchSnapshot()
    done()
  })
})

describe('SidePanelDetailsModal ClustersView view', () => {
  const updateModal = jest.fn()
  it('renders expand as expected', () => {
    const component = shallow(<SidePanelDetailsModal
      title = {''}
      data = {sidePanelDetailsModalDataClusters}
      resourceType = {sidePanelDetailsModalResourceTypeClusters}
      locale = {'en-US'}
      open = {true}
      updateModal = {updateModal}
    />)
    expect(component).toMatchSnapshot()
  })
})
