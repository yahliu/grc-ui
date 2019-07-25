/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

'use strict'

import React from 'react'
import lodash from 'lodash'
import ResourceTable from './ResourceTable'
import { REQUEST_STATUS } from '../../actions/index'
import NoResource from './NoResource'
import { connect } from 'react-redux'
import { changeTablePage, searchTable, sortTable, receiveResourceSuccess, updateSecondaryHeader } from '../../actions/common'
import { updateResourceFilters } from '../../actions/filters'
import TableHelper from '../../util/table-helper'
import { Loading, Notification } from 'carbon-components-react'
import { withRouter } from 'react-router-dom'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'
// import config2 from '../../../config'
import TagInput from './TagInput'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import { showCreate } from '../../../lib/client/access-helper'
import createDocLink from '../../components/common/CreateDocLink'

//This ResourceList module and all other Resource common components need to be cleaned up and refactor in future

class ResourceList extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind */

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    const { updateSecondaryHeader, tabs, title, links, information, fetchResources, policies } = this.props
    updateSecondaryHeader(msgs.get(title, this.context.locale), tabs, links, msgs.get(information, this.context.locale))
    fetchResources(policies)
  }

  componentWillUnmount() {
    const { searchTable } = this.props
    //clean up current page search text before leaving
    searchTable('', false)
  }

  componentWillReceiveProps(nextProps) {
    if (!lodash.isEqual(this.props.policies, nextProps.policies)) {
      this.props.fetchResources(nextProps.policies)
    }
  }

  render() {
    const {
      userRole,
      items,
      itemIds,
      mutateStatus,
      mutateErrorMsg,
      page,
      pageSize,
      sortDirection,
      totalFilteredItems,
      status,
      sortTable,
      sortColumn,
      changeTablePage,
      searchTable,
      staticResourceData,
      searchValue,
      resourceType,
      err,
      children,
      resourceFilters,
      onSelectedFilterChange,
      selectedFilters,
      updateBrowserURL,
      clientSideFilters,
      placeHolderText,
      autoAction,
      highLightRowName,
      showSidePanel
    } = this.props
    const { locale } = this.context

    if (status === REQUEST_STATUS.ERROR) {
      if (err && err.data && err.data.Code === 1) {
        return (
          <NoResource
            title={msgs.get('no-cluster.title', locale)}
            detail={msgs.get('no-cluster.detail', locale)}>
            {actions}
          </NoResource>
        )
      }
      //eslint-disable-next-line no-console
      console.error(err)
      return <Notification
        title=''
        className='persistent'
        subtitle={msgs.get('error.default.description', locale)}
        kind='error' />
    }

    if (status !== REQUEST_STATUS.DONE)
      return <Loading withOverlay={false} className='content-spinner' />

    const actions = React.Children.map(children, action => {
      if (action.props.disabled || !showCreate(userRole, resourceType))
        return null
      return React.cloneElement(action, { resourceType })
    })
    if (items || searchValue || clientSideFilters) {
      if (searchValue !== clientSideFilters && clientSideFilters) {
        searchTable(clientSideFilters, false)
      }
      return <div>
        { mutateStatus === REQUEST_STATUS.ERROR &&
          <Notification
            title=''
            subtitle={mutateErrorMsg || msgs.get('error.default.description', locale)}
            kind='error' />
        }
        { (config['featureFlags:filters']) && resourceType.filter &&
          <div className='resource-list-filter'>
            <TagInput
              tags={selectedFilters}
              availableFilters={resourceFilters}
              onSelectedFilterChange={onSelectedFilterChange}
              updateBrowserURL={updateBrowserURL}
            />
          </div>
        }
        <ResourceTable
          actions={actions}
          staticResourceData={staticResourceData}
          page={page}
          pageSize={pageSize}
          itemIds={itemIds}
          sortDirection={sortDirection}
          sortColumn={sortColumn}
          status={status}
          items={items}
          expandableTable={resourceType.name === RESOURCE_TYPES.HCM_POLICIES_PER_POLICY.name}
          totalFilteredItems={totalFilteredItems}
          resourceType={resourceType}
          changeTablePage={changeTablePage}
          handleSort={TableHelper.handleSort.bind(this, sortDirection, sortColumn, sortTable)}
          handleSearch={TableHelper.handleInputValue.bind(this, searchTable)}
          searchValue={searchValue}
          defaultSearchValue={clientSideFilters}
          tableActions={staticResourceData.tableActions}
          listSubItems={resourceType.name === RESOURCE_TYPES.HCM_POLICIES_PER_POLICY.name}
          placeHolderText={placeHolderText}
          autoAction={autoAction}
          highLightRowName={highLightRowName}
          showSidePanel={showSidePanel}
        />
      </div>
    }
    if (resourceType.name === RESOURCE_TYPES.HCM_POLICIES_PER_POLICY.name){
      return (
        <NoResource
          title={msgs.get('no-resource.title', [msgs.get('routes.grc', locale)], locale)}
          detail={msgs.get('no-resource.detail.policy', locale)}>
          {createDocLink(locale, actions)}
        </NoResource>
      )
    }
    const resourceName = msgs.get('no-resource.' + resourceType.name.toLowerCase(), locale)
    return (
      <NoResource
        title={msgs.get('no-resource.title', [resourceName], locale)}
        detail={msgs.get('no-resource.detail', [resourceName], locale)}>
        {actions}
      </NoResource>
    )
  }

  handleResourceAddedEvent(event) {
    this.props.addResource(event)
  }

  handleResourceModifiedEvent(event) {
    this.props.modifyResource(event)
  }

  handleResourceDeletedEvent(event) {
    this.props.deleteResource(event)
  }
}

const mapStateToProps = (state, ownProps) => {
  const { list: typeListName, name: resourceName } = ownProps.resourceType,
        visibleResources = ownProps.getVisibleResources(state, {'storeRoot': typeListName})

  const pendingActions = state[typeListName].pendingActions
  const items = visibleResources.normalizedItems
  if (items && pendingActions){
    Object.keys(items).map(key => {
      if (pendingActions.find(pending => pending.name === items[key].Name))
        items[key].hasPendingActions = true
    })
  }
  const userRole = state.role.role

  return {
    userRole,
    items,
    itemIds: visibleResources.items,
    totalFilteredItems: visibleResources.totalResults,
    totalPages: visibleResources.totalPages,
    status: state[typeListName].status,
    page: state[typeListName].page,
    pageSize: state[typeListName].itemsPerPage,
    sortDirection: state[typeListName].sortDirection,
    sortColumn: state[typeListName].sortColumn,
    searchValue: state[typeListName].search,
    err: state[typeListName].err,
    mutateStatus: state[typeListName].mutateStatus,
    mutateErrorMsg: state[typeListName].mutateErrorMsg,
    resourceFilters: state['resourceFilters'].filters,
    selectedFilters: state['resourceFilters'].selectedFilters && state['resourceFilters'].selectedFilters[resourceName],
  }
}

//diff than original updateBrowserURL in mcm-ui pageWithUrlQuery
//this modified updateBrowserURL will keep flags other than text input filters
const mapDispatchToProps = (dispatch, ownProps) => {
  const { updateBrowserURL, resourceType } = ownProps
  return {
    fetchResources: (policies) => {
      dispatch(receiveResourceSuccess({items: lodash.cloneDeep(policies)}, resourceType))
    },
    changeTablePage: page => dispatch(changeTablePage(page, resourceType)),
    searchTable: (search, updateURL) => {
      if (updateURL !== false) updateBrowserURL && updateBrowserURL(search)
      dispatch(searchTable(search, resourceType))
    },
    sortTable: (sortDirection, sortColumn) => dispatch(sortTable(sortDirection, sortColumn, resourceType)),
    updateSecondaryHeader: (title, tabs, links, information) => dispatch(updateSecondaryHeader(title, tabs, undefined, links, '', information)),
    onSelectedFilterChange: (selectedFilters) => {
      updateBrowserURL && updateBrowserURL(selectedFilters)
      dispatch(updateResourceFilters(resourceType, selectedFilters))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceList))
