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

    const url = `${browser.launch_url}${config.get('contextPath')}`
    page = browser.page.OverviewPage()
    page.navigate(url)
  },

  'Overview: Load page': () => {
    page.verifyPageLoaded()
  },

  'Overview: Violation table': () => {
    page.verifyViolationTable()
  },

  'Overview: Run Accessibility Scan': (browser) => {
    a11yScan.runAccessibilityScan(browser, 'overview')
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
