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
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/module-policy-summary.scss')
})

export default class PolicySummaryModule extends React.Component {

  render() {
    const { locale } = this.context
    const title = msgs.get('overview.policy.summary.title', locale)
    const data = this.getModuleData()
    return (
      <div className='module-policy-summary'>
        <div className='card-container-container'>
          <div className='card-container'>
            <div className='card-content'>
              <div className='card-inner-content'>
                <div className='card-title'>
                  {title}
                </div>
                {data.summary.map(({count, summaryType}) => {
                  return (
                    <div key={summaryType} className='card-count-type'>
                      <div className='card-count'>
                        {count}
                      </div>
                      <div className='card-type'>
                        <div>
                          {summaryType.toUpperCase()}
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
    const standardsSet = new Set()
    const categorySet = new Set()
    const policySet = new Set()
    const controlSet = new Set()

    const addTypes = (types='', set) => {
      if (types.length===0) {
        types=msgs.get('overview.policy.overview.other', locale)
      }
      types.split(',').forEach(type=>{
        type=type.trim()
        if (type) {
          set.add(type)
        }
      })
    }

    policies.map(policy=>{
      policySet.add(_.get(policy, 'metadata.name', 'unknown'))
      const annotations = _.get(policy, 'metadata.annotations') || {}
      addTypes(annotations['policy.mcm.ibm.com/standards'], standardsSet)
      addTypes(annotations['policy.mcm.ibm.com/categories'], categorySet)
      addTypes(annotations['policy.mcm.ibm.com/controls'], controlSet)
    })
    return {
      summary: [
        {count: standardsSet.size, summaryType: msgs.get('overview.policy.summary.standards', locale)},
        {count: categorySet.size, summaryType: msgs.get('overview.policy.summary.categories', locale)},
        {count: policySet.size, summaryType: msgs.get('overview.policy.summary.policies', locale)},
        {count: controlSet.size, summaryType: msgs.get('overview.policy.summary.controls', locale)},
      ],
    }
  }
}

PolicySummaryModule.propTypes = {
  policies: PropTypes.array,
}
