/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
/* eslint-disable */

import React from 'react'
import { connect } from 'react-redux'
import loadable from 'loadable-components'

let LabelEditingModal

const Modal = ({ type, open, ...rest }) => {
  switch (type) {
  case 'label-editing':
    return open && getLabelEditingModal({ type, open, ...rest })
  default:
    return null
  }
}


// const getLabelEditingModal = props => {
//   LabelEditingModal = LabelEditingModal === undefined ? loadable(() => import(/* webpackChunkName: "label-editing-modal" */ '../modals/LabelEditingModal')) : LabelEditingModal
//   return getModal(LabelEditingModal, props)
// }

const getModal = (Component, props) => <Component {...props} />

const mapStateToProps = state => state.modal

export default connect(mapStateToProps)(Modal)
