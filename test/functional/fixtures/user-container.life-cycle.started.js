module.exports = {
  'status': 'start',
  'id': '422b5a17e9c92121fb05f83c726e9a3427c267968a3ab02795eba6ce4ecab901',
  'from': 'localhost/2828361/57f169468f358d11002b9a80:57f2a8c30da0871000388865',
  'Type': 'container',
  'Action': 'start',
  'Actor': {
    'ID': '422b5a17e9c92121fb05f83c726e9a3427c267968a3ab02795eba6ce4ecab901',
    'Attributes': {
      'com.docker.swarm.constraints': '["org==2828361","node==~ip-10-4-132-245.2828361"]',
      'com.docker.swarm.id': 'edc4e77c96d303fccf643ceaef99ba2f7bd5bca5635935bf0e8868fbe67ad147',
      'contextVersionId': '57f2a8c30da0871000388865',
      'githubOrgId': '2828361',
      'image': 'localhost/2828361/57f169468f358d11002b9a80:57f2a8c30da0871000388865',
      'instanceId': '57f1694ae5b1b11100d93c49',
      'instanceName': 'RethinkDB',
      'instanceShortHash': '1j9mdz',
      'name': 'reverent_shaw',
      'ownerUsername': 'Runnable',
      'sessionUserGithubId': '2194285',
      'type': 'user-container'
    }
  },
  'time': 1475520710,
  'timeNano': 1475520710438385000,
  'Host': '10.4.132.245:4242',
  'org': '2828361',
  'uuid': '718c5550-899a-11e6-8dad-37f16d99238c',
  'ip': '10.4.132.245',
  'dockerPort': '4242',
  'tags': '2828361',
  'host': 'http://10.4.132.245:4242',
  'dockerUrl': 'http://10.4.132.245:4242',
  'needsInspect': true,
  'tid': '597a9f8e-642e-4700-abdd-559dfd63195b',
  'inspectData': {
    'Id': '422b5a17e9c92121fb05f83c726e9a3427c267968a3ab02795eba6ce4ecab901',
    'Created': '2016-10-03T18:51:49.944849363Z',
    'State': {
      'Status': 'running',
      'Running': true,
      'Paused': false,
      'Restarting': false,
      'OOMKilled': false,
      'Dead': false,
      'ExitCode': 0,
      'Error': '',
      'StartedAt': '2016-10-03T18:51:50.432393021Z',
      'FinishedAt': '0001-01-01T00:00:00Z'
    },
    'Image': 'sha256:50caa1574691d5964b7cefc19d4b70f547c7af43690272a78882736219c2b2c5',
    'Name': '/reverent_shaw',
    'HostConfig': {
      'Memory': 2048000000,
      'MemoryReservation': 128000000
    },
    'Config': {
      'Hostname': '422b5a17e9c9',
      'Env': [
        'RUNNABLE_CONTAINER_ID=1j9mdz',
        'RUNNABLE_CONTAINER_URL=rethinkdb-staging-runnable.runnable.ninja',
        'TIME=1475438921749',
        'PATH=/root/.rbenv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        'GOSU_VERSION=1.7',
        'RETHINKDB_PACKAGE_VERSION=2.3.4~0jessie'
      ],
      'Image': 'localhost/2828361/57f169468f358d11002b9a80:57f2a8c30da0871000388865',
      'Labels': {
        'com.docker.swarm.constraints': '["org==2828361","node==~ip-10-4-132-245.2828361"]',
        'com.docker.swarm.id': 'edc4e77c96d303fccf643ceaef99ba2f7bd5bca5635935bf0e8868fbe67ad147',
        'contextVersionId': '57f2a8c30da0871000388865',
        'githubOrgId': '2828361',
        'instanceId': '57f1694ae5b1b11100d93c49',
        'instanceName': 'RethinkDB',
        'instanceShortHash': '1j9mdz',
        'ownerUsername': 'Runnable',
        'sessionUserGithubId': '2194285',
        'type': 'user-container'
      }
    },
    'NetworkSettings': {
      'Ports': {
        '28015/tcp': [
          {
            'HostIp': '0.0.0.0',
            'HostPort': '64595'
          }
        ],
        '29015/tcp': [
          {
            'HostIp': '0.0.0.0',
            'HostPort': '64594'
          }
        ],
        '8080/tcp': [
          {
            'HostIp': '0.0.0.0',
            'HostPort': '64596'
          }
        ]
      },
      'IPAddress': '172.17.0.6'
    }
  }
}
