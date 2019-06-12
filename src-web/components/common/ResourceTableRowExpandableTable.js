/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import { DataTable,  } from 'carbon-components-react'

const {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell } = DataTable

const ResourceTableRowExpandableTable = ({ items, headers }, context) =>
  <Table className='resource-table-expandable'>
    <TableHead>
      <TableRow>
        {headers.map((header, index) => {
          if (header) {
            return (
              <th className={'bx--table-header-index-'+index} scope={'col'} key={header}>
                <span className='bx--table-header-label'>{msgs.get(header, context.locale)}</span>
              </th>
            )
          } else {
            // eslint-disable-next-line react/no-array-index-key
            return <th className={'bx--table-header-index-'+index} scope={'col'} key={'bx--table-header-' + index} />
          }
        }
        )}
      </TableRow>
    </TableHead>
    <TableBody>
      {(() => {
        return items.map((row) => {
          return (
            <TableRow key={row.id}>
              {row.cells.map(cell => <TableCell key={cell}>{cell}</TableCell>)}
            </TableRow>
          )
        })
      })()}
    </TableBody>
  </Table>

ResourceTableRowExpandableTable.propTypes = {
  headers: PropTypes.array,
  items: PropTypes.array
}

export default ResourceTableRowExpandableTable
