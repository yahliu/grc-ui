/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* eslint-disable no-console */
const AAT = require('@ibma/aat')
const fs = require('fs')
const path = require('path')
const lodash = require('lodash')

module.exports = {
  runAccessibilityScan: (browser, page) => {
    browser.source(source => {
      browser.perform((done) => {
        AAT.getCompliance(source.value, page, (report) => {
          const reportSnap = JSON.parse(fs.readFileSync(path.join(__dirname,`/A11y-snapshot/${page}.json`), 'utf8'))
          browser.assert.equal(report.summary.counts.violation, reportSnap.summary.counts.violation, `Check for accesibility violations in page ${browser.launchUrl}/policy/${page}   See report at: ./tests-output/a11y/${page}.json`)

          // eslint-disable-next-line no-constant-condition
          if(report.summary.counts.violation !== reportSnap.summary.counts.violation){
            const currentViolations = lodash.filter(report.reports[0].issues,{'level':'violation'})
            const currentPotentialViolations = lodash.filter(report.reports[0].issues,{'level':'potentialviolation'})
            const snapshotViolations = lodash.filter(reportSnap.reports[0].issues,{'level':'violation'})
            const snapshotPotentialViolations = lodash.filter(reportSnap.reports[0].issues,{'level':'potentialviolation'})
            console.log('Violations from current page',lodash.countBy(currentViolations,'ruleId'))
            console.log('Violations from snapshot',lodash.countBy(snapshotViolations,'ruleId'))
            // console.log('Violation difference', lodash.difference(currentViolations,snapshotViolations))
            console.log('Potential violations from current page',lodash.countBy(currentPotentialViolations,'ruleId'))
            console.log('Potential violations from snapshot',lodash.countBy(snapshotPotentialViolations,'ruleId'))
            // console.log('Potential violation difference', lodash.difference(currentPotentialViolations,snapshotPotentialViolations))
            console.log('------------TO FIND RULE SET--------------')
            console.log('GO TO http://ibm.biz/A11yToolsLandingPage AND CLICK ON RULES TAB')
          }

          if(report.issueMessages.messages && report.summary.counts.violation > 0) {
            console.log('----- ITEMIZED A11Y ERRORS: --------------------------------------')
            console.log(report.issueMessages.messages)
            console.log('------------------------------------------------------------------')
          }
          done()
        })
      })
    })
  }
}
