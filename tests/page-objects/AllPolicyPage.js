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
    expandTable: '.bx--expandable-row-v2:nth-of-type(2)'
  },
  commands: [{
    verifyTable
  }]
}

function verifyTable() {
  this.expect.element('@table').to.be.present
  this.click('@tableExpandBtn')
  this.expect.element('@expandTable').to.be.present
  this.click('@tableExpandBtn')
  this.expect.element('@expandTable').to.be.not.present
}
