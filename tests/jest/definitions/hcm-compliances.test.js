/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import {
  createComplianceLink,
  createPolicyLink,
  createCompliancePolicyLink,
  getStatus,
  getStatusIcon,
  getStatusIconForPolicy,
  getComplianceStatusIcon,
  getCompliancePolicyStatus,
  getStatusCount,
  getClusterCount,
  getControls,
  getStandards,
  getCategories,
  getDecisions,
} from '../../../src-web/definitions/hcm-compliances'

describe('hcm-compliances - createComplianceLink', () => {
  it('should return valid compliance link', () => {
    const item1 = {
      metadata: {
        name: 'testCreateComplianceLink1',
        namespace: 'testNamespace1'
      }
    }
    const param = ['param1', 'param2', 'param3']
    expect(createComplianceLink(item1, ...param)).toMatchSnapshot()

    const item2 = {
      metadata: {
        name: 'testCreateComplianceLink2',
        namespace: 'testNamespace2'
      },
      raw : {
        kind: 'Compliance'
      }
    }
    expect(createComplianceLink(item2)).toMatchSnapshot()

    const item3 = {
      metadata: {
        name: 'testCreateComplianceLink3',
        namespace: 'testNamespace3'
      },
      raw : {
        kind: 'Default'
      }
    }
    expect(createComplianceLink(item3)).toMatchSnapshot()
  })
})

describe('hcm-compliances - getComplianceStatusIcon', () => {
  it('should return compliance status incon', () => {
    const item1 = {
      status: 'compliant'
    }
    expect(getComplianceStatusIcon(item1, 'en-US')).toMatchSnapshot()

    const item2 = {
      status: 'noncompliant'
    }
    expect(getComplianceStatusIcon(item2, 'en-US')).toMatchSnapshot()

    const item3 = {
      status: null
    }
    expect(getComplianceStatusIcon(item3, 'en-US')).toBe('-')
  })
})

describe('hcm-compliances - getCompliancePolicyStatus', () => {
  it('should return compliance policy status', () => {
    const item1 = {
      clusterNotCompliant: 'clusterNotCompliant'
    }
    expect(getCompliancePolicyStatus(item1, 'en-US')).toMatchSnapshot()

    const item2 = {
      clusterNotCompliant: ''
    }
    expect(getCompliancePolicyStatus(item2, 'en-US')).toMatchSnapshot()
  })
})

describe('hcm-compliances - createPolicyLink', () => {
  it('should return valid policy link', () => {
    const item = {
      metadata: {
        name: 'testName',
        namespace: 'testNamespace'
      }
    }
    expect(createPolicyLink(item)).toMatchSnapshot()
  })
})

describe('hcm-compliances - createCompliancePolicyLink', () => {
  it('should return valid compliance policy link', () => {
    const item = {
      cluster: 'clusterName',
      complianceName: 'testComplianceName',
      complianceNamespace: 'testComplianceNamespace',
      metadata: {
        name: 'testName',
      }
    }
    expect(createCompliancePolicyLink(item)).toMatchSnapshot()
  })
})

describe('hcm-compliances - getStatus', () => {
  it('should return compliant status', () => {
    const item = {
      status: 'compliant'
    }
    expect(getStatus(item, 'en-US')).toMatchSnapshot()
  })
  it('should return compliant status', () => {
    const item = {
      status: 'noncompliant'
    }
    expect(getStatus(item, 'en-US')).toMatchSnapshot()
  })
  it('should return "-"', () => {
    const item = {
    }
    expect(getStatus(item, 'en-US')).toBe('-')
  })
})

describe('hcm-compliances - getStatusIcon', () => {
  it('should return compliant status', () => {
    const item = {
      compliant: 'compliant'
    }
    expect(getStatusIcon(item, 'en-US')).toMatchSnapshot()
  })
  it('should return noncompliant status', () => {
    const item = {
      compliant: 'noncompliant'
    }
    expect(getStatusIcon(item, 'en-US')).toMatchSnapshot()
  })
  it('should return "-"', () => {
    const item = {
    }
    expect(getStatusIcon(item, 'en-US')).toBe('-')
  })
})

describe('hcm-compliances - getStatusIconForPolicy', () => {
  it('should return compliant status', () => {
    const item = {
      status: 'compliant'
    }
    expect(getStatusIconForPolicy(item, 'en-US')).toMatchSnapshot()
  })
  it('should return noncompliant status', () => {
    const item = {
      status: 'noncompliant'
    }
    expect(getStatusIconForPolicy(item, 'en-US')).toMatchSnapshot()
  })
  it('should return "-"', () => {
    const item = {
    }
    expect(getStatusIconForPolicy(item, 'en-US')).toBe('-')
  })
})

describe('hcm-compliances - getStatusCount', () => {
  it('should return status count', () => {
    const item = {
      policyCompliant: 5,
      policyTotal: 10
    }
    expect(getStatusCount(item)).toMatchSnapshot()
  })
})

describe('hcm-compliances - getClusterCount', () => {
  it('should return cluster count', () => {
    const item = {
      clusterCompliant: 7,
      clusterTotal: 15
    }
    expect(getClusterCount(item)).toMatchSnapshot()
  })
})

describe('hcm-compliances - getControls', () => {
  it('should return control status', () => {
    const items = {
      metadata: {
        name: 'testGetControls',
        annotations: {
          'policy.mcm.ibm.com/controls': '1,2,3,4,5'
        }
      },
    }
    expect(getControls(items)).toMatchSnapshot()
  })
})

describe('hcm-compliances - getStandards', () => {
  it('should return standards status', () => {
    const items = {
      metadata: {
        name: 'testGetStandards',
        annotations: {
          'policy.mcm.ibm.com/standards': '6,7,8,9,10'
        }
      },
    }
    expect(getStandards(items)).toMatchSnapshot()
  })
})

describe('hcm-compliances - getCategories', () => {
  it('should return categories status', () => {
    const items = {
      metadata: {
        name: 'testGetCategories',
        annotations: {
          'policy.mcm.ibm.com/categories': '11,12,13,14,15'
        }
      },
    }
    expect(getCategories(items)).toMatchSnapshot()
  })
})

describe('hcm-compliances - getDecisions', () => {
  it('should return decisions status', () => {
    const items = {
      status: {
        decisions: [{clusterName:'clusterName1'}, {clusterName:'clusterName2'}, {clusterName:'clusterName3'}]
      },
    }
    expect(getDecisions(items)).toMatchSnapshot()
  })
  it('should return default status', () => {
    const items = {}
    expect(getDecisions(items)).toMatchSnapshot()
  })
})