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
import CreationView from '../../../src-web/components/CreationView'
import renderer from 'react-test-renderer'

describe('NoResource component', () => {
  const setGetPolicyJSON = jest.fn()
  it('renders as expected', () => {
    const component = renderer.create(
      <CreationView
        setGetPolicyJSON={setGetPolicyJSON}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
