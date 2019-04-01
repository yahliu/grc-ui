/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { withRouter } from 'react-router-dom'
import { typedResourcePageFromParent } from '../../components/common/ResourcePage'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'

export default withRouter(typedResourcePageFromParent(RESOURCE_TYPES.HCM_POLICIES_PRE_CLUSTER))
