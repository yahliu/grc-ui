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
import NoResource from '../../../../src-web/components/common/NoResource'
import renderer from 'react-test-renderer'

describe('NoResource component', () => {
  it('renders as expected', () => {
    const topButton = <div>topButton</div>
    const component = renderer.create(
      <NoResource title='title' detail='detailed description' topButton={topButton}>
        <div className='child'>Test</div>
      </NoResource>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
