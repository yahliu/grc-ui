/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************
* Copyright (c) 2020 Red Hat, Inc.
*/

const parser = require('../utils/yamlHelper')

module.exports = {
  elements: {
    spinner: '.content-spinner',
    table: '.bx--data-table-v2',
    tableExpandBtn: '.bx--table-expand-v2__button:nth-of-type(1)',
    expandTable: '.bx--expandable-row-v2:nth-of-type(2)',
    createPolicyButton: '.bx--btn--primary:nth-of-type(1)',
    submitCreatePolicyButton: '#create-button-portal-id',
    yamlInputField: '.ace_text-input',
    yamlTextField: '.ace_editor',
    searchInput: 'input.bx--search-input',
    overflowButton: '.bx--overflow-menu:nth-of-type(1)',
    deleteButton: '.bx--overflow-menu-options__option--danger',
    confirmDeleteButton: '.bx--btn--danger--primary',
    noResource: '.no-resource',
    policyStatus: '#complianceStatus-module-id',
    policyNameInput: '#name',
    namespaceDropdown: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box',
    namespaceDropdownBox: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu',
    templateDropdown: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box',
    templateDropdownBox: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    clusterSelectorDropdown: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__field',
    clusterSelectorDropdownBox: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    enforce: '.creation-view-controls-checkbox > div.bx--form-item.bx--checkbox-wrapper',
    standardsDropdown: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box',
    standardsDropdownBox: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    categoriesDropdown: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box',
    categoriesDropdownBox: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    controlsDropdown: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box',
    controlsDropdownBox: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    summaryCollapse: 'button.collapse > span.collapse-button',
    summaryInfoContainer: 'div.module-grc-cards > div.card-container-container',
    summaryDropdown: 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1)',
    summaryDropdownBox: 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2)',
    filterClear: '.resource-filter-bar > span.button',
  },
  commands: [{
    createPolicy,
    deletePolicy,
    tryEnable,
    tryDisable,
    checkViolations
  }]
}

function createPolicy(browser, yaml, time) {
  this.waitForElementVisible('@createPolicyButton')
  this.click('@createPolicyButton')
  //this.click('.bx--toggle__appearance')
  this.click('@namespaceDropdown')
  this.waitForElementPresent('.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu > div:nth-child(1)')
  this.click('.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu > div:nth-child(1)')
  this.waitForElementPresent('@yamlInputField')
  this.click('@yamlTextField')
  parser.enterTextInYamlEditor(this, browser, yaml, time)
  // this.clearValue('@policyNameInput')
  // this.setValue('@policyNameInput',`${time}-policy-test`)
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible('@submitCreatePolicyButton')
  this.click('@submitCreatePolicyButton')
  this.waitForElementVisible('@table')
}

function checkViolations(name, violationExpected) {
  this.waitForElementVisible('@searchInput')
  this.clearValue('@searchInput')
  this.setValue('@searchInput', name)
  this.click('tbody>tr>td>a')
  this.waitForElementPresent('#violation-tab')
  this.click('#violation-tab')
  if (violationExpected) {
    this.waitForElementPresent('#violations-table-container')
  } else {
    this.waitForElementPresent('.no-resource')
  }
  this.click('.bx--breadcrumb > div:nth-child(1)')
}

function deletePolicy(browser, name){
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.clearValue('@searchInput')
  this.setValue('@searchInput', name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(name)
  this.waitForElementNotPresent('bx--overflow-menu-options__option.bx--overflow-menu-options__option--danger')
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9)')
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4)')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4) > button').text.to.equal('Remove')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4) > button')
  this.waitForElementVisible('button.bx--btn--danger--primary')
  this.click('button.bx--btn--danger--primary')
  this.waitForElementVisible('button.bx--search-close')
  browser.pause(2000)
  this.click('button.bx--search-close')
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.not.to.equal(name)
}

function tryEnable(name){
  //verify table/menu exist
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.clearValue('@searchInput')
  this.setValue('@searchInput', name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > div:nth-child(1)').text.to.equal(name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9)')
  //enable policy
  this.waitForElementPresent('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3)')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button').text.to.equal('Enable')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button')
  this.waitForElementVisible('#enable-resource-modal')
  this.click('#enable-resource-modal > div > .bx--modal-footer > .bx--btn.bx--btn--primary')
  this.clearValue('@searchInput')
}

function tryDisable(name){
  //verify table/menu exist
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.clearValue('@searchInput')
  this.setValue('@searchInput', name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9)')
  //disable policy
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3)')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button').text.to.equal('Disable')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button')
  this.waitForElementVisible('#disable-resource-modal')
  this.click('#disable-resource-modal > div > .bx--modal-footer > .bx--btn.bx--btn--danger--primary')
  this.clearValue('@searchInput')
}