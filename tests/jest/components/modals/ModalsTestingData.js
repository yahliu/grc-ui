/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */

export const sidePanelDetailsModalDataPolicies = {
  'kind': 'HCMPolicyPolicy',
  'metadata': {
    'name': 'policy-ma',
    'namespace': 'mcm',
    'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-ma',
    'annotations': {
      'kubectl.kubernetes.io/last-applied-configuration': '{"apiVersion":"policy.mcm.ibm.com/v1alpha1","kind":"Policy","metadata":{"annotations":{"policy.mcm.ibm.com/categories":"SystemAndInformationIntegrity","policy.mcm.ibm.com/controls":"MutationAdvisor","policy.mcm.ibm.com/standards":"NIST"},"name":"policy-ma","namespace":"mcm"},"spec":{"policy-templates":[{"objectDefinition":{"apiVersion":"policies.ibm.com/v1alpha1","kind":"MutationPolicy","metadata":{"label":{"category":"System-Integrity"},"name":"mutation-policy-example"},"spec":{"conditions":{"ownership":["ReplicaSet","Deployment","DeamonSet","ReplicationController"]},"namespaceSelector":{"exclude":["kube-system"],"include":["default","kube-*"]},"remediationAction":"enforce"}}}],"remediationAction":"enforce"}}\n',
      'policy.mcm.ibm.com/categories': 'SystemAndInformationIntegrity',
      'policy.mcm.ibm.com/controls': 'MutationAdvisor',
      'policy.mcm.ibm.com/standards': 'NIST',
      'seed-generation': '1'
    },
    'resourceVersion': '1347579',
    '__typename': 'Metadata'
  },
  'name': 'policy-ma',
  'namespace': 'mcm',
  'raw': {
    'apiVersion': 'policy.mcm.ibm.com/v1alpha1',
    'kind': 'Policy',
    'metadata': {
      'annotations': {
        'kubectl.kubernetes.io/last-applied-configuration': '{"apiVersion":"policy.mcm.ibm.com/v1alpha1","kind":"Policy","metadata":{"annotations":{"policy.mcm.ibm.com/categories":"SystemAndInformationIntegrity","policy.mcm.ibm.com/controls":"MutationAdvisor","policy.mcm.ibm.com/standards":"NIST"},"name":"policy-ma","namespace":"mcm"},"spec":{"policy-templates":[{"objectDefinition":{"apiVersion":"policies.ibm.com/v1alpha1","kind":"MutationPolicy","metadata":{"label":{"category":"System-Integrity"},"name":"mutation-policy-example"},"spec":{"conditions":{"ownership":["ReplicaSet","Deployment","DeamonSet","ReplicationController"]},"namespaceSelector":{"exclude":["kube-system"],"include":["default","kube-*"]},"remediationAction":"enforce"}}}],"remediationAction":"enforce"}}\n',
        'policy.mcm.ibm.com/categories': 'SystemAndInformationIntegrity',
        'policy.mcm.ibm.com/controls': 'MutationAdvisor',
        'policy.mcm.ibm.com/standards': 'NIST',
        'seed-generation': '1'
      },
      'creationTimestamp': '2019-07-16T13:18:48Z',
      'finalizers': [
        'propagator.finalizer.mcm.ibm.com'
      ],
      'generation': 45,
      'name': 'policy-ma',
      'namespace': 'mcm',
      'resourceVersion': '1347579',
      'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-ma',
      'uid': '3f218d45-a7cc-11e9-8a41-005056a061f1'
    },
    'spec': {
      'namespaces': {},
      'policy-templates': [
        {
          'objectDefinition': {
            'apiVersion': 'policies.ibm.com/v1alpha1',
            'kind': 'MutationPolicy',
            'metadata': {
              'label': {
                'category': 'System-Integrity'
              },
              'name': 'mutation-policy-example'
            },
            'spec': {
              'conditions': {
                'ownership': [
                  'ReplicaSet',
                  'Deployment',
                  'DeamonSet',
                  'ReplicationController'
                ]
              },
              'namespaceSelector': {
                'exclude': [
                  'kube-system'
                ],
                'include': [
                  'default',
                  'kube-*'
                ]
              },
              'remediationAction': 'enforce'
            }
          },
          'status': {
            'Validity': {}
          }
        }
      ],
      'remediationAction': 'enforce'
    },
    'status': {
      'placementBindings': [
        'binding-ma'
      ],
      'placementPolicies': [
        'placement-ma'
      ],
      'status': {
        'cluster1': {
          'aggregatePoliciesStatus': {
            'policy-ma': {
              'compliant': 'NonCompliant'
            }
          },
          'clustername': 'cluster1',
          'compliant': 'NonCompliant'
        },
        'clusterhub': {
          'aggregatePoliciesStatus': {
            'policy-ma': {
              'compliant': 'Compliant'
            }
          },
          'clustername': 'clusterhub',
          'compliant': 'Compliant'
        }
      }
    }
  },
  'remediation': 'enforce',
  'policyCompliant': '1/2',
  'clusterCompliant': '1/2',
  'placementPolicies': [
    {
      'metadata': {
        'name': 'placement-ma',
        'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementpolicies/placement-ma',
        '__typename': 'Metadata'
      },
      '__typename': 'PlacementPolicy'
    }
  ],
  'placementBindings': [
    {
      'metadata': {
        'name': 'binding-ma',
        'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementbindings/binding-ma',
        '__typename': 'Metadata'
      },
      '__typename': 'PlacementBinding'
    }
  ],
  '__typename': 'Compliance',
  'subItems': [
    {
      'name': 'policy.pb',
      'items': [
        'binding-ma'
      ]
    },
    {
      'name': 'policy.pp',
      'items': [
        'placement-ma'
      ]
    }
  ],
  'custom': {
    'metadata.name': {
      'key': null,
      'ref': null,
      'props': {
        'to': '/multicloud/policies/all/mcm/policy-ma',
        'children': 'policy-ma',
        'replace': false
      },
      '_owner': null,
      '_store': {}
    },
    'metadata.annotations["policy.mcm.ibm.com/standards"]': 'NIST',
    'metadata.annotations["policy.mcm.ibm.com/controls"]': 'Mutation Advisor',
    'metadata.annotations["policy.mcm.ibm.com/categories"]': 'System And Information Integrity'
  }
}

export const sidePanelDetailsModalResourceTypePolicies = {
  'name': 'HCMPolicyPolicy',
  'list': 'HCMPolicyPolicyList'
}

export const sidePanelDetailsModalDataClusters = {
  'kind': 'HCMPolicyCluster',
  'cluster': 'cluster1',
  'namespace': 'mcm',
  'violation': '1/4',
  'nonCompliant': [
    'policy-ma'
  ],
  'custom': {
    'nonCompliant': {
      'key': null,
      'ref': null,
      'props': {
        'text': 'policy-ma',
        'maxCharacters': 35
      },
      '_owner': null,
      '_store': {}
    }
  }
}

export const sidePanelDetailsModalResourceTypeClusters = {
  'name': 'HCMPolicyCluster',
  'list': 'HCMPolicyClusterList'
}
