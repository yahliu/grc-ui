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
import config from '../../../lib/shared/config'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { Tabs, Tab } from 'carbon-components-react'

resources(() => {
  require('../../../scss/module-top-violations.scss')
})

const EMPTY_CHOICE = 'EMPTY_CHOICE'
const VIOLATION_THRESHHOLD = 4

const TopViolationSelections = Object.freeze({
  clusters: 'clusters',
  policies: 'policies',
  findings: 'findings',
})

export default class TopViolationsModule extends React.Component {

  constructor (props) {
    super(props)
    const {viewState: {topViolationChoice=TopViolationSelections.clusters,topFindingChoice=TopViolationSelections.findings}} = props
    this.state = {
      topViolationChoice,
      topFindingChoice
    }
    this.onChange = this.onChange.bind(this)
  }

  render() {
    let cardData = this.getCardData()
    if (cardData.length>0) {
      if (cardData.length>VIOLATION_THRESHHOLD) {
        cardData = cardData.slice(0,VIOLATION_THRESHHOLD)
      }
      return (
        <div className='module-top-violations'>
          {this.renderHeader()}
          {this.renderCards(cardData)}
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
    const { type } = this.props
    const title = msgs.get(`overview.no.violations.title.${type}`, locale)
    const detail = msgs.get(`overview.no.violations.description.${type}`, locale)
    return (
      <div className='no-violations'>
        <img className='no-violations-icon'
          src={`${config.contextPath}/policies/graphics/no-violations.svg`} alt={title} />
        <div className='no-violations-title'>{title}</div>
        <div className='no-violations-detail'>{detail}</div>
      </div>
    )
  }

  renderHeader() {
    const { locale } = this.context
    const { type } = this.props
    let choice = 'policies'
    let choices = []
    switch(type) {
    case 'policies':
      choice = this.state.topViolationChoice
      choices = this.getTopViolationChoices(locale)
      break
    case 'findings':
      choice = this.state.topFindingChoice
      choices = this.getTopFindingChoices(locale)
      break
    }
    const title = msgs.get(`overview.top.violations.title.${type}`, locale)
    const idx = Math.max(0, choices.findIndex(({value})=>{
      return choice===value
    }))
    return (
      <div className='header-container'>
        <div className={'header-title'}>{title}</div>
        <div className={'header-tab'}>
          <Tabs selected={idx} onSelectionChange={this.onChange} aria-label={`${title} ${msgs.get('tabs.label', locale)}`}>
            <Tab label={msgs.get(`overview.top.violations.${type}`, locale)} />
            <Tab label={msgs.get('overview.top.violations.clusters', locale)} />
          </Tabs>
        </div>

      </div>
    )
  }

  renderCards(cardData) {
    const { locale } = this.state
    const { handleDrillDownClick } = this.props
    return <TopViolations key={cardData.name} cardData={cardData} handleClick={handleDrillDownClick} locale={locale} />
  }

  getCardData = () => {
    const { items, type } = this.props
    const { topViolationChoice, topFindingChoice } = this.state
    const dataMap = {}
    switch (type) {
    case 'policies':
      items.map(item=>{
        const statuses = _.get(item, 'raw.status.status', {})
        Object.keys(statuses).forEach(key=>{
          const compliant = statuses[key].compliant
          if (!compliant || compliant.toLowerCase()==='noncompliant') {
            let name, description, choice, /*type,*/ nameSpace, itemName
            switch (topViolationChoice) {
            case TopViolationSelections.policies:
              name = _.get(item, 'metadata.name', 'unknown')
              description = key
              choice = msgs.get('overview.top.violations.policies').toLowerCase()
              // type = msgs.get('overview.top.violations.cluster').toLowerCase()
              nameSpace = _.get(item, 'metadata.namespace', 'unknown')
              itemName= _.get(item, 'raw.spec.runtime-rules[0].metadata.name', name)
              break
            case TopViolationSelections.clusters:
              name = key
              description = _.get(item, 'metadata.name', 'unknown')
              choice = msgs.get('overview.top.violations.clusters').toLowerCase()
              // type = msgs.get('overview.top.violations.item').toLowerCase()
              nameSpace = _.get(item, 'metadata.namespace', 'unknown')
              itemName= _.get(item, 'raw.spec.runtime-rules[0].metadata.name', name)
              break
            }
            let data = dataMap[name]
            if (!data) {
              dataMap[name] = data = {
                name,
                description: [],
                count: 0,
                choice,
                // type,
                nameSpace,
                itemName
              }
            }
            data.description.push(description)
            data.count++
          }
        })
      })
      break
    case 'findings':
      items.map(item=>{
        let name, description, choice, /*type,*/ nameSpace, itemName
        switch (topFindingChoice) {
        case TopViolationSelections.findings:
          name = _.get(item, 'shortDescription', 'unknown')
          description = _.get(item, 'context.clusterName', 'unknown')
          choice = msgs.get('overview.top.violations.findings').toLowerCase()
          // type = msgs.get('overview.top.violations.cluster').toLowerCase()
          nameSpace = _.get(item, 'context.namespaceName', 'unknown')
          // itemName= _.get(item, 'raw.spec.runtime-rules[0].metadata.name', name)
          break
        case TopViolationSelections.clusters:
          name = _.get(item, 'context.clusterName', 'unknown')
          description = _.get(item, 'shortDescription', 'unknown')
          choice = msgs.get('overview.top.violations.clusters').toLowerCase()
          // type = msgs.get('overview.top.violations.cluster').toLowerCase()
          nameSpace = _.get(item, 'context.namespaceName', 'unknown')
          // itemName= _.get(item, 'raw.spec.runtime-rules[0].metadata.name', name)
          break
        }
        let data = dataMap[name]
        if (!data) {
          dataMap[name] = data = {
            name,
            description: [],
            count: 0,
            choice,
            // type,
            nameSpace,
            itemName
          }
        }
        data.description.push(description)
        data.count++
      })
      break
    }
    const cards = Object.keys(dataMap).map(key=>{
      return {...dataMap[key]}
    }).sort(({count:a},{count:b})=>{
      return b-a
    })

    // if less violations then threshold, add an empty card
    if (cards.length<VIOLATION_THRESHHOLD) {
      cards.push({
        name: type==='policies'?
          msgs.get('overview.top.violations.policies.empty') :
          msgs.get('overview.top.violations.findings.empty'),
        choice: EMPTY_CHOICE,
        description: [type==='policies'?
          msgs.get('overview.top.violations.policies.empty.desc') :
          msgs.get('overview.top.violations.findings.empty.desc')],
      })
    }
    return cards
  }

  getTopViolationChoices = (locale) => {
    if (!this.topViolationChoices) {
      this.topViolationChoices = [
        {
          value: TopViolationSelections.policies,
          label: msgs.get('overview.top.violations.policies', locale),
        },
        {
          value: TopViolationSelections.clusters,
          label: msgs.get('overview.top.violations.clusters', locale),
        },
        {
          value: TopViolationSelections.findings,
          label: msgs.get('overview.top.violations.findings', locale),
        },
      ]
    }
    return this.topViolationChoices
  }

  getTopFindingChoices = (locale) => {
    if (!this.topFindingChoices) {
      this.topFindingChoices = [
        {
          value: TopViolationSelections.findings,
          label: msgs.get('overview.top.violations.findings', locale),
        },
        {
          value: TopViolationSelections.clusters,
          label: msgs.get('overview.top.violations.clusters', locale),
        }
      ]
    }
    return this.topFindingChoices
  }

  onChange = (index) => {
    const { type } = this.props
    let value = ''
    switch(type) {
    case 'policies':
      switch(index) {
      case 0:
        value = 'policies'
        break
      case 1:
        value = 'clusters'
      }
      this.props.updateViewState({topViolationChoice: value})
      this.setState(()=>{
        return {topViolationChoice: value}
      })
      break
    case 'findings':
      switch(index) {
      case 0:
        value = 'findings'
        break
      case 1:
        value = 'clusters'
      }
      this.props.updateViewState({topFindingChoice: value})
      this.setState(()=>{
        return {topFindingChoice: value}
      })
      break
    }
  }
}

const TopViolations = ({cardData, handleClick, locale}) => {
  return (
    <div key={name}>
      <div className='violation-card-container' >
        {cardData.map(({name, description, count, choice, type, itemName}) => {
          const violated = count > 0
          const onClick = () =>{
            if (violated) {
              handleClick(choice, name, type, description.toString())
            }
          }
          const onKeyPress = (e) =>{
            if ( e.key === 'Enter') {
              onClick()
            }
          }
          const cardNameConditionalLink = choice.toLowerCase()===msgs.get('overview.top.violations.clusters').toLowerCase() ? name : <Link to={`${config.contextPath}/policies/all/${encodeURIComponent(name)}`} className='card-name-link' key={name}>{name}</Link>
          const renderCount = () => {
            if (choice !== EMPTY_CHOICE) {
              return (
                <React.Fragment>
                  <div className='card-violations' role={'button'}
                    tabIndex='0' onClick={onClick} onKeyPress={onKeyPress}>
                    <div className={classes}>
                      {count}
                    </div>
                  </div>
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment>
                  <div className='card-violations'>
                    <img
                      src={`${config.contextPath}/policies/graphics/no-other-violations.svg`}
                      alt={msgs.get('svg.description.noresource', locale)} />
                  </div>
                </React.Fragment>
              )
            }
          }

          const classes = classNames({
            'card-violation-count': true,
            //'alert': count>0,
          })
          return (
            <div key={Math.random()}>
              <div className='violation-card-container'>
                <div className='violation-card-content'>
                  <div className='card-inner-content'>
                    {renderCount()}
                    <div className='card-name-description'>
                      <div className='card-name'>
                        {cardNameConditionalLink}
                      </div>
                      <div className='card-description'>
                        {description.map((description) => {
                          const cardEachDesConditionalLink = choice.toLowerCase()===msgs.get('overview.top.violations.clusters').toLowerCase() ? <Link to={`${config.contextPath}/policies/policy/${ encodeURIComponent(itemName)}/${encodeURIComponent(description)}`} className='card-each-description-link' key={description}>{description}</Link> : <Link to={`${config.contextPath}/policies/policy/${ encodeURIComponent(description)}/${encodeURIComponent(itemName)}`} className='card-each-description-link' key={description}>{description}</Link>
                          return (
                            cardEachDesConditionalLink
                          )
                        }
                        ).reduce((prev, curr) => [prev, ', ', curr])}
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
  handleClick: PropTypes.func,
  locale: PropTypes.string,
}

TopViolationsModule.propTypes = {
  handleDrillDownClick: PropTypes.func,
  items: PropTypes.array,
  type: PropTypes.string,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}
