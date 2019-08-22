/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { getFindingStandards, getFindingControl, getFindingCategories } from '../../../src-web/definitions/hcm-security-findings'

const item1 = {
  'securityClassification': {}
}

const item2 = {
  'securityClassification': {
    'securityStandards': [''],
    'securityCategories': [''],
    'securityControl': ''}
}

const item3 = {
  'securityClassification': {
    'securityStandards': ['NIST'],
    'securityCategories': ['SystemAndInformationIntegrity'],
    'securityControl': 'VA'}
}

const item4 = {
  'securityClassification': {
    'securityStandards': ['NIST', '', 'HIPAA'],
    'securityCategories': ['TestCaseFour', '', 'Test Case Four'],
    'securityControl': 'TestCaseFour'}
}

describe('getFindingStandards', () => {
  it('Should return formarted FindingStandards', () => {
    expect(getFindingStandards(item1)).toMatchSnapshot()
  })

  it('Should return formarted FindingStandards', () => {
    expect(getFindingStandards(item2)).toMatchSnapshot()
  })

  it('Should return formarted FindingStandards', () => {
    expect(getFindingStandards(item3)).toMatchSnapshot()
  })

  it('Should return formarted FindingStandards', () => {
    expect(getFindingStandards(item4)).toMatchSnapshot()
  })
})

describe('getFindingControl', () => {
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item1)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item2)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item3)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item4)).toMatchSnapshot()
  })
})

describe('getFindingCategories', () => {
  it('Should return formarted FindingCategories', () => {
    expect(getFindingCategories(item1)).toMatchSnapshot()
  })
  it('Should return formarted FindingCategories', () => {
    expect(getFindingCategories(item2)).toMatchSnapshot()
  })
  it('Should return formarted FindingCategories', () => {
    expect(getFindingCategories(item3)).toMatchSnapshot()
  })
  it('Should return formarted FindingCategories', () => {
    expect(getFindingCategories(item4)).toMatchSnapshot()
  })
})
