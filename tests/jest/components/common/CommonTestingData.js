/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */

export const policies = [
  {
    'metadata': {
      'name': 'my-policy-test',
      'namespace': 'mcm',
      'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/my-policy-test',
      'annotations': {
        'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections',
        'policy.mcm.ibm.com/controls': 'VA',
        'policy.mcm.ibm.com/standards': 'BSA',
        'seed-generation': '1'
      },
      'resourceVersion': '1524346',
      '__typename': 'Metadata'
    },
    'name': 'my-policy-test',
    'namespace': 'mcm',
    'raw': {
      'apiVersion': 'policy.mcm.ibm.com/v1alpha1',
      'kind': 'Policy',
      'metadata': {
        'annotations': {
          'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections',
          'policy.mcm.ibm.com/controls': 'VA',
          'policy.mcm.ibm.com/standards': 'BSA',
          'seed-generation': '1'
        },
        'creationTimestamp': '2019-07-23T21:12:04Z',
        'finalizers': [
          'propagator.finalizer.mcm.ibm.com'
        ],
        'generation': 7,
        'name': 'my-policy-test',
        'namespace': 'mcm',
        'resourceVersion': '1524346',
        'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/my-policy-test',
        'uid': '85840587-ad8e-11e9-8a41-005056a061f1'
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
          'binding-my-policy-test'
        ],
        'placementPolicies': [
          'placement-my-policy-test'
        ],
        'status': {
          'cluster1': {
            'aggregatePoliciesStatus': {
              'my-policy-test': {
                'compliant': 'Compliant'
              }
            },
            'clustername': 'cluster1',
            'compliant': 'Compliant'
          },
          'clusterhub': {
            'aggregatePoliciesStatus': {
              'my-policy-test': {
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
          'name': 'placement-my-policy-test',
          'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementpolicies/placement-my-policy-test',
          '__typename': 'Metadata'
        },
        '__typename': 'PlacementPolicy'
      }
    ],
    'placementBindings': [
      {
        'metadata': {
          'name': 'binding-my-policy-test',
          'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementbindings/binding-my-policy-test',
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
      'resourceVersion': '1524369',
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
        'generation': 20,
        'name': 'policy-pod',
        'namespace': 'mcm',
        'resourceVersion': '1524369',
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
                'compliant': 'Compliant'
              }
            },
            'clustername': 'clusterhub',
            'compliant': 'Compliant'
          }
        }
      }
    },
    'remediation': 'inform',
    'policyCompliant': '0/2',
    'clusterCompliant': '0/2',
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
      'resourceVersion': '1513562',
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
        'generation': 17,
        'name': 'policy-role',
        'namespace': 'mcm',
        'resourceVersion': '1513562',
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
                'compliant': 'Compliant'
              }
            },
            'clustername': 'clusterhub',
            'compliant': 'Compliant'
          }
        }
      }
    },
    'remediation': 'inform',
    'policyCompliant': '0/2',
    'clusterCompliant': '0/2',
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

export const policiesClusters = [
  {
    'cluster': 'cluster1',
    'namespace': 'mcm',
    'violation': '1/4',
    'nonCompliant': [
      'policy-ma'
    ]
  },
  {
    'cluster': 'clusterhub',
    'namespace': 'mcm',
    'violation': '0/4',
    'nonCompliant': []
  }
]

export const findings = [
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-7a6dcc86-c742-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'LOW',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566742364066-policy-test',
      'resourceId': '7a6dcc86-c742-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-77a883dc-c6bb-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'clusterhub',
      'resourceType': 'Policy',
      'resourceName': '1566684377115-policy-test',
      'resourceId': '77a883dc-c6bb-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'clusterhub',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-77a883dc-c6bb-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566684377115-policy-test',
      'resourceId': '77a883dc-c6bb-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-48595041-c5ab-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'LOW',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'clusterhub',
      'resourceType': 'Policy',
      'resourceName': '1566567482876-policy-test',
      'resourceId': '48595041-c5ab-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'clusterhub',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-48595041-c5ab-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566567482876-policy-test',
      'resourceId': '48595041-c5ab-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-11f8f455-c5ab-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'clusterhub',
      'resourceType': 'Policy',
      'resourceName': '1566567391716-policy-test',
      'resourceId': '11f8f455-c5ab-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'clusterhub',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-11f8f455-c5ab-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566567391716-policy-test',
      'resourceId': '11f8f455-c5ab-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-d55a4608-c5aa-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'clusterhub',
      'resourceType': 'Policy',
      'resourceName': '1566567286588-policy-test',
      'resourceId': 'd55a4608-c5aa-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'clusterhub',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-d55a4608-c5aa-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566567286588-policy-test',
      'resourceId': 'd55a4608-c5aa-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-da004294-c5aa-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566567294339-policy-test',
      'resourceId': 'da004294-c5aa-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-c798e46b-c5aa-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566567264757-policy-test',
      'resourceId': 'c798e46b-c5aa-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-9373aa2e-c517-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566504039600-policy-test',
      'resourceId': '9373aa2e-c517-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-e0d42c54-c4f6-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566489996328-policy-test',
      'resourceId': 'e0d42c54-c4f6-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-869f2131-c4f3-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'clusterhub',
      'resourceType': 'Policy',
      'resourceName': '1566488554311-policy-test',
      'resourceId': '869f2131-c4f3-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'clusterhub',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-869f2131-c4f3-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566488554311-policy-test',
      'resourceId': '869f2131-c4f3-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-d8d9ab31-c4f0-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'LOW',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'clusterhub',
      'resourceType': 'Policy',
      'resourceName': '1566487408129-policy-test',
      'resourceId': 'd8d9ab31-c4f0-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'clusterhub',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-122d672e-c4e9-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'clusterhub',
      'resourceType': 'Policy',
      'resourceName': '1566484061272-policy-test',
      'resourceId': '122d672e-c4e9-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'clusterhub',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-122d672e-c4e9-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'LOW',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566484061272-policy-test',
      'resourceId': '122d672e-c4e9-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-c4ed8659-c4e8-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566483933161-policy-test',
      'resourceId': 'c4ed8659-c4e8-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-d5fdd274-c4dd-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566479239297-policy-test',
      'resourceId': 'd5fdd274-c4dd-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-d5fdd274-c4dd-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'clusterhub',
      'resourceType': 'Policy',
      'resourceName': '1566479239297-policy-test',
      'resourceId': 'd5fdd274-c4dd-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'clusterhub',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  },
  {
    'name': 'id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-3abdde68-c386-11e9-a4d4-005056a061f1',
    'shortDescription': 'Policy that is not compliant',
    'finding': {
      'severity': 'HIGH',
      'certainty': 'HIGH',
      'networkConnection': null,
      'nextSteps': [
        {
          'title': 'View the details for the compliance problem in the occurrence of the findings.',
          'url': null
        }
      ],
      'dataTransferred': null
    },
    'reportedBy': {
      'id': 'mcm-policy-adapter',
      'title': 'Security Advisor MCM Policy Findings Adapter',
      'url': null
    },
    'context': {
      'accountId': 'id-mycluster-account',
      'region': 'cluster1',
      'resourceType': 'Policy',
      'resourceName': '1566331664952-policy-test',
      'resourceId': '3abdde68-c386-11e9-a4d4-005056a061f1',
      'resourceCrn': null,
      'serviceName': 'security-advisor',
      'serviceCrn': null,
      'clusterName': 'cluster1',
      'namespaceName': 'Excludes: [kube-*], Includes: [default]'
    },
    'securityClassification': {
      'securityStandards': [
        'NIST'
      ],
      'securityCategories': [
        'SystemAndInformationIntegrity'
      ],
      'securityControl': 'VA'
    },
    '__typename': 'Occurrence'
  }
]

export const findingsClusters = [
  {
    'cluster': 'cluster1',
    'namespace': 'Excludes: [kube-*], Includes: [default]',
    'severity': '12/14',
    'highSeverity': {
      'Policy that is not compliant': 12
    }
  },
  {
    'cluster': 'clusterhub',
    'namespace': 'Excludes: [kube-*], Includes: [default]',
    'severity': '7/8',
    'highSeverity': {
      'Policy that is not compliant': 7
    }
  }
]
