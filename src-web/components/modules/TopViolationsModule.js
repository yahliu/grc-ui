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
import { Button, DropdownV2 } from 'carbon-components-react'
import classNames from 'classnames'
import resources from '../../../lib/shared/resources'
import config from '../../../lib/shared/config'
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
    const {viewState: {topViolationChoice=TopViolationSelections.clusters}} = props
    this.state = {
      showAll: false,
      topViolationChoice
    }
    this.onChange = this.onChange.bind(this)
  }

  render() {
    const { showAll } = this.state
    let cardData = this.getCardData()
    if (cardData.length>0) {
      const xcess = cardData.length>MORE_THRESHHOLD
      if (xcess && !showAll) {
        cardData = cardData.slice(0,MORE_THRESHHOLD)
      }
      return (
        <div className='module-top-violations'>
          {this.renderHeader(true)}
          {this.renderCards(cardData)}
          {xcess && this.renderButton()}
        </div>
      )
    } else {
      return (
        <div className='module-top-violations'>
          {this.renderHeader()}
          {this.renderNoViolations()}
        </div>
      )
    }
  }

  renderNoViolations() {
    const { locale } = this.context
    const title = msgs.get('overview.no.violations.title', locale)
    const detail = msgs.get('overview.no.violations.description', locale)
    return (
      <div className='no-violations'>
        <img className='no-violations-icon' src={`${config.contextPath}/common/graphics/no-violation.svg`} alt={title} />
        <div className='no-violations-title'>{title}</div>
        <div className='no-violations-detail'>{detail}</div>
      </div>
    )
  }

  renderHeader(hasChoice) {
    const { locale } = this.context
    const { topViolationChoice } = this.state
    const choices = this.getTopViolationChoices(locale)
    const title = msgs.get('overview.top.violations.title', locale)
    const idx = Math.max(0, choices.findIndex(({value})=>{
      return topViolationChoice===value
    }))
    const classes = classNames({
      'header-title': true,
      hasChoice,
    })
    return (
      <div className='header-container'>
        <div className={classes}>{title}</div>
        {hasChoice && <DropdownV2 className='selection'
          label={title}
          ariaLabel={title}
          onChange={this.onChange}
          inline={true}
          initialSelectedItem={choices[idx].label}
          items={choices} />}
      </div>
    )
  }

  renderCards(cardData) {
    const { handleDrillDownClick } = this.props

    return <TopViolations key={cardData.name} cardData={cardData} handleClick={handleDrillDownClick} />
  }

  renderButton() {
    const { showAll } = this.state
    const label = msgs.get(showAll ? 'button.show.less' : 'button.show.all', this.context.locale)
    return (
      <div className='button-container'>
        <Button small kind='secondary' id={label} onClick={this.handleToggleAll}>
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
    const { policies, activeFilters } = this.props
    const { topViolationChoice } = this.state
    const dataMap = {}
    policies.map(policy=>{
      const statuses = _.get(policy, 'raw.status.status', {})
      Object.keys(statuses).forEach(key=>{
        const compliant = statuses[key].compliant
        if (!compliant || compliant.toLowerCase()==='noncompliant') {
          let name, violationType, description, choice, type
          switch (topViolationChoice) {
          case TopViolationSelections.policies:
            name = _.get(policy, 'metadata.name', 'unknown')
            description = key
            violationType = msgs.get('overview.top.violations.cluster', locale)
            choice = msgs.get('overview.top.violations.policies').toLowerCase()
            type = msgs.get('overview.top.violations.cluster').toLowerCase()
            break
          case TopViolationSelections.clusters:
            name = key
            description = _.get(policy, 'metadata.name', 'unknown')
            violationType = msgs.get('overview.top.violations.policy', locale)
            choice = msgs.get('overview.top.violations.clusters').toLowerCase()
            type = msgs.get('overview.top.violations.policy').toLowerCase()
            break
          }
          const filtered = activeFilters[key] &&  activeFilters[key].size>0 && !activeFilters[key].has(name)
          if (!filtered) {
            let data = dataMap[name]
            if (!data) {
              violationType = msgs.get('overview.top.violations', [violationType], locale)
              dataMap[name] = data = {
                name,
                description: [],
                count: 0,
                violationType,
                choice,
                type
              }
            }
            data.description.push(description)
            data.count++
          }
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
          label: msgs.get('overview.top.violations.clusters', locale),
        },
        {
          value: TopViolationSelections.policies,
          label: msgs.get('overview.top.violations.policies', locale),
        },
      ]
    }
    return this.topViolationChoices
  }

  onChange = (e) => {
    const {selectedItem: {value}} = e
    this.props.updateViewState({topViolationChoice: value})
    this.setState(()=>{
      return {topViolationChoice: value}
    })
  }
}

const TopViolations = ({cardData, handleClick}) => {
  return (
    <div key={name}>
      <div className='card-container-container' >
        {cardData.map(({name, description, count, violationType, choice, type}) => {
          const violated = count > 0
          const onClick = () =>{
            if (violated) {
              handleClick(choice, name, type)
            }
          }
          const onKeyPress = (e) =>{
            if ( e.key === 'Enter') {
              onClick()
            }
          }
          return (
            <div key={Math.random()}>
              <div className='card-container'>
                <div className='card-content'>
                  <div className='card-inner-content'>
                    <div className='card-violations' role={'button'}
                      tabIndex='0' onClick={onClick} onKeyPress={onKeyPress}>
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
    </div>
  )
}

TopViolations.propTypes = {
  cardData: PropTypes.array,
  handleClick: PropTypes.func
}

TopViolationsModule.propTypes = {
  activeFilters: PropTypes.object,
  handleDrillDownClick: PropTypes.func,
  policies: PropTypes.array,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}
