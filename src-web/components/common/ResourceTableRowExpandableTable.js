/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

/* eslint-disable */

import React from 'react'
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
            return <th className={'bx--table-header-index-'+index} scope={'col'} key={header} />
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

export default ResourceTableRowExpandableTable
