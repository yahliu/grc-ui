/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import gql from 'graphql-tag'

export const GET_POLICIES_QUERY = gql`
query getPolicies {
  items: policies {
    metadata {
      name
      namespace
    }
    status
    enforcement
  }
}
`

export const GET_POLICY_QUERY = gql`
query getPolicies($name: String!, $clusterName: String) {
  policies: policies(name: $name, clusterName: $clusterName) {
    cluster
    metadata {
      name
      namespace
      selfLink
      creationTimestamp
      annotations
      resourceVersion
      uid
    }
    status
    enforcement
    detail {
      exclude_namespace
      include_namespace
    }
    raw
    roleTemplates {
      name
      lastTransition
      complianceType
      apiVersion
      status
      raw
    }
    roleBindingTemplates {
      name
      lastTransition
      complianceType
      apiVersion
      status
      raw
    }
    objectTemplates {
      name
      kind
      lastTransition
      complianceType
      apiVersion
      status
      raw
    }
    violations {
      name
      cluster
      status
      message
      reason
      selector
    }
    rules {
      complianceType
      templateType
      ruleUID
      verbs
      apiGroups
      resources
    }
  }
}
`

export const GET_COMPLIANCES_QUERY = gql`
query getCompliances {
  items: compliances {
    metadata {
      name
      namespace
      selfLink
      annotations
      resourceVersion
    }
    name
    namespace
    raw
    remediation
    policyCompliant
    clusterCompliant
    placementPolicies {
      metadata {
        name
        selfLink
      }
    }
    placementBindings {
      metadata {
        name
        selfLink
      }
    }
  }
}
`

export const GET_COMPLIANCE_QUERY = gql`
query getSingleCompliance($name: String!, $namespace: String) {
  items: compliances(name: $name, namespace: $namespace) {
    raw
    metadata {
      creationTimestamp
      name
      namespace
      resourceVersion
      selfLink
      uid
    }
    placementPolicies {
      metadata {
        annotations
        name
        namespace
        creationTimestamp
        selfLink
      }
      clusterLabels
      clusterReplicas
      resourceSelector
      status
      raw
    }
    placementBindings {
      metadata {
        name
        namespace
        creationTimestamp
        selfLink
      }
      placementRef {
        name
        kind
      }
      subjects {
        name
        kind
      }
    }
    complianceStatus {
      clusterNamespace
      localCompliantStatus
      localValidStatus
    }
    compliancePolicy {
      name
      status
      complianceName
      complianceNamespace
      complianceSelfLink
      roleTemplates {
        apiVersion
        complianceType
        compliant
        lastTransition
        name
        kind
        validity
        raw
      }
      roleBindingTemplates {
        apiVersion
        complianceType
        compliant
        lastTransition
        name
        kind
        validity
        raw
      }
      objectTemplates {
        apiVersion
        complianceType
        compliant
        lastTransition
        name
        kind
        validity
        raw
      }
      detail
      raw
    }
    compliancePolicies {
      name
      clusterCompliant
      clusterNotCompliant
      complianceName
      complianceNamespace
      policies {
        name
        cluster
        compliant
        complianceName
        complianceNamespace
        valid
        enforcement
        status
        raw
        metadata {
          annotations
          creationTimestamp
          name
          resourceVersion
          selfLink
          uid
        }
        roleTemplates {
          name
          lastTransition
          complianceType
          apiVersion
          compliant
          raw
        }
        roleBindingTemplates {
          name
          lastTransition
          complianceType
          apiVersion
          compliant
          raw
        }
        objectTemplates {
          name
          lastTransition
          complianceType
          apiVersion
          compliant
          kind
          raw
        }
        rules {
          complianceType
          templateType
          ruleUID
          apiGroups
          verbs
          resources
        }
        violations {
          name
          cluster
          status
          message
          reason
          selector
        }
      }
    }
    policyCompliant
    clusterCompliant
  }
}
`
