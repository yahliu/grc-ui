/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { getLabels, getTruncatedText } from '../../../src-web/definitions/hcm-policies-cluster'

describe('getTruncatedText', () => {
  it('Should return truncated text item', () => {
    const item = 'TruncateText'
    expect(getTruncatedText(item)).toMatchSnapshot()
  })
})
describe('getLabels', () => {
  it('Should return labels of truncated text item', () => {
    const item = {
      nonCompliant: ['nonCompliant1','nonCompliant2']
    }
    expect(getLabels(item)).toMatchSnapshot()
  })
})
