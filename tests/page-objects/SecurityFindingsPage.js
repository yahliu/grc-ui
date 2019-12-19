/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
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
    submitCreatePolicyButton: '#create-button-portal-id',
    //yamlInputField: '.ace_text-input',
    //yamlTextField: '.ace_editor',
    searchInput: 'input.bx--search-input',
    overflowButton: '.bx--overflow-menu:nth-of-type(1)',
    deleteButton: '.bx--overflow-menu-options__option--danger',
    confirmDeleteButton: '.bx--btn--danger--primary',
    noResource: '.no-resource',
    policyStatus: '#complianceStatus-module-id',
    policyNameInput: '#name',
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
    summaryCollapse: 'button.collapse > span.collapse-button',
    summaryInfoContainer: 'div.module-grc-cards > div.card-container-container',
    summaryDropdown: 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1)',
    summaryDropdownBox: 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2)',
  },
  commands: [{
    verifyTable,
    // searchFindings,
    verifyPagination,
    verifySummary
  }]
}

function verifySummary(browser, url) {
  this.waitForElementPresent('button.collapse > span.collapse-button')
  this.waitForElementPresent('div.module-grc-cards > div.card-container-container')
  this.navigate(url + '?card=false&index=0')
  this.expect.element('@summaryInfoContainer').to.be.not.present
  this.navigate(url + '?card=true&index=0')
  this.waitForElementPresent('@summaryInfoContainer')
  //standards summary
  this.waitForElementPresent('@summaryDropdown')
  this.click('@summaryDropdown')
  const dropdownBox = 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2)'
  //Categories summary
  this.waitForElementPresent(dropdownBox + ' > div:nth-child(2)')
  this.click(dropdownBox + ' > div:nth-child(2)')
  browser.pause(1000)
  checkPolicySummaryCards.call(this, browser)
  //Standards summary
  this.waitForElementPresent('@summaryDropdown')
  this.click('@summaryDropdown')
  this.waitForElementPresent(dropdownBox + ' > div:nth-child(1)')
  this.click(dropdownBox + ' > div:nth-child(1)')
  browser.pause(1000)
  checkPolicySummaryCards.call(this, browser)
}

function checkPolicySummaryCards(browser) {
  browser.elements('css selector','div.module-grc-cards > div:nth-child(2) > div', (cards) => {
    for (var cardNum = 1; cardNum < cards.value.length + 1; cardNum++) {
      for (let i = 1; i <= 2; i++) {
        const cardInfo = `div.module-grc-cards > div:nth-child(2) > div:nth-child(${cardNum}) > div > div > div:nth-child(2)`
        this.waitForElementPresent(cardInfo)
        browser.element('css selector', cardInfo + ' > .empty-violations-strip', function(result){
          if(result.value == false) {
            this.click(cardInfo + ` > div:nth-child(${i})`)
            browser.pause(1000)
            browser.element('css selector', '.resource-filter-bar > span.button', function(result2){
              if(result2.status != -1) {
                //first card of each category is cluster (no drop-down), second is policy
                verifyTable(browser)
                this.waitForElementPresent('div.resource-filter-bar > span.button')
                this.click('div.resource-filter-bar > span.button')
              }
            })
          }
        })
      }
    }
  })
}

function verifyPagination() {
  const pagination = '.bx--pagination'
  this.waitForElementPresent(pagination)
  this.click('select[id="bx-pagination-select-resource-table-pagination"] option[value="5"]')
  this.waitForElementPresent('.bx--pagination__button.bx--pagination__button--forward')
  this.click('.bx--pagination__button.bx--pagination__button--forward')
  this.waitForElementPresent('.bx--pagination__button.bx--pagination__button--backward')
  this.click('.bx--pagination__button.bx--pagination__button--backward')
  this.click('select[id="bx-pagination-select-resource-table-pagination"] option[value="10"]')
}

function verifyTable(browser) {
  browser.pause(5*1000)
  browser.element('css selector', 'div.no-resource', function(result){
    if(result.status != -1){
      this.waitForElementPresent('div.no-resource')
    }
    else{
      this.waitForElementPresent('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
    }
  })
}
