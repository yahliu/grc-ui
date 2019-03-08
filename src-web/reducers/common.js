1
/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/*
Since these selectors are common (i.e used across different components and different parts of the store)
we have to create unique selectors each invocation and the selectors need additional metata data sent
though props that indicate which part of the store it should select from.

//See https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
//See https://github.com/reactjs/reselect#q-can-i-share-a-selector-across-multiple-components

The selector pattern is an abstraction that standardizes an application’s store querying logic.
It is simple: for any part of the store that an application needs access to, define a function that
when given the full store, returns the desired part (or derivation) of the store.
*/

import lodash from 'lodash'
import * as Actions from '../actions'


export const getItems = (state, props) => getFromState(state,props.storeRoot, 'items')
export const getItemsPerPage = (state, props) => getFromState(state,props.storeRoot, 'itemsPerPage')
export const getPage = (state, props) => getFromState(state,props.storeRoot, 'page')
export const getSearch = (state, props) => getFromState(state,props.storeRoot, 'search')
export const getSortColumn = (state, props) => getFromState(state,props.storeRoot, 'sortColumn')
export const getSortDirection = (state, props) => getFromState(state,props.storeRoot, 'sortDirection')

function getFromState(state, root, attribute) {
  const storeRoot = state[root]
  if (storeRoot === undefined) {
    //eslint-disable-next-line no-console
    console.error(`store root '${root}' does not exist`)
  }
  return storeRoot[attribute]
}

export const INITIAL_STATE = {
  items: [],
  itemsPerPage: Actions.PAGE_SIZES.DEFAULT,
  page: 1,
  search: '',
  sortColumn: undefined,
  sortDirection: Actions.SORT_DIRECTION_ASCENDING,
  status: Actions.REQUEST_STATUS.INCEPTION,
  putStatus: undefined,
  putErrorMsg: '',
  postStatus: undefined,
  postStatusCode: undefined,
  postErrorMsg: '',
  pendingActions: [],
  clientSideFilters: undefined,
}


export const secondaryHeader = (state = {title: '', tabs: [], breadcrumbItems: [], links: []}, action) => {
  switch (action.type) {
  case Actions.SECONDARY_HEADER_UPDATE:
    return Object.assign({}, state, {
      title: action.title,
      tabs: action.tabs,
      breadcrumbItems: action.breadcrumbItems,
      links: action.links
    })
  default:
    return state
  }
}


export const resourceReducerFunction = (state = INITIAL_STATE, action) => {

  let items,index
  switch (action.type) {
  case Actions.RESOURCE_REQUEST:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.IN_PROGRESS
    })
  case Actions.RESOURCE_RECEIVE_SUCCESS:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.DONE,
      items: action.items,
      page: action.items.length === 0 ? 1 : action.items.length > state.itemsPerPage * (state.page - 1) ? state.page : state.page - 1,
      resourceVersion: action.resourceVersion
    })
  case Actions.RESOURCE_RECEIVE_FAILURE:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.ERROR,
      err: action.err
    })
  case Actions.POST_REQUEST:
    return Object.assign({}, state, {
      postStatus: Actions.REQUEST_STATUS.IN_PROGRESS
    })
  case Actions.POST_RECEIVE_SUCCESS:
    items = state.items.slice(0)
    if (action.item.length > 0) { // if returned as an array due to making async calls, push action.item elements to the items array
      action.item.forEach(el => {
        items.push(el)
      })
    } else {
      items.push(action.item)
    }
    return Object.assign({}, state, {
      items: items,
      postStatus: Actions.REQUEST_STATUS.DONE
    })
  case Actions.POST_RECEIVE_FAILURE:
    return Object.assign({}, state, {
      postStatus: Actions.REQUEST_STATUS.ERROR,
      postStatusCode: action.err.error && action.err.error.response && action.err.error.response.status,
      postErrorMsg: action.err.error && action.err.error.message
    })
  case Actions.PUT_REQUEST:
    return Object.assign({}, state, {
      putStatus: Actions.REQUEST_STATUS.IN_PROGRESS
    })
  case Actions.PUT_RECEIVE_SUCCESS:
    return Object.assign({}, state, {
      putStatus: Actions.REQUEST_STATUS.DONE,
    })
  case Actions.PUT_RECEIVE_FAILURE:
    return Object.assign({}, state, {
      putStatus: Actions.REQUEST_STATUS.ERROR,
      putErrorMsg: action.err.error ? action.err.error.message : action.err.message
    })
  case Actions.RESOURCE_MUTATE:
    return Object.assign({}, state, {
      mutateStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
      mutateErrorMsg: null,
      pendingActions: [...state.pendingActions, { name: action.resourceName, action: Actions.RESOURCE_MUTATE }]
    })
  case Actions.RESOURCE_MUTATE_FAILURE:
    return Object.assign({}, state, {
      mutateStatus: Actions.REQUEST_STATUS.ERROR,
      mutateErrorMsg: action.err.message || action.err.error && (action.err.error.message ||
        (action.err.error.data && action.err.error.data.Message)),
      pendingActions: state.pendingActions.filter(r => r && r.name !== action.resourceName),
    })
  case Actions.RESOURCE_MUTATE_SUCCESS:
    return Object.assign({}, state, {
      mutateStatus: Actions.REQUEST_STATUS.DONE,
      pendingActions: state.pendingActions.filter(r => r && r.name !== action.resourceName),
    })
  case Actions.RESOURCE_DELETE:
    items = [...state.items]
    index = lodash.findIndex(items, o => lodash.get(o, 'metadata.uid') === lodash.get(action, 'item.metadata.uid'))
    if(index > -1) {
      items.splice(index, 1)
      return Object.assign({}, state, {
        items: items
      })
    }
    return state
  default:
    return state
  }
}

/**
 * A common higher order reducer for resources
 * Follows the Redux pattern described here: http://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html#customizing-behavior-with-higher-order-reducers
 * **/
export const createResourceReducer = (reducerFunction, reducerPredicate) => {
  return (state, action) => {
    const isInitializationCall = state === undefined
    const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall
    return shouldRunWrappedReducer ? reducerFunction(state, action) : state
  }
}
