/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import CreationView from '../../../src-web/components/CreationView'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import { existing } from './ComponentsTestingData'

describe('CreationView component', () => {
  const setResetNewPolicy = jest.fn()
  const setGetPolicyJSON = jest.fn()
  it('renders as expected', () => {
    const component = renderer.create(
      <CreationView
        loading={false}
        error={null}
        existing={existing}
        setResetNewPolicy={setResetNewPolicy}
        setGetPolicyJSON={setGetPolicyJSON}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('CreationView component', () => {
  const setResetNewPolicy = jest.fn()
  const setGetPolicyJSON = jest.fn()
  it('renders as expected', () => {
    const component = renderer.create(
      <CreationView
        loading={true}
        error={null}
        existing={existing}
        setResetNewPolicy={setResetNewPolicy}
        setGetPolicyJSON={setGetPolicyJSON}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('CreationView component', () => {
  const setResetNewPolicy = jest.fn()
  const setGetPolicyJSON = jest.fn()
  it('renders as expected', () => {
    const component = renderer.create(
      <CreationView
        loading={false}
        error={{}}
        existing={existing}
        setResetNewPolicy={setResetNewPolicy}
        setGetPolicyJSON={setGetPolicyJSON}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('getPolicyJSON function', () => {
  const setResetNewPolicy = jest.fn()
  const setGetPolicyJSON = jest.fn()
  it('renders as expected', () => {
    const wrapper = shallow(
      <CreationView
        loading={false}
        error={null}
        existing={existing}
        setResetNewPolicy={setResetNewPolicy}
        setGetPolicyJSON={setGetPolicyJSON}
      />
    )
    expect(wrapper.instance().getPolicyJSON()).toEqual(null)
  })
})

describe('sortMultiSelectItems function', () => {
  const setResetNewPolicy = jest.fn()
  const setGetPolicyJSON = jest.fn()
  const multiSelectKey = 'test'
  const items = ['c', 'b', 'a']
  it('renders as expected', () => {
    const wrapper = shallow(
      <CreationView
        loading={false}
        error={null}
        existing={existing}
        setResetNewPolicy={setResetNewPolicy}
        setGetPolicyJSON={setGetPolicyJSON}
      />
    )
    expect(wrapper.instance().sortMultiSelectItems(multiSelectKey, items)).toEqual(items.sort())
    expect(wrapper.instance().sortMultiSelectItems('selectors', items)).toEqual(items)
  })
})

describe('handleEditorCommand function', () => {
  const setResetNewPolicy = jest.fn()
  const setGetPolicyJSON = jest.fn()
  it('renders as expected', () => {
    const wrapper = shallow(
      <CreationView
        loading={false}
        error={null}
        existing={existing}
        setResetNewPolicy={setResetNewPolicy}
        setGetPolicyJSON={setGetPolicyJSON}
      />
    )
    expect(wrapper.instance().handleEditorCommand('next')).toEqual('next')
    expect(wrapper.instance().handleEditorCommand('undo')).toEqual('undo')
    expect(wrapper.instance().handleEditorCommand('redo')).toEqual('redo')
    expect(wrapper.instance().handleEditorCommand('restore')).toEqual('restore')
  })
})

describe('handleEditorCommand function', () => {
  const setResetNewPolicy = jest.fn()
  const setGetPolicyJSON = jest.fn()
  const evt = {
    target: {
      value: 'value-testing'
    },
    selectedItems: ['selectedItems-testing-1', 'selectedItems-testing-2'],
  }
  it('renders as expected', () => {
    const wrapper = shallow(
      <CreationView
        loading={false}
        error={null}
        existing={existing}
        setResetNewPolicy={setResetNewPolicy}
        setGetPolicyJSON={setGetPolicyJSON}
      />
    )
    expect(wrapper.instance().onChange('name', evt)).toEqual('name')
    expect(wrapper.instance().onChange('enforce', evt)).toEqual('enforce')
    expect(wrapper.instance().onChange('standards', evt)).toEqual('standards')
    expect(wrapper.instance().onChange('categories', evt)).toEqual('categories')
    expect(wrapper.instance().onChange('controls', evt)).toEqual('controls')
    // expect(wrapper.instance().onChange('specs', evt)).toEqual('specs')
    expect(wrapper.instance().onChange('selectors', evt)).toEqual('selectors')
  })
})
