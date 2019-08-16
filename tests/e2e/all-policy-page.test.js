/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')
const a11yScan = require('../utils/accessibilityScan')
let page

module.exports = {
  '@disabled': false,

  before: (browser) => {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/policies/all`
    page = browser.page.AllPolicyPage()
    page.navigate(url)
  },

  'All policy page: Load and run expand': (browser) => {
    page.verifyTable(browser, false)
  },

  'All policy page: Verify summary table': (browser) => {
    page.verifySummary(browser, `${browser.launch_url}${config.get('contextPath')}/policies/all`)
  },

  'All policy page: Test pagination': (browser) => {
    page.verifyPagination(browser)
  },

  'All policy page: Add, search, delete policy': (browser) => {
    const time = browser.globals.time
    page.createTestPolicy(browser, time)
    page.navigate(`${browser.launch_url}${config.get('contextPath')}/policies/all`)
    page.searchPolicy(true, time)
    page.testDetailsPage(browser, `${time}-policy-test`)
    page.deletePolicy(`${time}-policy-test`, browser)
  },

  'All policy page: Run Accessibility Scan': (browser) => {
    page.navigate(`${browser.launch_url}${config.get('contextPath')}/policies/all`)
    a11yScan.runAccessibilityScan(browser, 'allPolicy')
    page.navigate(`${browser.launch_url}${config.get('contextPath')}/policies/all`)
    a11yScan.runAccessibilityScan(browser, 'policyDetail')
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
