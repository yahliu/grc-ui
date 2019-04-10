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
import { Breadcrumb, Tabs, Tab } from 'carbon-components-react'
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
  }

  render() {
    const { tabs, title, breadcrumbItems, description } = this.props
    const { locale } = this.context
    if ((tabs && tabs.length > 0) || (breadcrumbItems && breadcrumbItems.length > 0)) {
      // return (
      //   <div className='secondary-header-wrapper' role='region' aria-label={title}>
      //     <div className='secondary-header simple-header'>
      //       {tabs && tabs.length > 0 ? (
      //         <DetailPageHeader hasTabs={true} title={decodeURIComponent(title)} aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
      //           <Breadcrumb>
      //             {breadcrumbItems && this.renderBreadCrumb()}
      //           </Breadcrumb>
      //           <Tabs selected={this.getSelectedTab() || 0} aria-label={`${title} ${msgs.get('tabs.label', locale)}`}>
      //             {this.renderTabs()}
      //           </Tabs>
      //         </DetailPageHeader>
      //       ) : (
      //         <DetailPageHeader hasTabs={true} title={decodeURIComponent(title)} aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
      //           <Breadcrumb>
      //             {this.renderBreadCrumb()}
      //           </Breadcrumb>
      //         </DetailPageHeader>
      //       )}
      //     </div>
      //   </div>
      // )
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
    // const { locale } = this.context
    const { title, description } = this.props
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
        </div>
      )
    }
  }

  renderBreadCrumb() {
    const { locale } = this.context
    const { breadcrumbItems } = this.props
    return breadcrumbItems && breadcrumbItems.map((breadcrumb, index) => {
      const key = `${breadcrumb}-${index}`
      return (
        <div key={key} className='bx--breadcrumb-item' title={decodeURIComponent(breadcrumb.label)}>
          {breadcrumb.handleClick ? <div className='breadcrumb-link' onClick={breadcrumb.handleClick} >
            {msgs.get(breadcrumb.label, locale)}</div> :
            <Link to={breadcrumb.url || ''} className='bx--link'>{decodeURIComponent(breadcrumb.label)}</Link>}
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
    refresh: state.secondaryHeader.refresh,
    role: state.role && state.role.role,
    description: state.secondaryHeader.description,
  }
}

export default withRouter(connect(mapStateToProps)(SecondaryHeader))
