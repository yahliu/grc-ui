/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

/*
 * action types
 *
 * action name: <NOUN>_<VERB>
 */

export const DEL_RECEIVE_FAILURE = 'DEL_RECEIVE_FAILURE'
export const DEL_RECEIVE_SUCCESS = 'DEL_RECEIVE_SUCCESS'
export const DEL_REQUEST = 'DEL_REQUEST'
export const CLEAR_REQUEST_STATUS = 'CLEAR_REQUEST_STATUS'
export const MODAL_UPDATE = 'MODAL_UPDATE'
export const NAV_MODIFY = 'NAV_MODIFY'
export const NAV_RECEIVE_SUCCESS = 'NAV_RECEIVE_SUCCESS'
export const POST_RECEIVE_FAILURE = 'POST_RECEIVE_FAILURE'
export const POST_RECEIVE_SUCCESS = 'POST_RECEIVE_SUCCESS'
export const POST_REQUEST = 'POST_REQUEST'
export const PUT_RECEIVE_FAILURE = 'PUT_RECEIVE_FAILURE'
export const PUT_RECEIVE_SUCCESS = 'PUT_RECEIVE_SUCCESS'
export const PUT_REQUEST = 'PUT_REQUEST'
export const PATCH_RECEIVE_FAILURE = 'PATCH_RECEIVE_FAILURE'
export const PATCH_RECEIVE_SUCCESS = 'PATCH_RECEIVE_SUCCESS'
export const PATCH_REQUEST = 'PATCH_REQUEST'
export const RESOURCES_FETCH_REQUEST_LOADING = 'RESOURCE_FETCH_REQUEST_LOADING'
export const RESOURCES_FETCH_REQUEST_SUCCESS = 'RESOURCES_FETCH_REQUEST_SUCCESS'
export const RESOURCE_MUTATE = 'RESOURCE_MUTATE'
export const RESOURCE_MUTATE_FAILURE = 'RESOURCE_MUTATE_FAILURE'
export const RESOURCE_MUTATE_SUCCESS = 'RESOURCE_MUTATE_SUCCESS'
export const RESOURCE_RECEIVE_FAILURE = 'RESOURCE_RECEIVE_FAILURE'
export const RESOURCE_RECEIVE_SUCCESS = 'RESOURCE_RECEIVE_SUCCESS'
export const RESOURCE_FILTERS_RECEIVE_SUCCESS = 'RESOURCE_FILTERS_RECEIVE_SUCCESS'
export const RESOURCE_FILTERS_UPDATE = 'RESOURCE_FILTERS_UPDATE'
export const RESOURCE_REQUEST = 'RESOURCE_REQUEST'
export const USER_ACCESS_FAILURE = 'USER_ACCESS_FAILURE'
export const USER_ACCESS_SUCCESS = 'USER_ACCESS_SUCCESS'
export const SECONDARY_HEADER_UPDATE = 'SECONDARY_HEADER_UPDATE'
export const RESOURCE_TOOLBAR_UPDATE = 'RESOURCE_TOOLBAR_UPDATE'
export const ACTIVE_FILTER_UPDATE = 'ACTIVE_FILTER_UPDATE'
export const AVAILABLE_FILTER_UPDATE = 'AVAILABLE_FILTER_UPDATE'

/*
 * other constants specific to particular actions
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export const USER_LOGIN_STATUS = {
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT'
}

export const REQUEST_STATUS = {
  INCEPTION: 'INCEPTION',
  DONE: 'DONE',
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR'
}

export const PAGE_SIZES = {
  DEFAULT: 10,
  VALUES: [5, 10, 20, 50, 75, 100]
}

export const SORT_DIRECTION_ASCENDING = 'asc'
export const SORT_DIRECTION_DESCENDING = 'desc'
