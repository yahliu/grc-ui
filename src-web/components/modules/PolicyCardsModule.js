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
    this.state = {
      policyCardChoice: PolicyCardsSelections.categories,
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
    const { policies } = this.props
    const { policyCardChoice } = this.state
    const dataMap = {}
    const other = msgs.get('overview.policy.overview.other', locale)

    // loop thru policies
    policies.map(policy => {
      // get a policy's standards/categories
      let types
      const annotations = _.get(policy, 'metadata.annotations') || {}
      switch (policyCardChoice) {
      case PolicyCardsSelections.categories:
        types = annotations['policy.mcm.ibm.com/categories'] || ''
        break
      case PolicyCardsSelections.standards:
        types = annotations['policy.mcm.ibm.com/standards'] || ''
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
          // if not already collecting data on this category (or standard)
          let data = dataMap[type]
          if (!data) {
            dataMap[type] = data = {
              name,
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

          // collect statuses
          let anyViolation = false
          const statuses = _.get(policy, 'raw.status.status', {})
          Object.keys(statuses).forEach(cluster=>{

            // this is a cluster with this category/standard
            data.counts.cluster.total++

            // this cluster with this category has a violation
            const status = statuses[cluster]
            if (status!=='Compliant') {
              data.counts.cluster.violations++
              anyViolation = true
            }
          })

          // this is a policy with this category/standard
          data.counts.policy.total++
          // this policy with this category has a violation
          if (anyViolation) {
            data.counts.policy.violations++
          }
        }
      })
    })
    return Object.keys(dataMap).map(key=>{
      return {...dataMap[key]}
    }).sort(({name:a},{name:b})=>{
      if (a===other && b!==other) {
        return 1
      } else  if (a!==other && b===other) {
        return -1
      }
      return a.localeCompare(b)
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
                'violated': violations>0,
              })
              return (
                //eslint-disable-next-line
                <div key={violationType} className='card-count-container' onClick={handleClick(name, type)}>
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
  handleDisplayChange: PropTypes.func,
  handleDrillDownClick: PropTypes.func,
  policies: PropTypes.array
}
