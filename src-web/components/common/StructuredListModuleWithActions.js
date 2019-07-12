/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
/* eslint-disable react/no-array-index-key, react/prop-types */

import React from 'react'
import PropTypes from 'prop-types'
import { StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, OverflowMenu, OverflowMenuItem } from 'carbon-components-react'
import { Module, ModuleBody } from 'carbon-addons-cloud-react'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import { transform } from '../../../lib/client/resource-helper'
import { Link } from 'react-router-dom'
import { resourceActions } from './ResourceTableRowMenuItemActions'
import { connect } from 'react-redux'

resources(() => {
  require('../../../scss/structured-list-with-actions.scss')
})

const StructuredListModule = ({
  title,
  headerRows,
  rows,
  data,
  url,
  id,
  actions,
  getResourceAction,
}, context) =>
  <Module className='structured-list-module' id={id}>
    <div className='bx--module__header' style={{justifyContent: 'space-between'}} >
      <h1 className='bx--module__title'>{msgs.get(title, context.locale)}</h1>
      {actions && actions.length > 0 &&
        <OverflowMenu floatingMenu iconDescription={msgs.get('svg.description.overflowMenu', context.locale)}>
          {actions.map((action) => (
            <OverflowMenuItem
              data-table-action={action}
              isDelete={action ==='table.actions.remove' || action ==='table.actions.policy.remove'|| action ==='table.actions.applications.remove'|| action ==='table.actions.compliance.remove'}
              onClick={() => getResourceAction(action, data, null, history, context.locale)}
              key={action}
              itemText={msgs.get(action, context.locale)}
            />
          ))}
        </OverflowMenu>
      }
    </div>
    <ModuleBody>
      <StructuredListWrapper className='bx--structured-list--condensed' ariaLabel={msgs.get(title, context.locale)}>
        <StructuredListHead>
          <StructuredListRow head>
            {headerRows.map((row, index) =>
              <StructuredListCell head key={index}>
                {msgs.get(row, context.locale)}
              </StructuredListCell>
            )}
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {rows.map((row, index) =>
            <StructuredListRow key={index}>
              {row.cells.map((cell, index) =>
                <StructuredListCell key={index}>
                  <p>{cell.link && url ? <Link to={url} className='bx--link'>{transform(data, cell, context.locale)}</Link> : transform(data, cell, context.locale)}</p>
                </StructuredListCell>
              )}
            </StructuredListRow>
          )}
        </StructuredListBody>
      </StructuredListWrapper>
    </ModuleBody>
  </Module>

StructuredListModule.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = state => ({
  navRoutes: state.nav && state.nav.navItems
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getResourceAction: (action, resource, hasService) => resourceActions(action, dispatch, ownProps.resourceType, resource, hasService)
})

export default connect(mapStateToProps, mapDispatchToProps)(StructuredListModule)
