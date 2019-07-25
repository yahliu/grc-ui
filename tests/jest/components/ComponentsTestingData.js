/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */

export const policiesViewItem = [
  {
    'metadata': {
      'name': 'my-policy',
      'namespace': 'mcm',
      'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/my-policy',
      'annotations': {
        'policy.mcm.ibm.com/categories': '',
        'policy.mcm.ibm.com/controls': '',
        'policy.mcm.ibm.com/standards': '',
        'seed-generation': '1'
      },
      'resourceVersion': '1347399',
      '__typename': 'Metadata'
    },
    'name': 'my-policy',
    'namespace': 'mcm',
    'raw': {
      'apiVersion': 'policy.mcm.ibm.com/v1alpha1',
      'kind': 'Policy',
      'metadata': {
        'annotations': {
          'policy.mcm.ibm.com/categories': '',
          'policy.mcm.ibm.com/controls': '',
          'policy.mcm.ibm.com/standards': '',
          'seed-generation': '1'
        },
        'creationTimestamp': '2019-07-21T15:53:58Z',
        'finalizers': [
          'propagator.finalizer.mcm.ibm.com'
        ],
        'generation': 55,
        'name': 'my-policy',
        'namespace': 'mcm',
        'resourceVersion': '1347399',
        'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/my-policy',
        'uid': 'c049ec0d-abcf-11e9-8a41-005056a061f1'
      },
      'spec': {
        'complianceType': 'musthave',
        'namespaces': {
          'exclude': [
            'kube-*'
          ],
          'include': [
            'default'
          ]
        },
        'object-templates': [
          {
            'complianceType': 'musthave',
            'objectDefinition': {
              'apiVersion': 'rbac.authorization.k8s.io/v1',
              'kind': 'RoleBinding',
              'metadata': {
                'name': 'operate-pods-rolebinding'
              },
              'roleRef': {
                'apiGroup': 'rbac.authorization.k8s.io',
                'kind': 'Role',
                'name': 'operator'
              },
              'subjects': [
                {
                  'apiGroup': 'rbac.authorization.k8s.io',
                  'kind': 'User',
                  'name': 'admin'
                }
              ]
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
          'binding-my-policy'
        ],
        'placementPolicies': [
          'placement-my-policy'
        ],
        'status': {
          'cluster1': {
            'aggregatePoliciesStatus': {
              'my-policy': {
                'compliant': 'Compliant'
              }
            },
            'clustername': 'cluster1',
            'compliant': 'Compliant'
          },
          'clusterhub': {
            'aggregatePoliciesStatus': {
              'my-policy': {
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
    'policyCompliant': '0/2',
    'clusterCompliant': '0/2',
    'placementPolicies': [
      {
        'metadata': {
          'name': 'placement-my-policy',
          'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementpolicies/placement-my-policy',
          '__typename': 'Metadata'
        },
        '__typename': 'PlacementPolicy'
      }
    ],
    'placementBindings': [
      {
        'metadata': {
          'name': 'binding-my-policy',
          'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementbindings/binding-my-policy',
          '__typename': 'Metadata'
        },
        '__typename': 'PlacementBinding'
      }
    ],
    '__typename': 'Compliance'
  },
  {
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
    '__typename': 'Compliance'
  },
  {
    'metadata': {
      'name': 'policy-pod',
      'namespace': 'mcm',
      'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-pod',
      'annotations': {
        'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity',
        'policy.mcm.ibm.com/controls': 'MutationAdvisor,CertificateManager',
        'policy.mcm.ibm.com/standards': 'NIST,HIPAA',
        'seed-generation': '1'
      },
      'resourceVersion': '1257026',
      '__typename': 'Metadata'
    },
    'name': 'policy-pod',
    'namespace': 'mcm',
    'raw': {
      'apiVersion': 'policy.mcm.ibm.com/v1alpha1',
      'kind': 'Policy',
      'metadata': {
        'annotations': {
          'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity',
          'policy.mcm.ibm.com/controls': 'MutationAdvisor,CertificateManager',
          'policy.mcm.ibm.com/standards': 'NIST,HIPAA',
          'seed-generation': '1'
        },
        'creationTimestamp': '2019-07-16T13:16:46Z',
        'finalizers': [
          'propagator.finalizer.mcm.ibm.com'
        ],
        'generation': 19,
        'name': 'policy-pod',
        'namespace': 'mcm',
        'resourceVersion': '1257026',
        'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-pod',
        'uid': 'f61a25eb-a7cb-11e9-8a41-005056a061f1'
      },
      'spec': {
        'complianceType': 'musthave',
        'namespaces': {
          'exclude': [
            'kube*'
          ],
          'include': [
            'default'
          ]
        },
        'object-templates': [
          {
            'complianceType': 'musthave',
            'objectDefinition': {
              'apiVersion': 'v1',
              'kind': 'Pod',
              'metadata': {
                'name': 'nginx-pod'
              },
              'spec': {
                'containers': [
                  {
                    'image': 'nginx:1.7.9',
                    'name': 'nginx',
                    'ports': [
                      {
                        'containerPort': 80
                      }
                    ]
                  }
                ]
              }
            },
            'status': {
              'Validity': {}
            }
          }
        ],
        'remediationAction': 'inform'
      },
      'status': {
        'placementBindings': [
          'binding-pod'
        ],
        'placementPolicies': [
          'placement-pod'
        ],
        'status': {
          'cluster1': {
            'aggregatePoliciesStatus': {
              'policy-pod': {
                'compliant': 'Compliant'
              }
            },
            'clustername': 'cluster1',
            'compliant': 'Compliant'
          },
          'clusterhub': {
            'aggregatePoliciesStatus': {
              'policy-pod': {
                'compliant': 'NonCompliant'
              }
            },
            'clustername': 'clusterhub',
            'compliant': 'NonCompliant'
          }
        }
      }
    },
    'remediation': 'inform',
    'policyCompliant': '1/2',
    'clusterCompliant': '1/2',
    'placementPolicies': [
      {
        'metadata': {
          'name': 'placement-pod',
          'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementpolicies/placement-pod',
          '__typename': 'Metadata'
        },
        '__typename': 'PlacementPolicy'
      }
    ],
    'placementBindings': [
      {
        'metadata': {
          'name': 'binding-pod',
          'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementbindings/binding-pod',
          '__typename': 'Metadata'
        },
        '__typename': 'PlacementBinding'
      }
    ],
    '__typename': 'Compliance'
  },
  {
    'metadata': {
      'name': 'policy-role',
      'namespace': 'mcm',
      'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-role',
      'annotations': {
        'kubectl.kubernetes.io/last-applied-configuration': '{"apiVersion":"policy.mcm.ibm.com/v1alpha1","kind":"Policy","metadata":{"annotations":{"policy.mcm.ibm.com/categories":"SystemAndCommunicationsProtections,SystemAndInformationIntegrity","policy.mcm.ibm.com/controls":"MutationAdvisor,VA","policy.mcm.ibm.com/standards":"NIST,HIPAA"},"name":"policy-role","namespace":"mcm"},"spec":{"namespaces":{"exclude":["kube*"],"include":["default"]},"remediationAction":"inform","role-templates":[{"apiVersion":"roletemplate.mcm.ibm.com/v1alpha1","complianceType":"musthave","metadata":{"name":"operator-role-policy","namespace":""},"rules":[{"complianceType":"musthave","policyRule":{"apiGroups":["extensions","apps"],"resources":["deployments"],"verbs":["get","list","watch","create","delete","patch"]}}],"selector":{"matchLabels":{"dev":"true"}}}]}}\n',
        'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity',
        'policy.mcm.ibm.com/controls': 'MutationAdvisor,VA',
        'policy.mcm.ibm.com/standards': 'NIST,HIPAA',
        'seed-generation': '1'
      },
      'resourceVersion': '1201118',
      '__typename': 'Metadata'
    },
    'name': 'policy-role',
    'namespace': 'mcm',
    'raw': {
      'apiVersion': 'policy.mcm.ibm.com/v1alpha1',
      'kind': 'Policy',
      'metadata': {
        'annotations': {
          'kubectl.kubernetes.io/last-applied-configuration': '{"apiVersion":"policy.mcm.ibm.com/v1alpha1","kind":"Policy","metadata":{"annotations":{"policy.mcm.ibm.com/categories":"SystemAndCommunicationsProtections,SystemAndInformationIntegrity","policy.mcm.ibm.com/controls":"MutationAdvisor,VA","policy.mcm.ibm.com/standards":"NIST,HIPAA"},"name":"policy-role","namespace":"mcm"},"spec":{"namespaces":{"exclude":["kube*"],"include":["default"]},"remediationAction":"inform","role-templates":[{"apiVersion":"roletemplate.mcm.ibm.com/v1alpha1","complianceType":"musthave","metadata":{"name":"operator-role-policy","namespace":""},"rules":[{"complianceType":"musthave","policyRule":{"apiGroups":["extensions","apps"],"resources":["deployments"],"verbs":["get","list","watch","create","delete","patch"]}}],"selector":{"matchLabels":{"dev":"true"}}}]}}\n',
          'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity',
          'policy.mcm.ibm.com/controls': 'MutationAdvisor,VA',
          'policy.mcm.ibm.com/standards': 'NIST,HIPAA',
          'seed-generation': '1'
        },
        'creationTimestamp': '2019-07-16T13:19:03Z',
        'finalizers': [
          'propagator.finalizer.mcm.ibm.com'
        ],
        'generation': 16,
        'name': 'policy-role',
        'namespace': 'mcm',
        'resourceVersion': '1201118',
        'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-role',
        'uid': '47dbc091-a7cc-11e9-8a41-005056a061f1'
      },
      'spec': {
        'namespaces': {
          'exclude': [
            'kube*'
          ],
          'include': [
            'default'
          ]
        },
        'remediationAction': 'inform',
        'role-templates': [
          {
            'apiVersion': 'roletemplate.mcm.ibm.com/v1alpha1',
            'complianceType': 'musthave',
            'metadata': {
              'creationTimestamp': null,
              'name': 'operator-role-policy'
            },
            'rules': [
              {
                'complianceType': 'musthave',
                'policyRule': {
                  'apiGroups': [
                    'extensions',
                    'apps'
                  ],
                  'resources': [
                    'deployments'
                  ],
                  'verbs': [
                    'get',
                    'list',
                    'watch',
                    'create',
                    'delete',
                    'patch'
                  ]
                }
              }
            ],
            'selector': {
              'matchLabels': {
                'dev': 'true'
              }
            },
            'status': {
              'Validity': {}
            }
          }
        ]
      },
      'status': {
        'placementBindings': [
          'binding-role'
        ],
        'placementPolicies': [
          'placement-role'
        ],
        'status': {
          'cluster1': {
            'aggregatePoliciesStatus': {
              'policy-role': {
                'compliant': 'Compliant'
              }
            },
            'clustername': 'cluster1',
            'compliant': 'Compliant'
          },
          'clusterhub': {
            'aggregatePoliciesStatus': {
              'policy-role': {
                'compliant': 'NonCompliant'
              }
            },
            'clustername': 'clusterhub',
            'compliant': 'NonCompliant'
          }
        }
      }
    },
    'remediation': 'inform',
    'policyCompliant': '1/2',
    'clusterCompliant': '1/2',
    'placementPolicies': [
      {
        'metadata': {
          'name': 'placement-role',
          'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementpolicies/placement-role',
          '__typename': 'Metadata'
        },
        '__typename': 'PlacementPolicy'
      }
    ],
    'placementBindings': [
      {
        'metadata': {
          'name': 'binding-role',
          'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementbindings/binding-role',
          '__typename': 'Metadata'
        },
        '__typename': 'PlacementBinding'
      }
    ],
    '__typename': 'Compliance'
  }
]


export const policiesViewRefreshControl = {
  'reloading': false,
  'refreshCookie': 'policy-refresh-interval-cookie',
  'timestamp': 'Tue Jul 23 2019 01:13:42 GMT-0400 (Eastern Daylight Time)'
}


export const policiesViewSecondaryHeaderProps =  {
  'title': 'routes.grc',
  'information': 'policy.header.tooltip',
  'links': [
    {
      'id': 'create-policy',
      'label': 'button.create.policy',
      'url': '/multicloud/policies/create'
    }
  ],
  'tabs': [
    {
      'id': 'policy-overview',
      'label': 'tabs.policy.overview',
      'url': '/multicloud/policies',
      'index': 0
    },
    {
      'id': 'policy-all',
      'label': 'tabs.policy.all',
      'url': '/multicloud/policies/all',
      'index': 1
    },
    {
      'id': 'policy-findings',
      'label': 'tabs.policy.findings',
      'url': '/multicloud/policies/findings',
      'index': 2
    }
  ]
}
