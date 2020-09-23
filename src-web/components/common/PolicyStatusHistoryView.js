/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {
  Title,
} from '@patternfly/react-core'
import PatternFlyTable from './PatternFlyTable'
import { LocaleContext } from './LocaleContext'
import statusHistoryDef from '../../tableDefinitions/statusHistoryDef'
import { transform } from '../../tableDefinitions/utils'
import msgs from '../../../nls/platform.properties'

class PolicyStatusHistoryView extends React.Component {
  constructor(props) {
    super(props)
  }

  static contextType = LocaleContext

  setEditor = (editor) => {
    this.editor=editor
    this.layoutEditors()
  }

  layoutEditors() {
    if (this.containerRef && this.editor) {
      const rect = this.containerRef.getBoundingClientRect()
      const width = rect.width
      const height = rect.height - 24 // minus height of title
      this.editor.layout({width, height})
    }
  }

  componentDidMount() {
    window.addEventListener('resize',  this.layoutEditors.bind(this))
  }

  render() {
    const { history, cluster, template } = this.props
    const { locale } = this.context

    const tableData = transform(history, statusHistoryDef, locale)

    return (
      <div className='policy-status-history-view'>
        <div className='table'>
          <Title className='title' headingLevel="h3">{cluster}</Title>
          <Title className='title' headingLevel="h4">{`${msgs.get('policy.template', locale)}: ${template}`}</Title>
          <br></br>
          <PatternFlyTable {...tableData} noResultMsg={msgs.get('table.search.no.results', locale)} />
        </div>
      </div>

    )
  }
}

PolicyStatusHistoryView.propTypes = {
  cluster: PropTypes.string,
  history: PropTypes.array,
  template: PropTypes.string
}

export default PolicyStatusHistoryView