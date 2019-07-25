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
import { DataTable } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import { transform } from '../../../lib/client/resource-helper'
import { Link } from 'react-router-dom'
import ResourceTableRowExpandableTable from './ResourceTableRowExpandableTable'
import { Module, ModuleHeader, ModuleBody } from 'carbon-addons-cloud-react'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/structured-list.scss')
})

const {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableExpandRow,
  TableCell,
  TableExpandedRow } = DataTable

class StructuredListModule extends React.Component {
  constructor() {
    super()
    this.state = {
      extended: undefined
    }
  }

  onSelect = (index) => () => {
    this.setState(state => {
      if (state.extended === index) {
        return { extended: undefined }
      } else {
        return { extended: index }
      }
    })
  }

  render() {
    const { headerRows, data, listSubItems, url, rows, title, subHeaders, linkFixedName } = this.props
    const { extended } = this.state
    return (
      <Module className='structured-list-module'>
        {title && <ModuleHeader>{msgs.get(title, this.context.locale)}</ModuleHeader>}
        <ModuleBody>
          <Table className='resource-table-main'>
            <TableHead>
              <TableRow>
                {headerRows.map((header, index) => {
                  if (header) {
                    return (
                      <th className={'bx--header-index-'+index} scope={'col'} key={header}>
                        <span className='bx--table-header-label'>{msgs.get(header, this.context.locale)}</span>
                      </th>
                    )
                  } else {
                    // eslint-disable-next-line react/no-array-index-key
                    return <th className={'bx--header-index-'+index} scope={'col'} key={'bx--header-' + index} />
                  }
                }
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                return data.map((row, index) => {
                  if (listSubItems) {
                    return (
                      <React.Fragment key={row.id}>
                        <TableExpandRow
                          isExpanded={extended === index}
                          onExpand={this.onSelect(index)}
                          ariaLabel='Overflow-menu'>
                          {rows[0].cells.map((cell, index) =>
                            <td key={cell.resourceKey+'Cell'}>
                              <p>{
                                (linkFixedName && (index in linkFixedName))
                                  ? <Link to={transform(row, cell, this.context.locale)} target={linkFixedName[index].urlTarget} className='bx--link'>{msgs.get(linkFixedName[index].fixedName, this.context.locale)}</Link>
                                  : cell.link && url ? <Link to={url} className='bx--link'>{transform(row, cell, this.context.locale)}</Link> : transform(row, cell, this.context.locale)
                              }</p>
                            </td>
                          )}
                        </TableExpandRow>
                        {index === extended && listSubItems && (
                          <TableExpandedRow>
                            <td className='expand-arrow-align-makeup'></td>
                            <TableCell colSpan={8} className={'resource-table-expandable-cell'} >
                              <ResourceTableRowExpandableTable
                                items={row.subItems}
                                headers={subHeaders}
                                type='name' />
                            </TableCell>
                          </TableExpandedRow>
                        )}
                      </React.Fragment>
                    )
                  } else {
                    if(row && row.id){
                      return (
                        <TableRow key={row.id}>
                          {row.cells && row.cells.map(cell => <TableCell key={cell.id}>{cell.value}</TableCell>)}
                        </TableRow>
                      )
                    }
                  }
                })
              })()}
            </TableBody>
          </Table>
        </ModuleBody>
      </Module>
    )
  }
}


StructuredListModule.contextTypes = {
  locale: PropTypes.string
}

StructuredListModule.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  headerRows: PropTypes.array,
  linkFixedName: PropTypes.object,
  listSubItems: PropTypes.bool,
  rows: PropTypes.array,
  subHeaders: PropTypes.array,
  title: PropTypes.string,
  url: PropTypes.string
}

export default StructuredListModule
