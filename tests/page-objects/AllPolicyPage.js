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
    submitCreatePolicyButton: '#policy-create',
    yamlInputField: '.ace_text-input',
    yamlTextField: '.ace_editor',
    searchInput: 'input.bx--search-input',
    overflowButton: '.bx--overflow-menu:nth-of-type(1)',
    deleteButton: '.bx--overflow-menu-options__option--danger',
    confirmDeleteButton: '.bx--btn--danger--primary',
    noResource: '.no-resource',
    policyStatus: '#complianceStatus-module-id',
    policyNameInput: '#policy-name',
    templateDropdown: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--multi-select.bx--list-box',
    templateDropdownBox: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    clusterSelectorDropdown: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box',
    clusterSelectorDropdownBox: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    enforce: '.creation-view-controls-checkbox > div.bx--form-item.bx--checkbox-wrapper',
    standardsDropdown: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box',
    standardsDropdownBox: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    categoriesDropdown: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box',
    categoriesDropdownBox: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    controlsDropdown: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box',
    controlsDropdownBox: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',


  },
  commands: [{
    verifyTable,
    createTestPolicy,
    searchPolicy,
    testDetailsPage,
    deletePolicy,
  }]
}

function verifyTable(browser) {
  browser.pause(5*1000)
  browser.element('css selector', 'div.no-resource', function(result){
    if(result.status != -1){
      this.expect.element('div.no-resource').to.be.present
    }
    else{
      this.expect.element('table.bx--data-table-v2').to.be.present
      this.click('button.bx--table-expand-v2__button:nth-of-type(1)')
      this.expect.element('tr.bx--expandable-row-v2:nth-of-type(2)').to.be.present
      this.click('button.bx--table-expand-v2__button:nth-of-type(1)')
      this.expect.element('tr.bx--expandable-row-v2:nth-of-type(2)').to.be.not.present
    }
  })
}


function createTestPolicy(browser, time) {
  // this.setValue('@searchInput',`${time}-policy-test`)
  this.expect.element('@createPolicyButton').to.be.present
  this.click('@createPolicyButton')
  this.expect.element('@yamlInputField').to.be.present
  this.click('@yamlTextField')
  this.clearValue('@policyNameInput')
  this.setValue('@policyNameInput',`${time}-policy-test`)

  this.click('@templateDropdown').expect.element('@templateDropdownBox').to.be.present
  this.click('#downshift-0-item-4')
  this.click('@templateDropdown').expect.element('@templateDropdownBox').not.to.be.present

  this.click('@clusterSelectorDropdown').expect.element('@clusterSelectorDropdownBox').to.be.present
  this.click('#downshift-1-item-0')
  this.click('@clusterSelectorDropdown').expect.element('@clusterSelectorDropdownBox').not.to.be.present
  this.click('@enforce')

  this.click('@standardsDropdown').expect.element('@standardsDropdownBox').to.be.present
  this.click('#downshift-2-item-2')
  this.click('@standardsDropdown').expect.element('@standardsDropdownBox').not.to.be.present

  this.click('@categoriesDropdown').expect.element('@categoriesDropdownBox').to.be.present
  this.click('#downshift-3-item-1')
  this.click('@categoriesDropdown').expect.element('@categoriesDropdownBox').not.to.be.present

  this.click('@controlsDropdown').expect.element('@controlsDropdownBox').to.be.present
  this.click('#downshift-4-item-1')
  this.click('@controlsDropdown').expect.element('@controlsDropdownBox').not.to.be.present

  this.waitForElementNotPresent('@spinner')

  this.expect.element('@submitCreatePolicyButton').to.be.present
  this.click('@submitCreatePolicyButton')

  this.waitForElementPresent('@table')
  this.waitForElementPresent('@searchInput')
  this.setValue('@searchInput',`${time}-policy-test`)
}

function searchPolicy(expectToDisplay, time) {
  this.expect.element('@searchInput').to.be.present
  this.setValue('@searchInput',`${time}-policy-test`)
  this.expect.element('@searchInput').to.be.present
  if(expectToDisplay){
    this.expect.element('tbody>tr').to.have.attribute('data-row-name').equals(`${time}-policy-test`)
  } else{
    this.expect.element('tbody>tr').to.be.not.present
    this.clearValue('@searchInput')
  }
}

function testDetailsPage() {
  this.click('tbody>tr>td>a')
  this.waitForElementPresent('@policyStatus')
  this.expect.element('.bx--module__title:nth-of-type(1)').text.to.equal('Policy details')
}

function deletePolicy(){
  this.expect.element('@overflowButton').to.be.present
  this.click('@overflowButton')
  this.expect.element('@deleteButton').to.be.present
  this.click('@deleteButton')
  this.expect.element('@confirmDeleteButton').to.be.present
  this.click('@confirmDeleteButton')
}
