/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

// seems to be an issue with this rule and redux
/* eslint-disable import/no-named-as-default */

import React from 'react'
import PropTypes from 'prop-types'
import SecondaryHeader from '../components/SecondaryHeader'
import { Route, Switch, Redirect } from 'react-router-dom'
import resources from '../../lib/shared/resources'
import client from '../../lib/shared/client'
import loadable from 'loadable-components'
import config from '../../lib/shared/config'
import Modal from '../components/common/Modal'


export const WelcomeTab = loadable(() => import(/* webpackChunkName: "empty" */ './WelcomePageTab'))
export const Policies = loadable(() => import(/* webpackChunkName: "empty" */ './Policies'))

resources(() => {
  require('../../scss/common.scss')
})

class App extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind */

  constructor(props) {
    super(props)
    if (client) this.serverProps = JSON.parse(document.getElementById('propshcm').textContent)
  }

  getServerProps() {
    if (client) return this.serverProps
    return this.props.staticContext
  }

  render() {
    const serverProps = this.getServerProps()
    const { match, location } = this.props

    return (
      <div className='expand-vertically'>
        {location.pathname && !location.pathname.includes('welcome') && !location.pathname.includes('search') && <SecondaryHeader />}
        <Switch>
          <Route path={`${match.url}/welcome`} render={() => <WelcomeTab />} />
          <Route path={`${match.url}/policies`} render={() => <Policies />} />
          <Redirect to={`${config.contextPath}/welcome`} />
        </Switch>
        <Modal locale={serverProps.context.locale} />
      </div>
    )
  }

  getChildContext() {
    return {
      locale: this.getServerProps().context.locale
    }
  }
}

App.childContextTypes = {
  locale: PropTypes.string
}

export default props => ( // eslint-disable-line react/display-name
  <div className='expand-vertically'>
    <Route path={config.contextPath} serverProps={props} component={App} />
  </div>
)
