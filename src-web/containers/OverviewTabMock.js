/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */

const getMockData = () => {


  const policies = [
    {
      'metadata': {
        'name': '1560400539073-policy-pod',
        'namespace': 'mcm',
        'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/1560400539073-policy-pod',
        'annotations': {
          'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity',
          'policy.mcm.ibm.com/controls': 'MutationAdvisor,VA',
          'policy.mcm.ibm.com/standards': 'NIST',
          'seed-generation': '2'
        },
        'resourceVersion': '3608294',
        '__typename': 'Metadata'
      },
      'name': '1560400539073-policy-pod',
      'namespace': 'mcm',
      'raw': {
        'apiVersion': 'policy.mcm.ibm.com/v1alpha1',
        'kind': 'Policy',
        'metadata': {
          'annotations': {
            'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity',
            'policy.mcm.ibm.com/controls': 'MutationAdvisor,VA',
            'policy.mcm.ibm.com/standards': 'NIST',
            'seed-generation': '2'
          },
          'creationTimestamp': '2019-06-13T04:36:06Z',
          'finalizers': [
            'propagator.finalizer.mcm.ibm.com'
          ],
          'generation': 6,
          'name': '1560400539073-policy-pod',
          'namespace': 'mcm',
          'resourceVersion': '3608294',
          'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/1560400539073-policy-pod',
          'uid': 'c270336f-8d94-11e9-983e-005056a061f1'
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
                  'name': 'nginx1'
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
            '1560400539073-placement-binding-test'
          ],
          'placementPolicies': [
            '1560400539073-placement-policy-test'
          ],
          'status': {
            'cluster1': {
              'aggregatePoliciesStatus': {
                '1560400539073-policy-pod': {
                  'compliant': 'NonCompliant'
                }
              },
              'clustername': 'cluster1',
              'compliant': 'NonCompliant'
            },
            'clusterhub': {
              'aggregatePoliciesStatus': {
                '1560400539073-policy-pod': {
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
      'policyCompliant': '2/2',
      'clusterCompliant': '2/2',
      'placementPolicies': [
        {
          'metadata': {
            'name': '1560400539073-placement-policy-test',
            'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementpolicies/1560400539073-placement-policy-test',
            '__typename': 'Metadata'
          },
          '__typename': 'PlacementPolicy'
        }
      ],
      'placementBindings': [
        {
          'metadata': {
            'name': '1560400539073-placement-binding-test',
            'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementbindings/1560400539073-placement-binding-test',
            '__typename': 'Metadata'
          },
          '__typename': 'PlacementBinding'
        }
      ],
      '__typename': 'Compliance'
    },
    {
      'metadata': {
        'name': '1560400627383-policy-pod',
        'namespace': 'mcm',
        'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/1560400627383-policy-pod',
        'annotations': {
          'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity',
          'policy.mcm.ibm.com/controls': 'MutationAdvisor,VA',
          'policy.mcm.ibm.com/standards': 'NIST',
          'seed-generation': '2'
        },
        'resourceVersion': '3608584',
        '__typename': 'Metadata'
      },
      'name': '1560400627383-policy-pod',
      'namespace': 'mcm',
      'raw': {
        'apiVersion': 'policy.mcm.ibm.com/v1alpha1',
        'kind': 'Policy',
        'metadata': {
          'annotations': {
            'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity',
            'policy.mcm.ibm.com/controls': 'MutationAdvisor,VA',
            'policy.mcm.ibm.com/standards': 'NIST',
            'seed-generation': '2'
          },
          'creationTimestamp': '2019-06-13T04:37:34Z',
          'finalizers': [
            'propagator.finalizer.mcm.ibm.com'
          ],
          'generation': 6,
          'name': '1560400627383-policy-pod',
          'namespace': 'mcm',
          'resourceVersion': '3608584',
          'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/1560400627383-policy-pod',
          'uid': 'f667b0a4-8d94-11e9-983e-005056a061f1'
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
                  'name': 'nginx1'
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
            '1560400627383-placement-binding-test'
          ],
          'placementPolicies': [
            '1560400627383-placement-policy-test'
          ],
          'status': {
            'cluster1': {
              'aggregatePoliciesStatus': {
                '1560400627383-policy-pod': {
                  'compliant': 'NonCompliant'
                }
              },
              'clustername': 'cluster1',
              'compliant': 'NonCompliant'
            },
            'clusterhub': {
              'aggregatePoliciesStatus': {
                '1560400627383-policy-pod': {
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
      'policyCompliant': '2/2',
      'clusterCompliant': '2/2',
      'placementPolicies': [
        {
          'metadata': {
            'name': '1560400627383-placement-policy-test',
            'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementpolicies/1560400627383-placement-policy-test',
            '__typename': 'Metadata'
          },
          '__typename': 'PlacementPolicy'
        }
      ],
      'placementBindings': [
        {
          'metadata': {
            'name': '1560400627383-placement-binding-test',
            'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementbindings/1560400627383-placement-binding-test',
            '__typename': 'Metadata'
          },
          '__typename': 'PlacementBinding'
        }
      ],
      '__typename': 'Compliance'
    },
    {
      'metadata': {
        'name': 'policy-cis',
        'namespace': 'mcm',
        'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-cis',
        'annotations': {
          'kubectl.kubernetes.io/last-applied-configuration': '{"apiVersion":"policy.mcm.ibm.com/v1alpha1","kind":"Policy","metadata":{"annotations":{"policy.mcm.ibm.com/categories":"SystemAndInformationIntegrity","policy.mcm.ibm.com/controls":"CIS-Controller","policy.mcm.ibm.com/standards":"NIST, PCI, FISMA,HIPAA"},"finalizers":["propagator.finalizer.mcm.ibm.com"],"name":"policy-cis","namespace":"mcm"},"spec":{"namespaces":{"exclude":["kube-system"],"include":["default"]},"policy-templates":[{"objectDefinition":{"apiVersion":"cis.ibm.com/v1alpha1","kind":"CisPolicy","metadata":{"labels":{"controller-tools.k8s.io":"1.0"},"name":"cis-embeded-policy-kube-master"},"spec":{"kubernetesCisPolicy":{"masterNodeRules":{"1.1.1 Ensure that the --anonymous-auth argument is set to false":"ignore","1.1.10 Ensure that the admission control plugin AlwaysAdmit is not set":"validate","1.1.11 Ensure that the admission control plugin AlwaysPullImages is set":"validate","1.1.24 Ensure that the admission control policy is set to PodSecurityPolicy":"validate","1.1.5 Ensure that the --insecure-bind-address argument is not set":"validate","1.1.6 Ensure that the --insecure-port argument is set to 0":"validate","1.1.9 Ensure that the --repair-malformed-updates argument is set to false":"validate","1.4.1 Ensure that the API server pod specification file permissions are set to 644 or more restrictive":"validate","1.5.3 Ensure that the --auto-tls argument is not set to true":"validate","1.5.5 Ensure that the --peer-client-cert-auth argument is set to true":"validate"}}}}}],"remediationAction":"enforce"}}\n',
          'policy.mcm.ibm.com/categories': 'SystemAndInformationIntegrity',
          'policy.mcm.ibm.com/controls': 'CIS-Controller',
          'policy.mcm.ibm.com/standards': 'NIST, PCI, FISMA,HIPAA',
          'seed-generation': '2'
        },
        'resourceVersion': '5454067',
        '__typename': 'Metadata'
      },
      'name': 'policy-cis',
      'namespace': 'mcm',
      'raw': {
        'apiVersion': 'policy.mcm.ibm.com/v1alpha1',
        'kind': 'Policy',
        'metadata': {
          'annotations': {
            'kubectl.kubernetes.io/last-applied-configuration': '{"apiVersion":"policy.mcm.ibm.com/v1alpha1","kind":"Policy","metadata":{"annotations":{"policy.mcm.ibm.com/categories":"SystemAndInformationIntegrity","policy.mcm.ibm.com/controls":"CIS-Controller","policy.mcm.ibm.com/standards":"NIST, PCI, FISMA,HIPAA"},"finalizers":["propagator.finalizer.mcm.ibm.com"],"name":"policy-cis","namespace":"mcm"},"spec":{"namespaces":{"exclude":["kube-system"],"include":["default"]},"policy-templates":[{"objectDefinition":{"apiVersion":"cis.ibm.com/v1alpha1","kind":"CisPolicy","metadata":{"labels":{"controller-tools.k8s.io":"1.0"},"name":"cis-embeded-policy-kube-master"},"spec":{"kubernetesCisPolicy":{"masterNodeRules":{"1.1.1 Ensure that the --anonymous-auth argument is set to false":"ignore","1.1.10 Ensure that the admission control plugin AlwaysAdmit is not set":"validate","1.1.11 Ensure that the admission control plugin AlwaysPullImages is set":"validate","1.1.24 Ensure that the admission control policy is set to PodSecurityPolicy":"validate","1.1.5 Ensure that the --insecure-bind-address argument is not set":"validate","1.1.6 Ensure that the --insecure-port argument is set to 0":"validate","1.1.9 Ensure that the --repair-malformed-updates argument is set to false":"validate","1.4.1 Ensure that the API server pod specification file permissions are set to 644 or more restrictive":"validate","1.5.3 Ensure that the --auto-tls argument is not set to true":"validate","1.5.5 Ensure that the --peer-client-cert-auth argument is set to true":"validate"}}}}}],"remediationAction":"enforce"}}\n',
            'policy.mcm.ibm.com/categories': 'SystemAndInformationIntegrity',
            'policy.mcm.ibm.com/controls': 'CIS-Controller',
            'policy.mcm.ibm.com/standards': 'NIST, PCI, FISMA,HIPAA',
            'seed-generation': '2'
          },
          'creationTimestamp': '2019-06-18T20:54:23Z',
          'finalizers': [
            'propagator.finalizer.mcm.ibm.com'
          ],
          'generation': 8,
          'name': 'policy-cis',
          'namespace': 'mcm',
          'resourceVersion': '5454067',
          'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-cis',
          'uid': '40428313-920b-11e9-9cd6-005056a061f1'
        },
        'spec': {
          'namespaces': {
            'exclude': [
              'kube-system'
            ],
            'include': [
              'default'
            ]
          },
          'policy-templates': [
            {
              'objectDefinition': {
                'apiVersion': 'cis.ibm.com/v1alpha1',
                'kind': 'CisPolicy',
                'metadata': {
                  'labels': {
                    'controller-tools.k8s.io': '1.0'
                  },
                  'name': 'cis-embeded-policy-kube-master'
                },
                'spec': {
                  'kubernetesCisPolicy': {
                    'masterNodeRules': {
                      '1.1.1 Ensure that the --anonymous-auth argument is set to false': 'ignore',
                      '1.1.10 Ensure that the admission control plugin AlwaysAdmit is not set': 'validate',
                      '1.1.11 Ensure that the admission control plugin AlwaysPullImages is set': 'validate',
                      '1.1.24 Ensure that the admission control policy is set to PodSecurityPolicy': 'validate',
                      '1.1.5 Ensure that the --insecure-bind-address argument is not set': 'validate',
                      '1.1.6 Ensure that the --insecure-port argument is set to 0': 'validate',
                      '1.1.9 Ensure that the --repair-malformed-updates argument is set to false': 'validate',
                      '1.4.1 Ensure that the API server pod specification file permissions are set to 644 or more restrictive': 'validate',
                      '1.5.3 Ensure that the --auto-tls argument is not set to true': 'validate',
                      '1.5.5 Ensure that the --peer-client-cert-auth argument is set to true': 'validate'
                    }
                  }
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
            'binding-cis'
          ],
          'placementPolicies': [
            'placement-cis'
          ],
          'status': {
            'cluster1': {
              'aggregatePoliciesStatus': {
                'policy-cis': {
                  'compliant': 'NonCompliant'
                }
              },
              'clustername': 'cluster1',
              'compliant': 'NonCompliant'
            },
            'clusterhub': {
              'aggregatePoliciesStatus': {
                'policy-cis': {}
              },
              'clustername': 'clusterhub'
            }
          }
        }
      },
      'remediation': 'enforce',
      'policyCompliant': '2/2',
      'clusterCompliant': '2/2',
      'placementPolicies': [
        {
          'metadata': {
            'name': 'placement-cis',
            'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementpolicies/placement-cis',
            '__typename': 'Metadata'
          },
          '__typename': 'PlacementPolicy'
        }
      ],
      'placementBindings': [
        {
          'metadata': {
            'name': 'binding-cis',
            'selfLink': '/apis/mcm.ibm.com/v1alpha1/namespaces/mcm/placementbindings/binding-cis',
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
          'policy.mcm.ibm.com/categories': 'SystemAndInformationIntegrity',
          'policy.mcm.ibm.com/controls': 'MutationAdvisor',
          'policy.mcm.ibm.com/standards': 'NIST, PCI, FISMA,HIPAA',
          'seed-generation': '1'
        },
        'resourceVersion': '5428190',
        '__typename': 'Metadata'
      },
      'name': 'policy-ma',
      'namespace': 'mcm',
      'raw': {
        'apiVersion': 'policy.mcm.ibm.com/v1alpha1',
        'kind': 'Policy',
        'metadata': {
          'annotations': {
            'policy.mcm.ibm.com/categories': 'SystemAndInformationIntegrity',
            'policy.mcm.ibm.com/controls': 'MutationAdvisor',
            'policy.mcm.ibm.com/standards': 'NIST, PCI, FISMA,HIPAA',
            'seed-generation': '1'
          },
          'creationTimestamp': '2019-06-10T13:44:10Z',
          'finalizers': [
            'propagator.finalizer.mcm.ibm.com'
          ],
          'generation': 44,
          'name': 'policy-ma',
          'namespace': 'mcm',
          'resourceVersion': '5428190',
          'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-ma',
          'uid': 'd3aa0bb6-8b85-11e9-983e-005056a061f1'
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
          'policy.mcm.ibm.com/controls': 'MutationAdvisor,VA',
          'policy.mcm.ibm.com/standards': 'NIST,HIPAA',
          'seed-generation': '3'
        },
        'resourceVersion': '5428185',
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
            'policy.mcm.ibm.com/controls': 'MutationAdvisor,VA',
            'policy.mcm.ibm.com/standards': 'NIST,HIPAA',
            'seed-generation': '3'
          },
          'creationTimestamp': '2019-06-10T13:44:20Z',
          'finalizers': [
            'propagator.finalizer.mcm.ibm.com'
          ],
          'generation': 29,
          'name': 'policy-pod',
          'namespace': 'mcm',
          'resourceVersion': '5428185',
          'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-pod',
          'uid': 'd92822cc-8b85-11e9-983e-005056a061f1'
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
                  'compliant': 'NonCompliant'
                }
              },
              'clustername': 'cluster1',
              'compliant': 'NonCompliant'
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
          'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity',
          'policy.mcm.ibm.com/controls': 'MutationAdvisor,VA',
          'policy.mcm.ibm.com/standards': 'NIST,HIPAA',
          'seed-generation': '1'
        },
        'resourceVersion': '5428176',
        '__typename': 'Metadata'
      },
      'name': 'policy-role',
      'namespace': 'mcm',
      'raw': {
        'apiVersion': 'policy.mcm.ibm.com/v1alpha1',
        'kind': 'Policy',
        'metadata': {
          'annotations': {
            'policy.mcm.ibm.com/categories': 'SystemAndCommunicationsProtections,SystemAndInformationIntegrity',
            'policy.mcm.ibm.com/controls': 'MutationAdvisor,VA',
            'policy.mcm.ibm.com/standards': 'NIST,HIPAA',
            'seed-generation': '1'
          },
          'creationTimestamp': '2019-06-11T14:34:26Z',
          'finalizers': [
            'propagator.finalizer.mcm.ibm.com'
          ],
          'generation': 18,
          'name': 'policy-role',
          'namespace': 'mcm',
          'resourceVersion': '5428176',
          'selfLink': '/apis/policy.mcm.ibm.com/v1alpha1/namespaces/mcm/policies/policy-role',
          'uid': '0399be6b-8c56-11e9-983e-005056a061f1'
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
          'remediationAction': 'enforce',
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
      'remediation': 'enforce',
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

  return {
    policies,
  }
}

export default getMockData
