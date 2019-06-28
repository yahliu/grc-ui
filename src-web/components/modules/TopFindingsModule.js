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
import classNames from 'classnames'
import config from '../../../lib/shared/config'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
import { Link } from 'react-router-dom'

resources(() => {
  require('../../../scss/module-top-findings.scss')
})

const FINDINGS_THRESHHOLD = 3

export default class TopFindingsModule extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let cardData = this.getCardData()
    if (cardData.length>0) {
      if (cardData.length>FINDINGS_THRESHHOLD) {
        cardData = cardData.slice(0,FINDINGS_THRESHHOLD)
      }
      return (
        <div className='module-top-findings'>
          {this.renderHeader(true)}
          {this.renderCards(cardData)}
        </div>
      )
    } else {
      return (
        <div className='module-top-findings'>
          {this.renderHeader()}
          {this.renderNoFindings()}
        </div>
      )
    }
  }

  renderNoFindings() {
    const { locale } = this.context
    const title = msgs.get('overview.no.findings.title', locale)
    const detail = msgs.get('overview.no.findings.description', locale)
    return (
      <div className='no-findings'>
        <img className='no-findings-icon' src={`${config.contextPath}/common/graphics/no-violation.svg`} alt={title} />
        <div className='no-findings-title'>{title}</div>
        <div className='no-findings-detail'>{detail}</div>
      </div>
    )
  }

  renderHeader() {
    const { locale } = this.context
    const title = msgs.get('overview.top.findings.title', locale)
    return (
      <div className='header-container'>
        <div className='header-title'>{title}</div>
      </div>
    )
  }

  renderCards(cardData) {
    const { handleDrillDownClick } = this.props
    return <TopFindings key={cardData.name} cardData={cardData} handleClick={handleDrillDownClick} />
  }

  getCardData = () => {
    const { locale } = this.context
    const { policies } = this.props
    const { topViolationChoice } = this.state
    const dataMap = {}
    policies.map(policy=>{
      const statuses = _.get(policy, 'raw.status.status', {})
      Object.keys(statuses).forEach(key=>{
        const compliant = statuses[key].compliant
        if (!compliant || compliant.toLowerCase()==='noncompliant') {
          let name, violationType, description, choice, type, nameSpace, policyName
          switch (topViolationChoice) {
          case 0:
          default:
            name = _.get(policy, 'metadata.name', 'unknown')
            description = key
            violationType = msgs.get('overview.top.violations.cluster', locale)
            choice = msgs.get('overview.top.violations.policies').toLowerCase()
            type = msgs.get('overview.top.violations.cluster').toLowerCase()
            nameSpace = _.get(policy, 'metadata.namespace', 'unknown')
            policyName= _.get(policy, 'raw.spec.runtime-rules[0].metadata.name', name)
            break
          }
          let data = dataMap[name]
          if (!data) {
            violationType = msgs.get('overview.top.violations', [violationType], locale)
            dataMap[name] = data = {
              name,
              description: [],
              count: 0,
              violationType,
              choice,
              type,
              nameSpace,
              policyName
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
}

const TopFindings = ({cardData, handleClick}) => {
  return (
    <div key={name}>
      <div className='card-container-container' >
        {cardData.map(({name, description, count, violationType, choice, type, nameSpace, policyName}) => {
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
          const cardNameConditionalLink = choice.toLowerCase()===msgs.get('overview.top.violations.clusters').toLowerCase() ? name : <Link to={`${config.contextPath}/policies/all/${encodeURIComponent(nameSpace) }/${encodeURIComponent(name)}`} className='card-name-link' key={name}>{name}</Link>
          const classes = classNames({
            'card-violation-count': true,
            'alert': count>0,
          })
          return (
            <div key={Math.random()}>
              <div className='card-container'>
                <div className='card-content'>
                  <div className='card-inner-content'>
                    <div className='card-violations' role={'button'}
                      tabIndex='0' onClick={onClick} onKeyPress={onKeyPress}>
                      <div className={classes}>
                        {count}
                      </div>
                      <div className='card-violation-type'>
                        {violationType.toUpperCase()}
                      </div>
                    </div>
                    <div className='card-name-description'>
                      <div className='card-name'>
                        {cardNameConditionalLink}
                      </div>
                      <div className='card-description'>
                        {description.map((description) => {
                          const cardEachDesConditionalLink = choice.toLowerCase()===msgs.get('overview.top.violations.clusters').toLowerCase() ? <Link to={`${config.contextPath}/policies/all/${encodeURIComponent(nameSpace)}/${encodeURIComponent(description)}/compliancePolicy/${ encodeURIComponent(description)}/${encodeURIComponent(policyName)}`} className='card-each-description-link' key={description}>{description}</Link> : <Link to={`${config.contextPath}/policies/all/${encodeURIComponent(nameSpace)}/${encodeURIComponent(name)}/compliancePolicy/${ encodeURIComponent(policyName)}/${encodeURIComponent(description)}`} className='card-each-description-link' key={description}>{description}</Link>
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

TopFindings.propTypes = {
  cardData: PropTypes.array,
  handleClick: PropTypes.func,
  nameSpace: PropTypes.string
}

TopFindingsModule.propTypes = {
  handleDrillDownClick: PropTypes.func,
  policies: PropTypes.array,
}
