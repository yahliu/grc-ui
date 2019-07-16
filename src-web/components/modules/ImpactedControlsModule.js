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
    const {viewState: {standardsChoice='ALL', showControls=6}} = props
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
    // const { showControls } = this.state
    return (
      <div className='card-controls'>
        <div className='card-title'>{title}</div>
        {this.renderLegend()}
        <div className='card-control-panel'>
          {this.renderSelection(title, cardData)}
          {this.renderSlider({max: cardData.radarData.variables.length})}
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

  renderSlider({max}) {
    const { locale } = this.context
    const title = msgs.get('overview.impacted.controls.slider', locale)
    return (
      <div className='card-slider' >
        <Slider
          id={'slider'}
          name={title}
          ariaLabelInput={title}
          value={max}
          labelText={title}
          min={1}
          max={max}
          onChange={this.onSliderChange}
          hideTextInput
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
    const { setMap, variableMap, tooltips } = this.cardData
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
          {_.get(tooltips, `${setKey}.${variableKey}`,[]).map(({count, findingType}) => {
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
            case SECURITY_TYPES.VIOLATIONS:
              label = msgs.get('overview.recent.activity.finding.type.violations', locale)
              className = 'high'
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
    const { policies, findings } = this.props
    const standardsChoice = this.state.standardsChoice

    // loop thru policies
    const violations = []
    policies.map(policy=>{
      const statuses = _.get(policy, 'raw.status.status', {})
      Object.keys(statuses).forEach(key=>{
        const compliant = statuses[key].compliant
        if (!compliant || compliant.toLowerCase()==='noncompliant') {
          violations.push({
            metadata: _.get(policy, 'raw.metadata', {}),
            cluster: key
          })
        }
      })
    })

    const standardsSet = new Set(['ALL'])
    violations.forEach(violation=>{
      const annotations = _.get(violation, 'metadata.annotations', {})
      const standards = _.get(annotations,'policy.mcm.ibm.com/standards', 'other')
      standards.split(',').forEach(standard=>{
        standard = standard.trim()
        if (standard) {
          standardsSet.add(_.startCase(standard))
        }
      })
    })
    findings.forEach(finding=>{
      const standards = _.get(finding, 'securityClassification.securityStandards', ['other'])
      standards.forEach(standard=>{
        standard = standard.trim()
        if (standard) {
          standardsSet.add(_.startCase(standard))
        }
      })
    })

    const violationsByControls = {}
    const policyTooltips = {}
    violations.forEach(policy=>{
      const annotations = _.get(policy, 'metadata.annotations', {})
      const controls = _.get(annotations, 'policy.mcm.ibm.com/controls', 'other')
      controls.split(',').forEach(ctrl => {
        ctrl = ctrl.toLowerCase().trim()
        if (ctrl && (standardsChoice === 'ALL' || _.get(annotations, 'policy.mcm.ibm.com/standards', 'other').toLowerCase().includes(standardsChoice.toLowerCase()))) {
          violationsByControls[ctrl] = _.get(violationsByControls, ctrl, 0)+1
          policyTooltips[ctrl] = _.get(policyTooltips, ctrl, [{count: 0, findingType: SECURITY_TYPES.VIOLATIONS},])
          policyTooltips[ctrl][0].count = policyTooltips[ctrl][0].count+1
        }
      })
    })

    const findingsByControls = {}
    const findingsTooltips = {}
    findings.forEach(finding=>{
      const controls = _.get(finding, 'securityClassification.securityControl', 'other')
      controls.split(',').forEach(ctrl => {
        ctrl = ctrl.toLowerCase().trim()
        if (ctrl && (standardsChoice === 'ALL' || _.get(finding, 'securityClassification.securityStandards', ['other']).join(',').toLowerCase().includes(standardsChoice.toLowerCase()))) {
          findingsByControls[ctrl] = _.get(findingsByControls, ctrl, 0)+1
          findingsTooltips[ctrl] = _.get(findingsTooltips, ctrl, [
            {count: 0, findingType: SECURITY_TYPES.HIGH},
            {count: 0, findingType: SECURITY_TYPES.MEDIUM},
            {count: 0, findingType: SECURITY_TYPES.LOW},
          ])
          switch (_.get(finding, 'finding.severity', 'high').toLowerCase()) {
          case SECURITY_TYPES.LOW.toLowerCase():
            findingsTooltips[ctrl][2].count = findingsTooltips[ctrl][2].count+1
            break
          case SECURITY_TYPES.MEDIUM.toLowerCase():
            findingsTooltips[ctrl][1].count = findingsTooltips[ctrl][1].count+1
            break
          default:
            findingsTooltips[ctrl][0].count = findingsTooltips[ctrl][0].count+1
          }
        }
      })
    })

    let variables =[]
    Object.keys(violationsByControls).forEach(key=>
      variables.push({key: key.toLowerCase(), label: _.startCase(key)})
    )
    Object.keys(findingsByControls).forEach(key=>
      variables.push({key: key.toLowerCase(), label: _.startCase(key)})
    )
    variables = _.uniqWith(variables, _.isEqual)

    variables.forEach(variable=>{
      violationsByControls[variable.key] = _.get(violationsByControls, variable.key, 0)
      findingsByControls[variable.key] = _.get(findingsByControls, variable.key, 0)
    })
    const radarData = {
      variables,
      sets: [
        {
          key: 'policy',
          color: $grc_color_radar_green,
          className: 'policies',
          label: 'Policy violations',
          values: violationsByControls,
        },
        {
          key: 'findings',
          color: $grc_color_radar_blue,
          className: 'findings',
          label: 'Security findings',
          values: findingsByControls,
        },
      ],
    }
    const tooltips = {
      findings: findingsTooltips,
      policy: policyTooltips,
    }


    return {
      selectionData: Array.from(standardsSet),
      radarData,
      tooltips,
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
  findings: PropTypes.array,
  policies: PropTypes.array,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}
