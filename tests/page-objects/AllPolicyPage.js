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
    table: '.bx--data-table-v2',
    tableExpandBtn: '.bx--table-expand-v2__button:nth-of-type(1)',
    expandTable: '.bx--expandable-row-v2:nth-of-type(2)',
    createPolicyButton: '.bx--btn--primary:nth-of-type(1)',
    submitCreatePolicyButton: '.bx--btn--primary:nth-of-type(2)',
    yamlInputField: '.ace_text-input',
    yamlTextField: '.ace_editor',
    searchInput: '.bx--search-input',
    overflowButton: '.bx--overflow-menu:nth-of-type(1)',
    deleteButton: '.bx--overflow-menu-options__option--danger',
    confirmDeleteButton: '.bx--btn--danger--primary'
  },
  commands: [{
    verifyTable,
    createTestPolicy,
    searchPolicy,
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

const time = new Date().getTime()

const policyYaml =
`apiVersion: policy.mcm.ibm.com/v1alpha1
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

function createTestPolicy(browser) {
  this.expect.element('@createPolicyButton').to.be.present
  this.click('@createPolicyButton')
  this.expect.element('@yamlInputField').to.be.present
  this.click('@yamlTextField')

  const keystrokes = []
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
}

function searchPolicy(expectToDisplay) {
  this.expect.element('@searchInput').to.be.present
  this.setValue('@searchInput',`${time}-policy-pod`)
  if(expectToDisplay){
    this.expect.element('tbody tr').to.have.attribute('data-row-name').equals(`${time}-policy-pod`)
  } else{
    this.expect.element('tbody tr').to.be.not.present
  }
}

function deletePolicy(){
  this.expect.element('@overflowButton').to.be.present
  this.click('@overflowButton')
  this.expect.element('@deleteButton').to.be.present
  this.click('@deleteButton')
  this.expect.element('@confirmDeleteButton').to.be.present
  this.click('@confirmDeleteButton')
}
