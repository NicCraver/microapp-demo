import store from './store'

const CONFIG = {
  store,
  static: [],
  async: [
    {
      path: './api/request.js',
      exports: [],
      content: require('../src/api/request.js'),
    },
    {
      path: './api/__http__.js',
      exports: [],
      content: require('../src/api/__http__.js'),
    },
    {
      path: './utils/utils.js',
      exports: ['encryptsm3'],
      content: require('../src/utils/utils.js'),
    },
    {
      path: './utils/index.js',
      exports: ['uuid'],
      content: require('../src/utils/index.js'),
    },
  ],
}

function sharedHandler(config) {
  for (let i = 0; i < config.static.length; i++) {
    const item = config.static[i]
    item.content = window.location.origin + item.content
  }
  return config
}

export default sharedHandler(CONFIG)
