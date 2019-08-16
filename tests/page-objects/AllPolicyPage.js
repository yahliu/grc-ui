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
    clusterSelectorDropdown: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__field',
    clusterSelectorDropdownBox: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    enforce: '.creation-view-controls-checkbox > div.bx--form-item.bx--checkbox-wrapper',
    standardsDropdown: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box',
    standardsDropdownBox: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    categoriesDropdown: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box',
    categoriesDropdownBox: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    controlsDropdown: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box',
    controlsDropdownBox: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    summaryCollapse: 'button.collapse > span.collapse-button',
    summaryInfoContainer: '.module-grc-cards > div.card-container-container',
    summaryDropdown: '.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1)',
    summaryDropdownBox: '.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2)',
    filterClear: '.resource-filter-bar > span.button',
  },
  commands: [{
    verifySummary,
    verifyTable,
    verifyPagination,
    createTestPolicy,
    searchPolicy,
    testDetailsPage,
    deletePolicy,
  }]
}

function verifySummary(browser, url) {
  this.expect.element('button.collapse > span.collapse-button').to.be.present
  this.waitForElementPresent('div.module-grc-cards > div.card-container-container')
  this.expect.element('@summaryInfoContainer').to.be.present
  this.navigate(url + '?card=false&index=0')
  this.expect.element('@summaryInfoContainer').to.be.not.present
  this.navigate(url + '?card=true&index=0')
  this.expect.element('@summaryInfoContainer').to.be.present
  //standards summary
  this.click('@summaryDropdown')
  const dropdownBox = '.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2)'
  this.click(dropdownBox + ' > div:nth-child(2)')
  checkPolicySummaryCards.call(this, browser)

  //categories summary
  this.click('@summaryDropdown')
  this.click(dropdownBox + ' > div:nth-child(1)')
  checkPolicySummaryCards.call(this, browser)
}

function checkPolicySummaryCards(browser) {
  browser.elements('css selector','div.module-grc-cards > div:nth-child(2) > div', (cards) => {
    for (var cardNum = 1; cardNum < cards.value.length + 1; cardNum++) {
      for (let i = 1; i <= 2; i++) {
        const cardInfo = `div.module-grc-cards > div:nth-child(2) > div:nth-child(${cardNum}) > div > div > div:nth-child(2)`
        this.expect.element(cardInfo).to.be.present
        this.click(cardInfo + ` > div:nth-child(${i})`)
        browser.element('css selector', '.resource-filter-bar > span.button', function(result){
          if(result.status != -1) {
            //first card of each category is cluster (no drop-down), second is policy
            verifyTable(browser, (i % 2 != 0))
            this.click('div.resource-filter-bar > span.button')
          }
        })
      }
    }
  })
}

function verifyTable(browser, cluster) {
  browser.element('css selector', 'div.no-resource', function(result){
    if(result.status != -1){
      this.expect.element('div.no-resource').to.be.present
    }
    else{
      this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra').to.be.present
      if (!cluster) {
        this.click('button.bx--table-expand-v2__button:nth-of-type(1)')
        this.expect.element('tr.bx--expandable-row-v2:nth-of-type(2)').to.be.present
        this.click('button.bx--table-expand-v2__button:nth-of-type(1)')
        this.expect.element('tr.bx--expandable-row-v2:nth-of-type(2)').to.be.not.present
        this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(8) > div > svg')
        this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open').to.be.present
        this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(1)')
      }
      else {
        this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(5) > div > svg')
        this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open').to.be.present
        this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(1)')
      }
      this.expect.element('div.bx--modal.is-visible').to.be.present
      this.click('button.bx--modal-close')
      this.expect.element('div.bx--modal.is-visible').to.be.not.present
    }
  })
}

function verifyPagination() {
  const pagination = '.bx--pagination'
  this.expect.element(pagination).to.be.present
  this.click('select[id="bx-pagination-select-resource-table-pagination"] option[value="5"]')
  this.expect.element('.bx--pagination__button.bx--pagination__button--forward').to.be.present
  this.click('.bx--pagination__button.bx--pagination__button--forward')
  this.expect.element('.bx--pagination__button.bx--pagination__button--backward').to.be.present
  this.click('.bx--pagination__button.bx--pagination__button--backward')
  this.click('select[id="bx-pagination-select-resource-table-pagination"] option[value="10"]')
}


function createTestPolicy(browser, time) {
  this.expect.element('@createPolicyButton').to.be.present
  this.click('@createPolicyButton')
  this.expect.element('@yamlInputField').to.be.present
  this.click('@yamlTextField')
  this.clearValue('@policyNameInput')
  this.setValue('@policyNameInput',`${time}-policy-test`)

  this.click('@templateDropdown').expect.element('@templateDropdownBox').to.be.present
  this.setValue('div.creation-view-controls-container > div > div:nth-child(2) > div.bx--multi-select.bx--list-box > .bx--list-box__field > input', 'Namespace-must have namespace \'Prod\'')
  this.click('div.creation-view-controls-container > div > div:nth-child(2) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div:nth-child(1)')
  this.expect.element('@templateDropdownBox').not.to.be.present

  this.click('@clusterSelectorDropdown').expect.element('@clusterSelectorDropdownBox').to.be.present
  this.setValue('div.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > .bx--list-box__field > input', 'cloud: "IBM')
  this.click('div.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div:nth-child(1)')
  this.expect.element('@clusterSelectorDropdownBox').not.to.be.present

  this.click('@enforce')

  this.click('@standardsDropdown').expect.element('@standardsDropdownBox').to.be.present
  this.setValue('div.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > .bx--list-box__field > input', 'NIST')
  this.click('div.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div:nth-child(1)')
  this.expect.element('@standardsDropdownBox').not.to.be.present

  this.click('@categoriesDropdown').expect.element('@categoriesDropdownBox').to.be.present
  this.setValue('div.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > .bx--list-box__field > input', 'SystemAndInformationIntegrity')
  this.click('div.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div:nth-child(1)')
  this.expect.element('@categoriesDropdownBox').not.to.be.present

  this.click('@controlsDropdown').expect.element('@controlsDropdownBox').to.be.present
  this.setValue('div.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > .bx--list-box__field > input', 'VA')
  this.click('div.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div:nth-child(1)')
  this.expect.element('@controlsDropdownBox').not.to.be.present

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

function testDetailsPage(browser, name) {
  this.click('tbody>tr>td>a')
  //overview tab test
  this.expect.element('.bx--detail-page-header-title').text.to.equal(name)
  this.expect.element('.section-title:nth-of-type(1)').text.to.equal('Policy Details')
  this.expect.element('.new-structured-list > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)').text.to.equal(name)
  this.expect.element('.overview-content > div:nth-child(2) > .section-title').text.to.equal('Placement')
  this.waitForElementPresent('.overview-content-second > div:nth-child(1) > div > div > div:nth-child(1) > .bx--module__title')
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > div:nth-child(1) > .bx--module__title').text.to.equal('Placement Policy')
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > .bx--module__content > section > div > div:nth-child(1) > div:nth-child(2)').text.to.equal('placement-' + name)
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > div:nth-child(1) > .bx--module__title').text.to.equal('Placement Binding')
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > .bx--module__content > section > div > div:nth-child(1) > div:nth-child(2)').text.to.equal('binding-' + name)
  this.expect.element('.overview-content > div:nth-child(3) > .section-title').text.to.equal('Object Templates')
  //violation tab test
  this.expect.element('#violation-tab').to.be.present
  this.click('#violation-tab')
  browser.element('css selector', 'div.no-resource', function(result){
    if(result.status != -1){
      this.expect.element('div.no-resource').to.be.present
      this.expect.element('div.no-resource-title').text.to.equal('No Violations')
    }
    else{
      this.expect.element('.policy-violation-tab > .section-title').text.to.equal('Violations')
    }
  })
  //policy yaml page test
  this.expect.element('#yaml-tab').to.be.present
  this.click('#yaml-tab')
  this.expect.element('.ace_editor.ace-monokai.ace_dark').to.be.present
  this.expect.element('.yaml-editor-button > button:nth-child(1)').to.be.present
  this.expect.element('.yaml-editor-button > button:nth-child(2)').to.be.present
  this.click('.bx--breadcrumb > div:nth-child(1)')
}

function deletePolicy(name){
  this.expect.element('body').to.be.present
  this.expect.element('@searchInput').to.be.present
  this.setValue('@searchInput', name)
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra').to.be.present
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(name)
  this.expect.element('bx--overflow-menu-options__option.bx--overflow-menu-options__option--danger').not.to.be.present
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(8)').to.be.present
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(8) > div > svg')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open').to.be.present
  this.click('li.bx--overflow-menu-options__option.bx--overflow-menu-options__option--danger')
  this.expect.element('button.bx--btn.bx--btn--danger--primary').to.be.present
  this.click('button.bx--btn.bx--btn--danger--primary')
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.not.to.equal(name)
}
