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
import { DropdownV2, Slider } from 'carbon-components-react'
import Radar from 'react-d3-radar'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/module-impacted-controls.scss')
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
  }

  render() {
    const cardData = this.getCardData()
    return (
      <div className='module-impacted-controls'>
        <div className='card-container-container'>
          <div className='card-container'>
            <div className='card-content'>
              {this.renderControls(cardData)}
              {this.renderRadar(cardData)}
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
        {this.renderSelection(title, cardData)}
        {this.renderLegend()}
        {this.renderSlider(cardData)}
      </div>
    )
  }

  renderSelection(title) {
    const { standardsChoice } = this.state
    const choices = [
      {
        value: 0,
        label: 'PCI',
      },
      {
        value: 1,
        label: 'HIPPA',
      },
    ]
    const idx = Math.max(0, choices.findIndex(({value})=>{
      return standardsChoice===value
    }))
    return (
      <div className='card-selection'>
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
      <div className='card-radar-container'>
        <div className='card-radar'>
          {radarData.variables.length>0 ? <Radar
            width={500}
            height={500}
            padding={70}
            domainMax={10}
            highlighted={null}
            onHover={(point) => {
              if (point) {
              //console.log('hovered over a data point')
              } else {
              //console.log('not over anything')
              }
            }}
            data={radarData}
          />
            :null}
        </div>
      </div>
    )
  }

  getCardData = () => {
    return {
      radarData: {
        variables: [
          {key: 'resilience', label: 'Certificate expiration'},
          {key: 'strength', label: 'Network isolation'},
          {key: 'adaptability', label: 'Image provenance'},
          {key: 'creativity', label: 'LDAP configured'},
          {key: 'openness', label: 'SAML'},
          {key: 'confidence', label: 'Image vulnerability'},
          {key: 'dataintransit', label: 'Inter node data-in-transit'},
          {key: 'podsecurity', label: 'Pod security'},
        ],
        sets: [
          {
            key: 'policy',
            color: 'green',
            label: 'Policy violations',
            values: {
              resilience: 4,
              strength: 6,
              adaptability: 7,
              creativity: 2,
              openness: 8,
              confidence: 1,
              dataintransit: 6,
              podsecurity: 3,
            },
          },
          {
            key: 'findings',
            color: 'yellow',
            label: 'Security findings',
            values: {
              resilience: 10,
              strength: 8,
              adaptability: 6,
              creativity: 4,
              openness: 2,
              confidence: 0,
              dataintransit: 3,
              podsecurity: 5,
            },
          },
        ],
      }
    }
  }

  onSelectionChange = (e) => {
    const {selectedItem: {value}} = e
    this.props.updateViewState({standardsChoice: value})
    this.setState(()=>{
      return {standardsChoice: value}
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
  //policies: PropTypes.array,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}
