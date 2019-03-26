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
import { Button, Select, SelectItem } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/module-top-violations.scss')
})

const MORE_THRESHHOLD = 6

const TopViolationSelections = Object.freeze({
  clusters: 'clusters',
  policies: 'policies',
})

export default class TopViolationsModule extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      showAll: false,
      topViolationChoice: TopViolationSelections.clusters,
    }
    this.onChange = this.onChange.bind(this)
  }

  render() {
    const { showAll } = this.state
    let cardData = this.getCardData()
    const xcess = cardData.length>MORE_THRESHHOLD
    if (xcess && !showAll) {
      cardData = cardData.slice(0,MORE_THRESHHOLD)
    }
    return (
      <div className='module-top-violations'>
        {this.renderHeader()}
        {this.renderCards(cardData)}
        {this.renderButton(xcess)}
      </div>
    )
  }

  renderHeader() {
    const { locale } = this.context
    const { topViolationChoice } = this.state
    const choices = this.getTopViolationChoices(locale)
    const title = msgs.get('overview.top.violations.title', locale)
    return (
      <div className='header-container'>
        <div className='header-title'>{title}</div>
        <Select id={'select-top-viloation-type'} className='header-selection'
          hideLabel={true}
          value={topViolationChoice}
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
    return (
      <div className='card-container-container' >
        {cardData.map(({name, description, count, violationType}) => {
          return (
            <div key={Math.random()}>
              <div className='card-container'>
                <div className='card-content'>
                  <div className='card-inner-content'>
                    <div className='card-violations'>
                      <div className='card-violation-count'>
                        {count}
                      </div>
                      <div className='card-violation-type'>
                        {violationType}
                      </div>
                    </div>
                    <div className='card-name-description'>
                      <div className='card-name'>
                        {name}
                      </div>
                      <div className='card-description'>
                        {description.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  renderButton(xcess) {
    const { showAll } = this.state
    const label = msgs.get(showAll ? 'button.show.less' : 'button.show.all', this.context.locale)
    return (
      <div className='button-container'>
        <Button small kind='secondary' disabled={!xcess} id={label} onClick={this.handleToggleAll}>
          { label }
        </Button>
      </div>
    )
  }

  handleToggleAll = () => {
    this.setState(prevState=>{
      return {showAll: !prevState.showAll}
    })
  }

  getCardData = () => {
    const { locale } = this.context
    const { policies } = this.props
    const { topViolationChoice } = this.state
    const dataMap = {}
    policies.map(policy=>{
      const statuses = _.get(policy, 'status.status', {})
      Object.keys(statuses).forEach(key=>{
        const status = statuses[key]
        if (status!=='Compliant') {
          let name, violationType, description
          switch (topViolationChoice) {
          case TopViolationSelections.policies:
            name = _.get(policy, 'metadata.name', 'unknown')
            description = key
            violationType = msgs.get('overview.top.violations.cluster', locale)
            break
          case TopViolationSelections.clusters:
            name = key
            description = _.get(policy, 'metadata.name', 'unknown')
            violationType = msgs.get('overview.top.violations.policy', locale)
            break
          }
          let data = dataMap[name]
          if (!data) {
            violationType = msgs.get('overview.top.violations', [violationType], locale)
            dataMap[name] = data = {
              name,
              description: [],
              count: 0,
              violationType
            }
          }
          data.description.push(description)
          data.count++
        }
      })
    })
    return Object.keys(dataMap).map(key=>{
      return {...dataMap[key]}
    }).sort(({count:a},{count:b})=>{
      return b-a
    })
  }

  getTopViolationChoices = (locale) => {
    if (!this.topViolationChoices) {
      this.topViolationChoices = [
        {
          value: TopViolationSelections.clusters,
          text: msgs.get('overview.top.violations.clusters', locale),
        },
        {
          value: TopViolationSelections.policies,
          text: msgs.get('overview.top.violations.policies', locale),
        },
      ]
    }
    return this.topViolationChoices
  }

  onChange = (e) => {
    const {value} = this.topViolationChoices[e.currentTarget.selectedIndex]
    this.setState(()=>{
      return {topViolationChoice: value}
    })
  }
}

TopViolationsModule.propTypes = {
  policies: PropTypes.array,
}
