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
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'
import CreateResourceModal from '../../components/modals/CreateResourceModal'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'

const createDocLink = (locale, handleCreateResource) => {
  const vNumber = config['ICP_VERSION']
  const createComplianceModal = <CreateResourceModal
    key='createPolicy'
    headingTextKey='actions.create.policy'
    submitBtnTextKey='actions.create.policy'
    onCreateResource={ handleCreateResource }
    resourceDescriptionKey='modal.createresource.policy'
  />

  const modal = React.cloneElement(createComplianceModal, { resourceType: RESOURCE_TYPES.HCM_POLICIES })

  return (
    <div className={'button-group'}>
      {[modal]}
      <div className={'buttons'}>
        <button className={'bx--btn bx--btn--sm bx--btn--secondary'}>
          <a href={`https://www${config['env']==='development' ? '-03preprod': ''}.ibm.com/support/knowledgecenter/SSBS6K_${vNumber}/mcm/compliance/compliance_intro.html`} className={'doc-link'} target='doc' aria-describedby='launchWindow'>{msgs.get('button.view.doc', locale)}</a>
        </button>
      </div>
    </div>
  )
}

export default createDocLink
