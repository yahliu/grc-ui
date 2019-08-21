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
import { DropdownV2, Slider, TooltipIcon } from 'carbon-components-react'
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
    const {viewState: {showControls=6}} = props
    this.state = {
      showControls,
    }
    this.onSelectionChange = this.onSelectionChange.bind(this)
    this.onSliderChange = this.onSliderChange.bind(this)
    this.openTooltip = this.openTooltip.bind(this)
    this.closeTooltip = this.closeTooltip.bind(this)
    this.fixRadar = this.fixRadar.bind(this)
    this.setDropdown = this.setDropdown.bind(this)
  }

  componentDidUpdate() {
    this.dotMap=null
    this.fixRadar(this.radarRef)
    this.fixDropdown()
  }

  render() {
    this.cardData = this.getCardData()
    const { locale } = this.context
    const title = msgs.get('overview.impacted.controls.title', locale)
    const tooltip = msgs.get('overview.impacted.controls.tooltip', locale)
    return (
      <div className='module-impacted-controls'>
        <div className='card-container-container'>
          <div className='card-title-container'>
            <div className='card-title'>{title}</div>
            <TooltipIcon direction='top' align='end' tooltipText={tooltip}>
              <svg className='info-icon'>
                <use href={'#diagramIcons_info'} ></use>
              </svg>
            </TooltipIcon>
          </div>
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
        {this.renderLegend()}
        <div className='card-control-panel'>
          {this.renderSelection(title, cardData)}
          {this.renderSlider({max: cardData.radarData.variables.length})}
        </div>
      </div>
    )
  }

  renderSelection(title, {selectionData, standardsChoice}) {
    const { locale } = this.context
    let idx = 0
    const choices = selectionData.sort().map((standard, ix)=>{
      if (standardsChoice===standard) {
        idx = ix
      }
      return {
        value: standard,
        label: standard==='ALL' ? msgs.get('overview.impacted.controls.all', locale)  : standard
      }
    })
    this.currentChoice = choices[idx]
    return (
      <div className='card-selection' ref={this.setDropdown}>
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
        <div key={'key'} className='key' >{msgs.get('overview.impacted.controls.legend.key', locale)}</div>
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
    let domainMax = 0
    radarData.sets.forEach(({values})=>{
      Object.values(values).forEach(v=>{
        domainMax = Math.max(domainMax, v)
      })
    })
    domainMax = Math.max(10, Math.ceil(domainMax*1.2))
    return (
      <div className='card-radar-container' >
        <div className='card-radar' ref={this.fixRadar}>
          {radarData.variables.length>0 ? <Radar
            width={500}
            height={500}
            padding={70}
            domainMax={domainMax}
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

  setDropdown = ref => {
    this.dropdownRef = ref
    this.fixDropdown()
  }

  fixDropdown = () => {
    if (this.dropdownRef) {
      // tooltip on dropdown is hardcoded
      const title = this.dropdownRef.querySelector('title')
      if (title) {
        title.innerHTML = msgs.get('choose.standard', this.context.locale)
      }

      // make sure editbox is the selected choice
      if (this.cardData) {
        const {standardsChoice} = this.cardData
        const choice = this.dropdownRef.querySelector('span')
        if (choice) {
          choice.innerHTML = standardsChoice==='ALL' ? msgs.get('overview.impacted.controls.all', this.context.locale)  : standardsChoice
        }
      }

      if (!this.observer) {
        const dropdown = this.dropdownRef.querySelector('.bx--dropdown')
        this.observer = new MutationObserver(() => {
          const { activeFilters: {standards:filteredStandards=new Set()} } = this.props
          const items = Array.from(this.dropdownRef.querySelectorAll('.bx--list-box__menu-item'))
          items.forEach((item, idx)=>{
            const {innerHTML} = item
            let disabled = filteredStandards.size>0 &&
              !filteredStandards.has(innerHTML)
            if (disabled && filteredStandards.size>1 && idx===0) {
              disabled = false
            }
            item.classList.toggle('disabled', disabled)
          })
        })
        this.observer.observe(dropdown, {
          childList: true
        })
      }

    } else if (this.observer) {
      this.observer.disconnect()
      delete this.observer
    }
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

      // wrap labels
      Array.from(this.radarRef.querySelectorAll('text')).map(text=>{
        if (text.getAttribute('text-anchor') === 'middle') {
          // save unwrapped text
          const textContent = text.__textContent || text.textContent
          text.__textContent = textContent
          text = d3.select(text)
          text.text(null)

          // wrap text into tspans
          let line = []
          let lineNumber = 0
          let isMultiLined = false
          const lineHeight = 1.1
          const x = text.attr('x')
          const y = text.attr('y')
          const dy = parseFloat(text.attr('dy'))
          let tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em')
          const words = textContent.split(/\s+/).reverse()
          while (words.length>0) {
            const word = words.pop()
            line.push(word)
            tspan.text(line.join(' '))
            if (tspan.node().getComputedTextLength() > 60) {
              line.pop()
              tspan.text(line.join(' '))
              line = [word]
              tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word)
              isMultiLined = true
            }
          }

          // if wrap resulted in multiple lines, move entire label up
          if (isMultiLined) {
            text.selectAll('tspan').attr('y', y-10)
          }
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

  openTooltip = ({x, y, setKey, variableKey}) => {
    const tooltipHTML = this.getTooltipHTML(setKey, variableKey)
    if (tooltipHTML) {
      tooltip.style('display', undefined)
      tooltip.transition()
        .delay(200)
        .duration(100)
        .style('opacity', 1)
      tooltip.html(()=>{
        return tooltipHTML
      })
        .styles((d, j, ts)=>{
          const tooltipDiv = ts[j]
          const {width} = tooltipDiv.getBoundingClientRect()
          const height = setKey==='policy' ? 100 : 175
          tooltipDiv.style.height = height + 'px'
          const dot = this.getDotMap()[`${x}&${y}`].getBoundingClientRect()
          const top = dot.y + window.scrollY - height - 6
          const left = dot.x + window.scrollX - width/2 + 3
          return {
            'top': top + 'px',
            'left': left + 'px',
          }
        })
    } else {
      tooltip.style('display', 'none')
    }
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

  getTooltipHTML = (setKey, variableKey) => {
    const { locale } = this.context
    const { setMap, variableMap, tooltips } = this.cardData
    const tooltipList = _.get(tooltips, `${setKey}.${variableKey}`)
    return tooltipList ? ReactDOMServer.renderToStaticMarkup(
      <div className='tooltip-text'>
        <div className='header'>
          <div className='title'>{setMap[setKey].label.toUpperCase()}</div>
          <div className='variable'>
            <div className={`legend ${setMap[setKey].className}`} />
            {variableMap[variableKey].label}
          </div>
        </div>
        <div className='findings'>
          {tooltipList.map(({count, findingType}) => {
            let label, className
            switch (findingType) {
            case SECURITY_TYPES.HIGH:
              label = msgs.get('overview.recent.activity.severity.high', locale)
              className = 'high'
              break
            case SECURITY_TYPES.MEDIUM:
              label = msgs.get('overview.recent.activity.severity.medium', locale)
              className = 'medium'
              break
            case SECURITY_TYPES.LOW:
              label = msgs.get('overview.recent.activity.severity.low', locale)
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
    ) : null
  }

  getCardData = () => {
    const { policies, findings } = this.props
    const { activeFilters: {standards:filteredStandards=new Set()} } = this.props
    const { availableFilters: {standards: {availableSet:availableStandards}} } = this.props
    let {viewState: {standardsChoice='ALL'}} = this.props

    // loop thru policies to get violations
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

    // adjust selections based on filter bar
    const selectionData = ['ALL', ...Array.from(availableStandards)]
    if (filteredStandards.size!==0) {
      // if current choice isn't available, change to first avaiable choice
      if (!filteredStandards.has(standardsChoice)) {
        // if only one choice, make that the selection
        if (filteredStandards.size===1) {
          standardsChoice = Array.from(filteredStandards)[0]
        } else {
          // else use all
          standardsChoice = 'ALL'
        }
      }
    }

    const controlLabels = {}
    const violationsByControls = {}
    const policyTooltips = {}
    violations.forEach(policy=>{
      const annotations = _.get(policy, 'metadata.annotations', {})
      const controls = _.get(annotations, 'policy.mcm.ibm.com/controls', 'other')
      controls.split(',').forEach(control => {
        const label = _.startCase(control.trim())
        const ctrl = control.toLowerCase().trim()
        controlLabels[ctrl] = label
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
      controls.split(',').forEach(control => {
        const label = _.startCase(control.trim())
        const ctrl = control.toLowerCase().trim()
        controlLabels[ctrl] = label
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
    Object.keys(violationsByControls).forEach(key=> {
      key = key.toLowerCase()
      variables.push({key, label: controlLabels[key]})
    })
    Object.keys(findingsByControls).forEach(key=> {
      key = key.toLowerCase()
      variables.push({key, label: controlLabels[key]})
    })

    // create unique controls
    // only show controls that have both violations and findings
    variables = _.uniqWith(variables, _.isEqual)
      .filter(({key})=>{
        return violationsByControls[key] && findingsByControls[key]
      })

    // create radar data
    variables.forEach(({key})=>{
      violationsByControls[key] = _.get(violationsByControls, key, 0)
      findingsByControls[key] = _.get(findingsByControls, key, 0)
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
      standardsChoice,
      selectionData,
      radarData,
      tooltips,
      setMap: _.keyBy(radarData.sets, 'key'),
      variableMap: _.keyBy(radarData.variables, 'key'),
    }
  }

  onSelectionChange = (e) => {
    const {selectedItem: {value}} = e
    this.props.updateViewState({standardsChoice: value})
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
  activeFilters: PropTypes.object,
  availableFilters: PropTypes.object,
  findings: PropTypes.array,
  policies: PropTypes.array,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}