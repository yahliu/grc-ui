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

export const HCMClusterList = gql`
  query getClusters {
    items: clusters {
      metadata {
        labels
        name
        namespace
        uid
        selfLink
      }
      nodes
      status
      clusterip
      consoleURL
      totalMemory
      totalStorage
      totalCPU
      klusterletVersion
      k8sVersion
    }
  }
`

export const HCMNodeList = gql`
  query getNodes {
    items: nodes {
      architecture
      capacity {
        cpu
      }
      cluster {
        metadata {
          name
        }
      }
      metadata {
        creationTimestamp
        labels
        name
      }
      osImage
      roles
    }
  }
`

export const HCMApplication = gql`
  query getApplications($name: String!, $namespace: String!) {
    items: applications(name: $name, namespace: $namespace) {
      dashboard
      metadata {
        annotations
        creationTimestamp
        labels
        name
        namespace
        resourceVersion
        selfLink
        uid
      }
      applicationRelationships {
        destination {
          kind
          name
        }
        metadata {
          annotations
          creationTimestamp
          labels
          name
          namespace
          resourceVersion
          selfLink
          status
          uid
        }
        raw
        source {
          kind
          name
        }
        type
      }
      applicationWorks {
        metadata {
          name
          namespace
          creationTimestamp
          labels
          selfLink
        }
        release
        status
        reason
        cluster
        result {
          chartName
          chartVersion
          chartURL
          namespace
          kubeKind
          kubeName
          kubeCluster
          description
          firstDeployed
          lastDeployed
          status
          version
        }
      }
      deployables {
        dependencies {
          kind
          name
        }
        deployer {
          chartName
          namespace
          repository
          version
          chartURL
          kubeKind
          kubeName
        }
        metadata {
          name
          namespace
          creationTimestamp
        }
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
        raw
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
      raw
      selector
    }
  }
`

export const createPolicy = gql`
  mutation createPolicy($resources: [JSON]!) {
    createPolicy(resources: $resources)
  }
`

export const createCompliance = gql`
  mutation createCompliance($resources: [JSON]!) {
    createCompliance(resources: $resources)
  }
`

export const createApplication = gql`
  mutation createApplication($resources: [JSON]!) {
    createApplication(resources: $resources)
  }
`

export const createResources = gql`
  mutation createResources($resources: [JSON]!) {
    createResources(resources: $resources)
  }
`

export const updateResourceLabels = gql`
  mutation updateResourceLabels($resourceType: String!, $namespace: String!, $name: String!, $body: JSON, $selfLink: String, $resourcePath: String) {
    updateResourceLabels(resourceType: $resourceType, namespace: $namespace, name: $name, body: $body, selfLink: $selfLink, resourcePath: $resourcePath)
  }
`

export const removeQuery = gql`
  mutation deleteQuery($resource: JSON!) {
    deleteQuery(resource: $resource)
  }
`

export const updateResource = gql`
  mutation updateResource($resourceType: String!, $namespace: String!, $name: String!, $body: JSON, $selfLink: String, $resourcePath: String) {
    updateResource(resourceType: $resourceType, namespace: $namespace, name: $name, body: $body, selfLink: $selfLink, resourcePath: $resourcePath)
  }
`

export const deleteCompliance = gql`
  mutation deleteCompliance($selfLink: String!, $resources: JSON) {
    deleteCompliance(selfLink: $selfLink, resources: $resources)
  }
`

export const HCMSetRepository = gql`
    mutation setRepo($repo: HelmRepoInput){
      setHelmRepo(input: $repo){
        Name
        URL
    }
  }
`

export const HCMInstallHelmChart = gql`
  mutation installHelmChart($input: InstallHelmChartInput){
    installHelmChart(input: $input) {
      Status: status
      code
      message
    }
  }
`

// export const HCMTopologyFilters = gql`
//   query getTopologyFilters {
//     clusters {
//       metadata {
//         name
//         labels
//       }
//     }
//     namespaces {
//       metadata {
//         name
//       }
//     }
//     labels {
//       name
//       value
//     }
//     resourceTypes
//   }
// `

// export const HCMTopology = gql`
//   query getTopology ($filter: Filter) {
//     topology (filter: $filter) {
//       resources {
//         id
//         uid
//         name
//         cluster
//         type
//         namespace
//         topology
//         labels {
//           name
//           value
//         }
//       }
//       relationships {
//         type
//         to {
//           uid
//         }
//         from {
//           uid
//         }
//       }
//     }
//   }
// `

export const HCMPolicyList = gql`
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

export const HCMPolicy = gql`
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
      policyTemplates {
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

export const HCMPolicyViolations = gql`
  query getPolicyViolations($policyName: String!) {
    violations: violationsInPolicy(policy: $policyName) {
      cluster
      message
      name
      reason
      selector
      status
    }
  }
`

export const HCMComplianceList = gql`
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

export const HCMCompliance = gql`
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
        annotations
      }
      annotations
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
        raw
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
        policyTemplates {
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
      clusters
    }
  }
`

export const createUserQueries = gql`
  mutation saveQuery($resource: JSON!) {
    saveQuery(resource: $resource)
  }
`

export const getLogs = gql`
  query getLogs($containerName: String!, $podName: String!, $podNamespace: String!, $clusterName: String!){
    logs(containerName: $containerName, podName: $podName, podNamespace: $podNamespace, clusterName: $clusterName)
  }
`
export const AllPoliciesInCluster = gql`
  query getAllPoliciesInCluster($cluster: String!) {
    items: policiesInCluster(cluster: $cluster) {
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
    }
  }
`


export const AllClustersInPolicy = gql`
  query getAllClusterInPolicy($policy: String!) {
    items: clustersInPolicy(policy: $policy) {
      name
      metadata {
        labels
        name
        namespace
        annotations
        uid
        selfLink
      }
      kind
      apiVersion
      spec
      status
      total
      violated
      policy
    }
  }
  `
