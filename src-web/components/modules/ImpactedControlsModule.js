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
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'
import { DropdownV2, Slider } from 'carbon-components-react'
import Radar from 'react-d3-radar'
import * as d3 from 'd3'
import 'd3-selection-multi'
import { SECURITY_TYPES } from '../../../lib/shared/constants'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/module-impacted-controls.scss')
})

const $grc_color_radar_blue = '#0082C1'
const $grc_color_radar_green = '#13B9B9'
const $grc_color_radar_ring = '#979797'

const tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .styles(()=>{
    return {
      'display': 'none',
      'opacity': 0
    }
  })

export default class ImpactedControlsModule extends React.Component {

  constructor (props) {
    super(props)
    const {viewState: {standardsChoice, showControls=6}} = props
    this.state = {
      standardsChoice,
      showControls,
    }
    this.onSelectionChange = this.onSelectionChange.bind(this)
    this.onSliderChange = this.onSliderChange.bind(this)
    this.fixRadar = this.fixRadar.bind(this)
    this.openTooltip = this.openTooltip.bind(this)
    this.closeTooltip = this.closeTooltip.bind(this)
  }

  render() {
    this.cardData = this.getCardData()
    return (
      <div className='module-impacted-controls'>
        <div className='card-container-container'>
          <div className='card-container'>
            <div className='card-content'>
              {this.renderControls(this.cardData)}
              {this.renderRadar(this.cardData)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderControls(cardData) {
    const { locale } = this.context
    const title = msgs.get('overview.impacted.controls.title', locale)
    return (
      <div className='card-controls'>
        <div className='card-title'>{title}</div>
        {this.renderLegend()}
        <div className='card-control-panel'>
          {this.renderSelection(title, cardData)}
          {this.renderSlider(cardData)}
        </div>
      </div>
    )
  }

  renderSelection(title, {selectionData}) {
    const { locale } = this.context
    const { standardsChoice } = this.state
    let idx = 0
    const choices = selectionData.sort().map((standard, ix)=>{
      if (standardsChoice===standard) {
        idx = ix
      }
      return {
        value: ix,
        label: standard,
      }
    })
    return (
      <div className='card-selection'>
        <div className='card-selection-title'>
          {msgs.get('overview.impacted.controls.standard', locale)}
        </div>
        <DropdownV2 className='selection'
          label={title}
          ariaLabel={title}
          onChange={this.onSelectionChange}
          inline={true}
          initialSelectedItem={choices[idx].label}
          items={choices} />
      </div>
    )
  }

  renderLegend() {
    const { locale } = this.context
    const legend = [
      {title: msgs.get('overview.impacted.controls.legend.policies', locale), className: 'policies'},
      {title: msgs.get('overview.impacted.controls.legend.findings', locale), className: 'findings'},
    ]
    return (
      <div className='card-legend'>
        {legend.map(({title, className}) => (
          <div key={title} className='legend-container' >
            <div className={`legend ${className}`} />
            {title}
          </div>
        ))}
      </div>
    )
  }

  renderSlider() {
    const { locale } = this.context
    const { showControls } = this.state
    const title = msgs.get('overview.impacted.controls.slider', locale)
    return (
      <div className='card-slider'>
        <Slider
          id='slider'
          name={title}
          ariaLabelInput={title}
          value={showControls}
          labelText={title}
          min={1}
          max={24}
          onChange={this.onSliderChange}
        />
      </div>
    )
  }

  renderRadar({radarData}) {
    const { showControls } = this.state
    if (radarData.variables.length>showControls) {
      radarData.variables = radarData.variables.slice(0, showControls)
    }
    return (
      <div className='card-radar-container' >
        <div className='card-radar' ref={this.fixRadar}>
          {radarData.variables.length>0 ? <Radar
            width={500}
            height={500}
            padding={70}
            domainMax={10}
            highlighted={null}
            style={{
              ringColor: $grc_color_radar_ring,
            }}
            axisLabelTextStyle={{
              fontSize: '14px',
              color: '#171717',
            }}
            onHover={(point) => {
              if (point) {
                this.openTooltip(point)
              } else {
                this.closeTooltip()
              }
            }
            }
            data={radarData}
          />
            :null}
        </div>
      </div>
    )
  }

  // modify behaviour of react-d3-radar
  // (without modifying the code)
  fixRadar = ref => {
    this.radarRef = ref
    if (this.radarRef) {

      // don't show fill in radar rings
      Array.from(this.radarRef.querySelectorAll('circle')).map(circle=>{
        if (circle.getAttribute('r') > 3) {
          circle.setAttribute('fill-opacity', '0')
        }
      })

      // close tooltip if exiting entire radar map
      this.radarRef.addEventListener('mouseout', e=>{
        if (e.target.tagName==='svg' ) {
          this.closeTooltip()
        }
      })
    }
  }

  componentDidUpdate() {
    this.dotMap=null
  }

  openTooltip = ({x, y, setKey, variableKey}) => {
    tooltip.style('display', undefined)
    tooltip.transition()
      .delay(200)
      .duration(100)
      .style('opacity', 1)
    tooltip.html(()=>{
      return this.getTooltipContent(setKey, variableKey)
    })
      .styles((d, j, ts)=>{
        const {width, height} = ts[j].getBoundingClientRect()
        const dot = this.getDotMap()[`${x}&${y}`].getBoundingClientRect()
        const top = dot.y + window.scrollY - height - 6
        const left = dot.x + window.scrollX - width/2 + 3
        return {
          'top': top + 'px',
          'left': left + 'px',
        }
      })
  }

  getDotMap() {
    if (!this.dotMap) {
      this.dotMap = {}
      if (this.radarRef) {
        Array.from(this.radarRef.querySelectorAll('circle')).map(circle=>{
          if (circle.getAttribute('r') === '3') {
            // radar onhover supplies cx,cy of dot
            // create map to get current client bounds to position tooltip
            this.dotMap[`${circle.getAttribute('cx')}&${circle.getAttribute('cy')}`] = circle
          }
        })
      }
    }
    return this.dotMap
  }

  closeTooltip = () => {
    tooltip.transition()
      .duration(100)
      .style('opacity', 0)
      .on('end', ()=>{
        tooltip.style('display', 'none')
      })
  }

  getTooltipContent = (setKey, variableKey) => {
    const { locale } = this.context
    const { setMap, variableMap, findings } = this.cardData
    return ReactDOMServer.renderToStaticMarkup(
      <div className='tooltip-text'>
        <div className='header'>
          <div className='title'>{setMap[setKey].label.toUpperCase()}</div>
          <div className='variable'>
            <div className={`legend ${setMap[setKey].className}`} />
            {variableMap[variableKey].label}
          </div>
        </div>
        <div className='findings'>
          {findings.map(({count, findingType}) => {
            let label, className
            switch (findingType) {
            case SECURITY_TYPES.HIGH:
              label = msgs.get('overview.recent.activity.finding.type.high', locale)
              className = 'high'
              break
            case SECURITY_TYPES.MEDIUM:
              label = msgs.get('overview.recent.activity.finding.type.medium', locale)
              className = 'medium'
              break
            case SECURITY_TYPES.LOW:
              label = msgs.get('overview.recent.activity.finding.type.low', locale)
              className = 'low'
              break
            }
            return (
              <div key={findingType} className={`finding ${className}`} >
                <div className='count'>{count}</div>
                <div className='severity'>{label}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  getCardData = () => {
    const { locale } = this.context
    const { policies } = this.props

    // loop thru policies
    const standardsSet = new Set()
    const other = msgs.get('overview.policy.overview.other', locale)
    policies.forEach(policy => {
      const annotations = _.get(policy, 'metadata.annotations', {}) || {}
      let types = annotations['policy.mcm.ibm.com/standards'] || ''
      // backward compatible and if user doesn't supply an annotation
      if (types.length===0) {
        types=other
      }
      types.split(',').forEach(type=>{
        type = type.trim()
        if (type) {
          standardsSet.add(type)
        }
      })
    })


    const radarData = {
      variables: [
        {key: 'expiration', label: 'Certificate expiration'},
        {key: 'isolation', label: 'Network isolation'},
        {key: 'provenance', label: 'Image provenance'},
        {key: 'configured', label: 'LDAP configured'},
        {key: 'SAML', label: 'SAML'},
        {key: 'vulnerability', label: 'Image vulnerability'},
        {key: 'dataintransit', label: 'Inter node data-in-transit'},
        {key: 'podsecurity', label: 'Pod security'},
      ],
      sets: [
        {
          key: 'policy',
          color: $grc_color_radar_green,
          className: 'policies',
          label: 'Policy violations',
          values: {
            expiration: 4,
            isolation: 6,
            provenance: 7,
            configured: 2,
            SAML: 8,
            vulnerability: 1,
            dataintransit: 6,
            podsecurity: 3,
          },
        },
        {
          key: 'findings',
          color: $grc_color_radar_blue,
          className: 'findings',
          label: 'Security findings',
          values: {
            expiration: 10,
            isolation: 8,
            provenance: 6,
            configured: 4,
            SAML: 2,
            vulnerability: 0,
            dataintransit: 3,
            podsecurity: 5,
          },
        },
      ],
    }
    const findings = [
      {count: 1, findingType: SECURITY_TYPES.HIGH},
      {count: 3, findingType: SECURITY_TYPES.MEDIUM},
      {count: 8, findingType: SECURITY_TYPES.LOW},
    ]


    return {
      selectionData: Array.from(standardsSet),
      radarData,
      findings,
      setMap: _.keyBy(radarData.sets, 'key'),
      variableMap: _.keyBy(radarData.variables, 'key'),
    }
  }

  onSelectionChange = (e) => {
    const {selectedItem: {label}} = e
    this.props.updateViewState({standardsChoice: label})
    this.setState(()=>{
      return {standardsChoice: label}
    })
  }

  onSliderChange = (e) => {
    const {value} = e
    this.props.updateViewState({showControls: value})
    this.setState(()=>{
      return {showControls: value}
    })
  }

}

ImpactedControlsModule.propTypes = {
  policies: PropTypes.array,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}
