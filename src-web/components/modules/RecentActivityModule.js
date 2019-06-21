/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
//import { Link } from 'react-router-dom'

resources(() => {
  require('../../../scss/module-recent-activity.scss')
})

export default class RecentActivityModule extends React.Component {

  render() {
    const { locale } = this.context
    const title = msgs.get('overview.recent.activity.title', locale)
    const { handleDrillDownClick } = this.props
    const data = this.getModuleData()
    return (
      <div className='module-recent-activity'>
        <div className='card-container-container'>
          <div className='card-container'>
            <div className='card-content'>
              <div className='card-inner-content'>
                <div className='card-title'>
                  {title}
                </div>
                {data.violations.map(({count, violationType}, idx) => {
                  const onClick = () =>{
                    handleDrillDownClick(violationType)
                  }
                  const onKeyPress = (e) =>{
                    if ( e.key === 'Enter') {
                      onClick()
                    }
                  }
                  const classes = classNames({
                    'card-count-type': true,
                    hasBorder: idx===1,
                  })
                  return (
                    <div key={violationType} className={classes} role={'button'}
                      tabIndex='0' onClick={onClick} onKeyPress={onKeyPress}>
                      <div className='card-count'>
                        {count}
                      </div>
                      <div className='card-type'>
                        <div>
                          {violationType.toUpperCase()}
                        </div>
                        <div>
                          {msgs.get('overview.recent.activity.violation.type', locale).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {data.findings.map(({count, findingType}) => {
                  const onClick = () =>{
                    handleDrillDownClick(findingType)
                  }
                  const onKeyPress = (e) =>{
                    if ( e.key === 'Enter') {
                      onClick()
                    }
                  }
                  return (
                    <div key={findingType} className='card-count-type' role={'button'}
                      tabIndex='0' onClick={onClick} onKeyPress={onKeyPress}>
                      <div className='card-count'>
                        {count}
                      </div>
                      <div className='card-type'>
                        <div>
                          {msgs.get('overview.recent.activity.finding.severity', [findingType], locale).toUpperCase()}
                        </div>
                        <div>
                          {msgs.get('overview.recent.activity.finding.type', locale).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getModuleData = () => {
    const { locale } = this.context
    const { policies } = this.props
    const policySet = new Set()
    const clusterSet = new Set()
    policies.map(policy=>{
      const statuses = _.get(policy, 'raw.status.status', {})
      Object.keys(statuses).forEach(key=>{
        const compliant = statuses[key].compliant
        if (!compliant || compliant.toLowerCase()==='noncompliant') {
          clusterSet.add(key)
          policySet.add(_.get(policy, 'metadata.name', 'unknown'))
        }
      })
    })
    return {
      violations: [
        {count: policySet.size, violationType: msgs.get('overview.top.violations.policy', locale)},
        {count: clusterSet.size, violationType: msgs.get('overview.top.violations.cluster', locale)},
      ],
      findings: [
        {count: 3, findingType: 'High'},
        {count: 23, findingType: 'Medium'},
        {count: 28, findingType: 'Low'},
      ]
    }
  }
}

RecentActivityModule.propTypes = {
  handleDrillDownClick: PropTypes.func,
  policies: PropTypes.array,
}
