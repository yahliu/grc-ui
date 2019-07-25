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
import { connect } from 'react-redux'
import _ from 'lodash'
import { Breadcrumb, Button, Tabs, Tab, TooltipIcon } from 'carbon-components-react'
import resources from '../../lib/shared/resources'
import { withRouter, Link } from 'react-router-dom'
import msgs from '../../nls/platform.properties'

resources(() => {
  require('../../scss/secondary-header.scss')
})

export class SecondaryHeader extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, react/jsx-indent */

  constructor(props) {
    super(props)
    this.renderBreadCrumb = this.renderBreadCrumb.bind(this)
    this.renderTabs = this.renderTabs.bind(this)
    this.renderLinks = this.renderLinks.bind(this)
  }

  render() {
    const { tabs, title, breadcrumbItems, links, description } = this.props
    const { locale } = this.context
    if ((tabs && tabs.length > 0) || (breadcrumbItems && breadcrumbItems.length > 0)) {
      return (
        <div className='secondary-header-wrapper' role='region' aria-label={title}>
          <div className={`secondary-header simple-header${description ? ' special-layout': ''}`}>
            <header>
              <div className="bx--detail-page-header-content">
                {breadcrumbItems &&
                  (
                    <Breadcrumb>
                      {this.renderBreadCrumb()}
                    </Breadcrumb>
                  )
                }
                {this.renderHeader()}
                {tabs && tabs.length > 0 &&
                  <Tabs selected={this.getSelectedTab() || 0} aria-label={`${title} ${msgs.get('tabs.label', locale)}`}>
                    {this.renderTabs()}
                  </Tabs>
                }
              </div>
            </header>
          </div>
          {links && links.length>0 &&
            <div className='secondary-header-links'>
              {this.renderLinks()}
            </div>
          }
        </div>
      )
    } else {
      return (
        <div className='secondary-header-wrapper-min' role='region' aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
          <div className='secondary-header simple-header'>
            <h1 className='bx--detail-page-header-title'>{decodeURIComponent(title)}</h1>
          </div>
        </div>
      )
    }
  }


  renderHeader() {
    const { locale } = this.context
    const { title, description, information } = this.props
    const tooltip = msgs.get(information, locale)
    if (description) {
      return (
        <div className="bx--detail-page-header-title-container">
          <h1 className="bx--detail-page-header-title">{title}</h1>
          <div className="detail-page-header-title-button" onClick={description.action}><p>{description.display}</p></div>
        </div>
      )
    } else {
      return (
        <div className="bx--detail-page-header-title-container">
          <h1 className="bx--detail-page-header-title">{title}</h1>
          {information &&
            <TooltipIcon align='end' tooltipText={tooltip}>
              <svg className='info-icon'>
                <use href={'#diagramIcons_info'} ></use>
              </svg>
            </TooltipIcon>
          }
        </div>
      )
    }
  }

  renderBreadCrumb() {
    const { locale } = this.context
    const { breadcrumbItems } = this.props
    return breadcrumbItems && breadcrumbItems.map((breadcrumb, index) => {
      const key = `${breadcrumb.id}-${index}`
      const noLocale = _.get(breadcrumb, 'noLocale', false)
      return (
        <div key={key} className='bx--breadcrumb-item' title={decodeURIComponent(breadcrumb.label)}>
          {breadcrumb.handleClick ?
            <div className='breadcrumb-link' onClick={breadcrumb.handleClick} >{msgs.get(breadcrumb.label, locale)}</div> :
            <Link to={breadcrumb.url || ''} className='bx--link'>{noLocale ? breadcrumb.label : msgs.get(breadcrumb.label, locale)}</Link>}
        </div>
      )
    })
  }

  renderTabs() {
    const { tabs } = this.props,
          { locale } = this.context
    return tabs.map(tab => {
      return <Tab label={msgs.get(tab.label, locale)} key={tab.id} id={tab.id} href={tab.url} onClick={tab.handleClick ? tab.handleClick : this.clickTab.bind(this, tab.url)} />
    })
  }

  renderLinks() {
    const { links } = this.props,
          { locale } = this.context
    return links.map(link => {
      const {id, label, url, handleClick=(()=> this.props.history.push(url)) } = link
      return <Button key={id} id={id} onClick={handleClick} >
        {msgs.get(label, locale)}
      </Button>
    })
  }

  getSelectedTab() {
    const { tabs, location } = this.props
    const selectedTab = tabs.map((tab, index) => {
      tab.index = index
      return tab
    }).filter((tab, index) => {
      if (index !== 0) {
        return location.pathname.startsWith(tab.url)
      }
    })
    return selectedTab[0] && selectedTab[0].index
  }

  clickTab(url) {
    this.props.history.push(url)
  }
}

SecondaryHeader.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) => {

  return {
    title: state.secondaryHeader.title,
    tabs: state.secondaryHeader.tabs,
    breadcrumbItems: state.secondaryHeader.breadcrumbItems,
    links: state.secondaryHeader.links,
    refresh: state.secondaryHeader.refresh,
    role: state.role && state.role.role,
    description: state.secondaryHeader.description,
    information: state.secondaryHeader.information,
  }
}

export default withRouter(connect(mapStateToProps)(SecondaryHeader))
