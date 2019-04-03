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
import { Select, SelectItem } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/module-policy-cards.scss')
})

const PolicyCardsSelections = Object.freeze({
  categories: 'categories',
  standards: 'standards',
})

export default class PolicyCardsModule extends React.Component {

  constructor (props) {
    super(props)
    const {viewState: {policyCardChoice=PolicyCardsSelections.categories}} = props
    this.state = {
      policyCardChoice
    }
    this.onChange = this.onChange.bind(this)
  }

  render() {
    const cardData = this.getCardData()
    return (
      <div className='module-policy-cards'>
        {this.renderHeader()}
        {this.renderCards(cardData)}
      </div>
    )
  }

  renderHeader() {
    const { locale } = this.context
    const { policyCardChoice } = this.state
    const choices = this.getPolicyCardChoices(locale)
    const title = msgs.get('overview.policy.overview.title', locale)
    return (
      <div className='header-container'>
        <div className='header-title'>{title}</div>
        <Select id={'select-policy-card-type'} className='header-selection'
          hideLabel={true}
          value={policyCardChoice}
          onChange={this.onChange}>
          {choices.map(({text, value})=> {
            return (
              <SelectItem key={value} text={text} value={value} />
            )
          })}
        </Select>
      </div>
    )
  }

  renderCards(cardData) {
    const { locale } = this.context
    const { handleDrillDownClick } = this.props
    return (
      <div className='card-container-container' >
        {cardData.map((data) => {
          return <PolicyCard key={data.name} data={data} locale={locale} handleClick={handleDrillDownClick} />
        })}
      </div>
    )
  }

  getCardData = () => {
    const { locale } = this.context
    const { policies, activeFilters } = this.props
    const { policyCardChoice } = this.state
    const other = msgs.get('overview.policy.overview.other', locale)

    // loop thru policies
    const dataMap = {}
    const policyMap = {}
    const clusterMap = {}
    policies.map(policy => {
      // get a policy's standards/categories
      let types, key
      const annotations = _.get(policy, 'metadata.annotations', {}) || {}
      switch (policyCardChoice) {
      case PolicyCardsSelections.categories:
        types = annotations['policy.mcm.ibm.com/categories'] || ''
        key = 'categories'
        break
      case PolicyCardsSelections.standards:
        types = annotations['policy.mcm.ibm.com/standards'] || ''
        key = 'standards'
        break
      }
      // backward compatible and if user doesn't supply an annotation
      if (types.length===0) {
        types=other
      }
      types.split(',').forEach(type=>{
        type = type.trim()
        if (type) {
          let name = type
          if (policyCardChoice===PolicyCardsSelections.categories) {
            name = _.capitalize(_.startCase(name))
          }
          const filtered = activeFilters[key] &&  activeFilters[key].size>0 && !activeFilters[key].has(name)
          if (!filtered) {
            let data = dataMap[type]
            if (!data) {
              data = dataMap[type]= {
                name,
                violations: 0,
                counts: {
                  cluster: {
                    violations:0,
                    total:0,
                  },
                  policy: {
                    violations:0,
                    total:0,
                  },
                }
              }
            }

            // if policy has violation
            policyMap[type] = policyMap[type] || {}
            clusterMap[type] = clusterMap[type] || {}
            const statuses = _.get(policy, 'raw.status.status', {})
            const policyName = _.get(policy, 'metadata.name')
            Object.keys(statuses).forEach(clusterName=>{
              const noncompliant = statuses[clusterName].compliant!=='Compliant'
              policyMap[type][policyName] = policyMap[type][policyName] || noncompliant
              clusterMap[type][clusterName] = clusterMap[type][clusterName] || noncompliant
            })
          }
        }
      })
    })

    // tabulate for category or standard
    // by policies
    Object.keys(policyMap).forEach(type=>{
      const data = dataMap[type]
      const policies = policyMap[type]
      Object.keys(policies).forEach(policy=>{

        // this is a policy with this category/standard
        data.counts.policy.total++

        // this policy with this category/standard has a violation
        if (policies[policy]) {
          data.counts.policy.violations++
          data.violations++
        }
      })
    })

    // by clusters
    Object.keys(clusterMap).forEach(type=>{
      const data = dataMap[type]
      const clusters = clusterMap[type]
      Object.keys(clusters).forEach(cluster=>{

        // this is a cluster with this category/standard
        data.counts.cluster.total++

        // this cluster with this category/standard has a violation
        if (clusters[cluster]) {
          data.counts.cluster.violations++
          data.violations++
        }
      })
    })

    // convert to array and sort
    return Object.keys(dataMap).map(key=>{
      return {...dataMap[key]}
    }).sort(({name:an, violations:av}, {name:bn, violations:bv})=>{
      const v = bv-av
      if (v===0) {
        if (an===other && bn!==other) {
          return 1
        } else  if (an!==other && bn===other) {
          return -1
        }
        return an.localeCompare(bn)
      }
      return v
    })
  }

  getPolicyCardChoices = (locale) => {
    if (!this.policyCardChoices) {
      this.policyCardChoices = [
        {
          value: PolicyCardsSelections.categories,
          text: msgs.get('overview.policy.cards.categories', locale),
        },
        {
          value: PolicyCardsSelections.standards,
          text: msgs.get('overview.policy.cards.standards', locale),
        },
      ]
    }
    return this.policyCardChoices
  }

  onChange = (e) => {
    const {value} = this.policyCardChoices[e.currentTarget.selectedIndex]
    this.props.handleDisplayChange(value)
    this.props.updateViewState({policyCardChoice: value})
    this.setState(()=>{
      return {policyCardChoice: value}
    })
  }
}




// functional card component
const PolicyCard = ({data, locale, handleClick}) => {
  const { counts, name } = data
  const countData = Object.keys(counts).map(type=>{
    return {
      ...counts[type],
      violationType: msgs.get(`overview.${type}.violations`, locale),
      type: type
    }
  })
  return (
    <div key={name}>
      <div className='card-container'>
        <div className='card-content'>
          <div className='card-name'>
            {name}
          </div>
          <div className='card-count-content'>
            {countData.map(({violations, total, violationType, type}) => {
              const classes = classNames({
                'card-count-violations': true,
                'violated': violations > 0,
              })
              return (
                //eslint-disable-next-line
                <div key={violationType} className={classes !== 'card-count-violations' ? 'card-count-container' : 'card-count-container violated'} onClick={handleClick(name, type, classes)}>
                  <div className='card-count'>
                    <div className={classes}>
                      {violations}
                    </div>
                    <div className='card-count-total'>
                      {`/${total}`}
                    </div>
                  </div>
                  <div className='card-violation-type'>
                    {violationType}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

PolicyCard.propTypes = {
  data: PropTypes.object,
  handleClick: PropTypes.func,
  locale: PropTypes.string
}


PolicyCardsModule.propTypes = {
  activeFilters: PropTypes.object,
  handleDisplayChange: PropTypes.func,
  handleDrillDownClick: PropTypes.func,
  policies: PropTypes.array,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}
