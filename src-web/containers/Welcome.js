/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { Gallery, GalleryItem } from '@patternfly/react-core'
import config from '../../server/lib/shared/config'
import msgs from '../nls/platform.properties'

import '../scss/welcome.scss'

export default class WelcomeStatic extends React.Component {

  constructor(props) {
    super(props)
  }

  welcomeCard(img, title, desc, linkText, linkRoute) {
    return (
      <div className="welcome--svcs-container">
        <div className="welcome--svcs-container-img">
          <img src={`${config.contextPath}/graphics/${img}`} alt={''} />
        </div>
        <div className="welcome--svcs-container-text">
          <div className="welcome--svcs-container-text-title">
            <p>{title}</p>
            <a href={linkRoute} className='welcome--svcs-container-text-title-link'>{linkText}</a>
          </div>
          <p className="welcome--svcs-container-text-desc">{desc}</p>
        </div>
      </div>
    )
  }

  render() {
    const { locale } = this.context
    const welcomeBoxLinkStr = 'welcome.connect.box.link'
    const welcomeBoxLabelStr = 'welcome.connect.label'
    return (
      <div className={'welcome'}>
        <div className='welcome--introduction' role='region' aria-label={msgs.get('welcome.label', locale)}>
          <div className='welcome--introduction__description'>
            <div className='welcome--text'>
              <h1>{msgs.get('welcome.acm', locale)}</h1>
              <p>{msgs.get('welcome.paragraph.description', locale)}</p>
            </div>
            <div className='welcome--image'>
              <img
                width="32px"
                height="32px"
                src={`${config.contextPath}/graphics/Welcome-page-header.png`}
                alt={msgs.get('svg.description.welcome', locale)} />
            </div>
          </div>
        </div>
        <div className='welcome--svcs' role='region' aria-label={msgs.get(welcomeBoxLabelStr, locale)} >
          <Gallery
            className='welcome--svcs-gallery-container'
            hasGutter
            minWidths={{
              md: '70%',
              lg: '70%',
              xl: '70%',
              '2xl': '70%'
            }}
            maxWidths={{
              md: '70%',
              lg: '70%',
              xl: '70%',
              '2xl': '70%'
            }} >
            <GalleryItem>
              {this.welcomeCard(
                'welcome-card-1-icon.svg',
                msgs.get('welcome.card.one.title', locale),
                msgs.get('welcome.card.one.desc', locale),
                msgs.get('welcome.card.one.link', locale),
                '/overview'
              )}
            </GalleryItem>
            <GalleryItem>
              {this.welcomeCard(
                'welcome-card-2-icon.svg',
                msgs.get('welcome.card.two.title', locale),
                msgs.get('welcome.card.two.desc', locale),
                msgs.get('welcome.card.two.link', locale),
                '/multicloud/clusters'
              )}
            </GalleryItem>
            <GalleryItem>
              {this.welcomeCard(
                'welcome-card-3-icon.svg',
                msgs.get('welcome.card.three.title', locale),
                msgs.get('welcome.card.three.desc', locale),
                msgs.get('welcome.card.three.link', locale),
                '/multicloud/applications'
              )}
            </GalleryItem>
            <GalleryItem>
              {this.welcomeCard(
                'welcome-card-4-icon.svg',
                msgs.get('welcome.card.four.title', locale),
                msgs.get('welcome.card.four.desc', locale),
                msgs.get('welcome.card.four.link', locale),
                '/multicloud/policies'
              )}
            </GalleryItem>
            <GalleryItem>
              {this.welcomeCard(
                'welcome-card-5-icon.svg',
                msgs.get('welcome.card.five.title', locale),
                msgs.get('welcome.card.five.desc', locale),
                msgs.get('welcome.card.five.link', locale),
                '/multicloud/cluster-sets'
              )}
            </GalleryItem>
          </Gallery>
        </div>
        <div className='welcome--info' role='region' aria-label={msgs.get(welcomeBoxLabelStr, locale)} >
          <div className='welcome--info__heading'>
            <h2>{msgs.get('welcome.information.heading', locale)}</h2>
          </div>
          <div className='welcome--info__details'>
            <div className="welcome--info__details-top">
              <p>{msgs.get('welcome.information.top', locale)}</p>
            </div>
            <div className="welcome--info__details-container">
              <div className="container-row">
                <div className="welcome--info__details-container-item spacer">
                  <p className="header">{msgs.get('welcome.information.items.kubernetes.title', locale)}</p>
                  <p className="desc">{msgs.get('welcome.information.items.kubernetes.desc', locale)}</p>
                </div>
                <div className="welcome--info__details-container-item spacer">
                  <p className="header">{msgs.get('welcome.information.items.policies.title', locale)}</p>
                  <p className="desc">{msgs.get('welcome.information.items.policies.desc', locale)}</p>
                </div>
                <div className="welcome--info__details-container-item">
                  <p className="header">{msgs.get('welcome.information.items.landscape.title', locale)}</p>
                  <p className="desc">{msgs.get('welcome.information.items.landscape.desc', locale)}</p>
                </div>
              </div>
              <div className="container-row">
                <div className="welcome--info__details-container-item spacer">
                  <p className="header">{msgs.get('welcome.information.items.envs.title', locale)}</p>
                  <p className="desc">{msgs.get('welcome.information.items.envs.desc', locale)}</p>
                </div>
                <div className="welcome--info__details-container-item spacer">
                  <p className="header">{msgs.get('welcome.information.items.integration.title', locale)}</p>
                  <p className="desc">{msgs.get('welcome.information.items.integration.desc', locale)}</p>
                </div>
                <div className="welcome--info__details-container-item">
                  <p className="header">{msgs.get('welcome.information.items.alerts.title', locale)}</p>
                  <p className="desc">{msgs.get('welcome.information.items.alerts.desc', locale)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='welcome--connect' role='region' aria-label={msgs.get(welcomeBoxLabelStr, locale)} >
          <div className='welcome--connect__heading'>
            <h2>{msgs.get('welcome.connect.heading', locale)}</h2>
          </div>
          <div className='welcome--connect__details'>
            <div className='welcome--connect__section'>
              <img
                className='welcome--img'
                src={`${config.contextPath}/graphics/welcome-community-icon.svg`}
                alt={msgs.get('svg.description.blog', locale)} />
              <p className='welcome--connect__section-title'>{msgs.get('welcome.connect.box.one.title.one', locale)}</p>
              <p className='welcome--connect__section-body'>{msgs.get('welcome.connect.box.one.title.two', locale)}</p>
              <a
                target='dev-community'
                href='https://www.redhat.com/en/blog/products'
                className='welcome--link'
                aria-describedby='launchWindow'>
                {msgs.get(welcomeBoxLinkStr, locale)}
                <img
                  className='welcome--connect__section-launch'
                  src={`${config.contextPath}/graphics/arrow-right.svg`}
                  alt={msgs.get(welcomeBoxLinkStr, locale)} />
              </a>
            </div>
            <div className='welcome--connect__section'>
              <img
                className='welcome--img'
                src={`${config.contextPath}/graphics/welcome-slack-icon.svg`}
                alt={msgs.get('svg.description.slack', locale)} />
              <p className='welcome--connect__section-title'>{msgs.get('welcome.connect.box.two.title.one', locale)}</p>
              <p className='welcome--connect__section-body'>{msgs.get('welcome.connect.box.two.title.two', locale)}</p>
              <p className='connect-coming-soon'>{msgs.get('welcome.connect.box.coming.soon')}</p>
            </div>
            <div className='welcome--connect__section'>
              <img
                className='welcome--img'
                src={`${config.contextPath}/graphics/welcome-support-icon.svg`}
                alt={msgs.get('svg.description.support', locale)}
              />
              <p className='welcome--connect__section-title'>{msgs.get('welcome.connect.box.three.title.one', locale)}</p>
              <div className='welcome--connect__section-body'>
                {msgs.get('welcome.connect.box.three.title.two', locale)}
                <br />
                {msgs.get('welcome.connect.box.three.title.three', locale)}
              </div>
              <a
                target='support'
                href='https://access.redhat.com/support'
                className='welcome--link'
                aria-describedby='launchWindow'>
                {msgs.get(welcomeBoxLinkStr, locale)}
                <img
                  className='welcome--connect__section-launch'
                  src={`${config.contextPath}/graphics/arrow-right.svg`}
                  alt={msgs.get(welcomeBoxLinkStr, locale)}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
