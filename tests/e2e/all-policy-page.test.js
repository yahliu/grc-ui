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

  'All policy page: Load and run expand': () => {
    page.verifyTable()
  },

  'All policy page: Add, search, delete policy': (browser) => {
    const time = new Date().getTime()

    page.createTestPolicy(browser, time)
    page.searchPolicy(true, time)
    browser.pause(30*1000) // Wait for pp and pb to show up in detail page
    page.testDetailsPage()
    a11yScan.runAccessibilityScan(browser, 'policyDetail')
    page.deletePolicy()
    page.searchPolicy(false, time)
  },

  'All policy page: Run Accessibility Scan': (browser) => {
    a11yScan.runAccessibilityScan(browser, 'allPolicy')
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
