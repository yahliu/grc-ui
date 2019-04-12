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
    headerTitle: '.bx--detail-page-header-title',
    spinner: '.content-spinner',
    overviewContainer: '.overview-view',
    violationCardCluster: '.card-count-container:nth-of-type(1)',
    violationTable: '.bx--data-table-v2-container',
    backLink: '.breadcrumb-link',
    violationCardPolicy: '.card-count-container:nth-of-type(2)',

  },
  commands: [{
    verifyPageLoaded,
    verifyViolationTable,
  }]
}



/**
 * Verifications
 */

function verifyPageLoaded() {
  this.expect.element('@headerTitle').to.be.present
  this.expect.element('@spinner').to.be.present
  this.waitForElementNotPresent('@spinner')
  this.expect.element('@overviewContainer').to.be.present
}

function verifyViolationTable() {
  this.expect.element('@violationCardCluster').to.be.present
  this.click('@violationCardCluster')
  this.expect.element('@violationTable').to.be.present
  this.click('@backLink')
  this.expect.element('@violationCardPolicy').to.be.present
  this.click('@violationCardPolicy')
  this.expect.element('@violationTable').to.be.present
}
