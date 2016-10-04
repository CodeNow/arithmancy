module.exports = {
  'status': 'start',
  'id': 'feac685e4c5d8d18d4dd6381511e4514228af7e2750e014375328bacc5cd250d',
  'from': 'registry.runnable.com/runnable/image-builder:v4.2.2',
  'Type': 'container',
  'Action': 'start',
  'Actor': {
    'ID': 'feac685e4c5d8d18d4dd6381511e4514228af7e2750e014375328bacc5cd250d',
    'Attributes': {
      'com.docker.swarm.constraints': '["org==2828361"]',
      'com.docker.swarm.id': 'bd47dba9a1284a8dc20b0cac22de1d18a0741f85e3adc400e35928e365108b3c',
      'contextVersion._id': '57f2d7692e492e1000f38432',
      'contextVersion.build._id': '57f2d7692e492e1000f38431',
      'contextVersion.context': '57eedaad98c5e711008b5cac',
      'dockerTag': 'localhost/2828361/57eedaad98c5e711008b5cac:57f2d7692e492e1000f38432',
      'githubOrgId': '2828361',
      'image': 'registry.runnable.com/runnable/image-builder:v4.2.2',
      'manualBuild': 'true',
      'name': 'admiring_jennings',
      'noCache': 'true',
      'ownerUsername': 'Runnable',
      'sessionUserDisplayName': 'Anandkumar Patel',
      'sessionUserGithubId': '2194285',
      'sessionUserUsername': 'anandkumarpatel',
      'type': 'image-builder-container'
    }
  },
  'time': 1475532649,
  'timeNano': 1475532649703648800,
  'Host': '10.4.132.245:4242',
  'org': '2828361',
  'uuid': '3de77150-89b6-11e6-9f9a-b558ffb7cb79',
  'ip': '10.4.132.245',
  'dockerPort': '4242',
  'tags': '2828361',
  'host': 'http://10.4.132.245:4242',
  'dockerUrl': 'http://10.4.132.245:4242',
  'needsInspect': true,
  'tid': 'f77ffd2b-66ac-4ca5-80d1-daa26c145982',
  'inspectData': {
    'Id': 'feac685e4c5d8d18d4dd6381511e4514228af7e2750e014375328bacc5cd250d',
    'Created': '2016-10-03T22:10:49.440379626Z',
    'State': {
      'Status': 'running',
      'Running': true,
      'Paused': false,
      'Restarting': false,
      'OOMKilled': false,
      'Dead': false,
      'ExitCode': 0,
      'Error': '',
      'StartedAt': '2016-10-03T22:10:49.69941022Z',
      'FinishedAt': '0001-01-01T00:00:00Z'
    },
    'Image': 'sha256:552126075855662d822c21b1e5016e63e7d2c01b9547d32b2cdc4967597b8baa',
    'Name': '/admiring_jennings',
    'HostConfig': {
      'Memory': 2048000000,
      'MemoryReservation': 128000000
    },
    'Config': {
      'Hostname': 'feac685e4c5d',
      'Env': [
        'RUNNABLE_BUILD_FLAGS={"forcerm":true,"nocache":true}',
        'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        'NODE_VERSION=0.10.40',
        'NPM_VERSION=2.11.3'
      ],
      'Image': 'registry.runnable.com/runnable/image-builder:v4.2.2',
      'Labels': {
        'com.docker.swarm.constraints': '["org==2828361"]',
        'com.docker.swarm.id': 'bd47dba9a1284a8dc20b0cac22de1d18a0741f85e3adc400e35928e365108b3c',
        'contextVersion._id': '57f2d7692e492e1000f38432',
        'contextVersion.build._id': '57f2d7692e492e1000f38431',
        'contextVersion.context': '57eedaad98c5e711008b5cac',
        'dockerTag': 'localhost/2828361/57eedaad98c5e711008b5cac:57f2d7692e492e1000f38432',
        'githubOrgId': '2828361',
        'manualBuild': 'true',
        'noCache': 'true',
        'ownerUsername': 'Runnable',
        'sessionUserDisplayName': 'Anandkumar Patel',
        'sessionUserGithubId': '2194285',
        'sessionUserUsername': 'anandkumarpatel',
        'type': 'image-builder-container'
      }
    },
    'NetworkSettings': {
      'Ports': {},
      'IPAddress': '172.17.0.6'
    }
  }
}
