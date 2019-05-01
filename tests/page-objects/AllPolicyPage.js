/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

module.exports = {
  elements: {
    spinner: '.content-spinner',
    table: '.bx--data-table-v2',
    tableExpandBtn: '.bx--table-expand-v2__button:nth-of-type(1)',
    expandTable: '.bx--expandable-row-v2:nth-of-type(2)',
    createPolicyButton: '.bx--btn--primary:nth-of-type(1)',
    submitCreatePolicyButton: '.bx--btn--primary:nth-of-type(2)',
    yamlInputField: '.ace_text-input',
    yamlTextField: '.ace_editor',
    searchInput: 'input.bx--search-input',
    overflowButton: '.bx--overflow-menu:nth-of-type(1)',
    deleteButton: '.bx--overflow-menu-options__option--danger',
    confirmDeleteButton: '.bx--btn--danger--primary'
  },
  commands: [{
    verifyTable,
    createTestPolicy,
    searchPolicy,
    testDetailsPage,
    deletePolicy,
  }]
}

function verifyTable() {
  this.expect.element('@table').to.be.present
  this.click('@tableExpandBtn')
  this.expect.element('@expandTable').to.be.present
  this.click('@tableExpandBtn')
  this.expect.element('@expandTable').to.be.not.present
}


function generatePolicyYaml (time) {
  return `apiVersion: mcm.ibm.com/v1alpha1
kind: PlacementPolicy
metadata:
  name: ${time}-placement-policy-test
  namespace: mcm
#  description: Example of PlacementPolicy
spec:
  clusterLabels:
    matchLabels:
      cloud: "IBM"
---
apiVersion: mcm.ibm.com/v1alpha1
kind: PlacementBinding
metadata:
  name: ${time}-placement-binding-test
  namespace: mcm
#  description: Example of PlacementBinding
placementRef:
  name: ${time}-placement-policy-test
  namespace: mcm
subjects:
- name: ${time}-policy-pod
  kind: Policy
---
apiVersion: policy.mcm.ibm.com/v1alpha1
kind: Policy
metadata:
  name: ${time}-policy-pod
  namespace: mcm
  annotations:
    policy.mcm.ibm.com/categories: 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity'
    policy.mcm.ibm.com/controls: 'MutationAdvisor,VA'
    policy.mcm.ibm.com/standards: NIST
    seed-generation: '2'
  finalizers:
    - propagator.finalizer.mcm.ibm.com
  generation: 1
spec:
  complianceType: musthave
  namespaces:
    exclude:
      - kube*
    include:
      - default
  object-templates:
    - complianceType: musthave
      objectDefinition:
        apiVersion: v1
        kind: Pod
        metadata:
          name: nginx1
        spec:
          containers:
            - name: nginx
              image: 'nginx:1.7.9'
              ports:
                - containerPort: 80
  remediationAction: inform`
}

function createTestPolicy(browser, time) {
  this.setValue('@searchInput',`${time}-policy-pod`)
  this.expect.element('@createPolicyButton').to.be.present
  this.click('@createPolicyButton')
  this.expect.element('@yamlInputField').to.be.present
  this.click('@yamlTextField')

  const keystrokes = []
  const policyYaml = generatePolicyYaml(time)
  policyYaml.split(/\r?\n/).forEach(line => {
    const indentation = line.search(/\S|$/)
    keystrokes.push(line)
    keystrokes.push(browser.Keys.RETURN)

    for (let i = 0; i < indentation / 2; i++ ) {
      keystrokes.push(browser.Keys.BACK_SPACE)
    }
  })
  this.api.keys(keystrokes)

  this.expect.element('@submitCreatePolicyButton').to.be.present
  this.click('@submitCreatePolicyButton')
  this.waitForElementNotPresent('@spinner')
}

function searchPolicy(expectToDisplay, time) {
  this.expect.element('@searchInput').to.be.present
  if(expectToDisplay){
    this.expect.element('tbody>tr').to.have.attribute('data-row-name').equals(`${time}-policy-pod`)
  } else{
    this.expect.element('tbody>tr').to.be.not.present
    this.clearValue('@searchInput')
  }
}

function testDetailsPage() {
  this.click('tbody>tr>td>a')
  this.expect.element('.bx--module__title:nth-of-type(1)').text.to.equal('Policy details')
}

function deletePolicy(){
  this.click('div.bx--breadcrumb-item:nth-of-type(1)>a')
  this.expect.element('@overflowButton').to.be.present
  this.click('@overflowButton')
  this.expect.element('@deleteButton').to.be.present
  this.click('@deleteButton')
  this.expect.element('@confirmDeleteButton').to.be.present
  this.click('@confirmDeleteButton')
}
