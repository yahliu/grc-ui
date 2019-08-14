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
import { Tabs, Tab } from 'carbon-components-react'

resources(() => {
  require('../../../scss/module-top-information.scss')
})

const EMPTY_CHOICE = 'EMPTY_CHOICE'
const INFORMATION_THRESHHOLD = 4

const TopInformationSelections = Object.freeze({
  clusters: 'clusters',
  policies: 'policies',
  findings: 'findings',
})

export default class TopInformationModule extends React.Component {

  constructor (props) {
    super(props)
    const {viewState: {topViolationChoice=TopInformationSelections.clusters,topFindingChoice=TopInformationSelections.findings}} = props
    this.state = {
      topViolationChoice,
      topFindingChoice
    }
    this.onChange = this.onChange.bind(this)
  }

  render() {
    let cardData = this.getCardData()
    if (cardData.length>0) {
      if (cardData.length>INFORMATION_THRESHHOLD) {
        cardData = cardData.slice(0,INFORMATION_THRESHHOLD)
      }
      return (
        <div className='module-top-information'>
          {this.renderHeader()}
          {this.renderCards(cardData)}
        </div>
      )
    } else {
      return (
        <div className='module-top-information'>
          {this.renderHeader()}
          {this.renderNoInformations()}
        </div>
      )
    }
  }

  renderNoInformations() {
    const { locale } = this.context
    const { type } = this.props
    const title = msgs.get(`overview.no.informations.title.${type}`, locale)
    const detail = msgs.get(`overview.no.informations.description.${type}`, locale)
    return (
      <div className='no-informations'>
        <img className='no-informations-icon'
          src={`${config.contextPath}/policies/graphics/no-violations.svg`} alt={title} />
        <div className='no-informations-title'>{title}</div>
        <div className='no-informations-detail'>{detail}</div>
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
    const title = msgs.get(`overview.top.informations.title.${type}`, locale)
    const idx = Math.max(0, choices.findIndex(({value})=>{
      return choice===value
    }))
    return (
      <div className='header-container'>
        <div className={'header-title'}>{title}</div>
        <div className={'header-tab'}>
          <Tabs selected={idx} onSelectionChange={this.onChange} aria-label={`${title} ${msgs.get('tabs.label', locale)}`}>
            <Tab label={msgs.get(`overview.top.informations.${type}`, locale)} />
            <Tab label={msgs.get('overview.top.informations.clusters', locale)} />
          </Tabs>
        </div>

      </div>
    )
  }

  renderCards(cardData) {
    const { locale } = this.state
    const { handleDrillDownClick } = this.props
    return <TopInformations key={cardData.name} cardData={cardData} handleClick={handleDrillDownClick} locale={locale} />
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
            let name, description, choice, nameSpace, itemName
            switch (topViolationChoice) {
            case TopInformationSelections.policies:
              name = _.get(item, 'metadata.name', 'unknown')
              description = key
              choice = msgs.get('overview.top.informations.policies').toLowerCase()
              nameSpace = _.get(item, 'metadata.namespace', 'unknown')
              itemName= _.get(item, 'raw.spec.runtime-rules[0].metadata.name', name)
              break
            case TopInformationSelections.clusters:
              name = key
              description = _.get(item, 'metadata.name', 'unknown')
              choice = msgs.get('overview.top.informations.clusters').toLowerCase()
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
        let name, description, choice, nameSpace, itemName
        switch (topFindingChoice) {
        case TopInformationSelections.findings:
          name = _.get(item, 'shortDescription', 'unknown')
          description = _.get(item, 'context.clusterName', 'unknown')
          choice = msgs.get('overview.top.informations.findings').toLowerCase()
          nameSpace = _.get(item, 'context.namespaceName', 'unknown')
          break
        case TopInformationSelections.clusters:
          name = _.get(item, 'context.clusterName', 'unknown')
          description = _.get(item, 'shortDescription', 'unknown')
          choice = msgs.get('overview.top.informations.finding.clusters').toLowerCase()
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

    // if less informations than threshold, add an empty card
    if (cards.length<INFORMATION_THRESHHOLD) {
      cards.push({
        name: type==='policies'?
          msgs.get('overview.top.informations.policies.empty') :
          msgs.get('overview.top.informations.findings.empty'),
        choice: EMPTY_CHOICE,
        description: [type==='policies'?
          msgs.get('overview.top.informations.policies.empty.desc') :
          msgs.get('overview.top.informations.findings.empty.desc')],
      })
    }
    return cards
  }

  getTopViolationChoices = (locale) => {
    if (!this.topViolationChoices) {
      this.topViolationChoices = [
        {
          value: TopInformationSelections.policies,
          label: msgs.get('overview.top.informations.policies', locale),
        },
        {
          value: TopInformationSelections.clusters,
          label: msgs.get('overview.top.informations.clusters', locale),
        },
      ]
    }
    return this.topViolationChoices
  }

  getTopFindingChoices = (locale) => {
    if (!this.topFindingChoices) {
      this.topFindingChoices = [
        {
          value: TopInformationSelections.findings,
          label: msgs.get('overview.top.informations.findings', locale),
        },
        {
          value: TopInformationSelections.clusters,
          label: msgs.get('overview.top.informations.clusters', locale),
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

const TopInformations = ({cardData, handleClick, locale}) => {
  return (
    <div key={name}>
      <div className='information-card-container' >
        {cardData.map(({name, description, count, choice, type}) => {
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

          const renderCount = () => {
            if (choice !== EMPTY_CHOICE) {
              return (
                <React.Fragment>
                  <div className='card-informations'>
                    <div className={classes}>
                      {count}
                    </div>
                  </div>
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment>
                  <div className='card-informations empty'>
                    <img
                      src={`${config.contextPath}/policies/graphics/no-other-violations.svg`}
                      alt={msgs.get('svg.description.noresource', locale)} />
                  </div>
                </React.Fragment>
              )
            }
          }

          const renderName = () => {
            return (
              <React.Fragment>
                {name}
              </React.Fragment>
            )
          }

          const renderDescription  = () => {
            if (choice !== EMPTY_CHOICE) {
              return (
                <React.Fragment>
                  {description.map((singleDescription) => {
                    return singleDescription
                  }).reduce((prev, curr) => [prev, ', ', curr])}
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment>
                  {description[0]}
                </React.Fragment>
              )
            }
          }

          const renderWholeStrip = () => {
            return (
              <div className='information-card-content'>
                <div className='card-inner-content'>
                  {renderCount()}
                  <div className='card-name-description'>
                    <div className={choice !== EMPTY_CHOICE ? 'card-name name-clickable' : 'card-name name-empty'}>
                      {renderName()}
                    </div>
                    <div className={choice !== EMPTY_CHOICE ? 'card-description description-clickable' : 'card-description description-empty'}>
                      {renderDescription()}
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          const classes = classNames({
            'card-information-count': true,
            //'alert': count>0,
          })
          return (
            <div key={name}>
              <React.Fragment>
                {choice !== EMPTY_CHOICE ?
                  <div className='information-card-container single-strip' role={'button'} onClick={onClick} onKeyPress={onKeyPress} tabIndex='0'>
                    {renderWholeStrip()}
                  </div>
                  :
                  <div className='information-card-container single-strip empty-strip'>
                    {renderWholeStrip()}
                  </div>}
              </React.Fragment>
            </div>
          )
        })}
      </div>
    </div>
  )
}

TopInformations.propTypes = {
  cardData: PropTypes.array,
  handleClick: PropTypes.func,
  locale: PropTypes.string,
}

TopInformationModule.propTypes = {
  handleDrillDownClick: PropTypes.func,
  items: PropTypes.array,
  type: PropTypes.string,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}
