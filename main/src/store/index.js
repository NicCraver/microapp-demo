import { createStore } from 'vuex';
import { loadStoreModules } from '../utils';
import getters from './getters';

export const store = createStore({
  modules: loadStoreModules(require.context('./modules', true, /\.js$/)),
  getters,
});
// const store = new Vuex.Store({
//   modules: loadStoreModules(require.context('./modules', true, /\.js$/)),
//   getters
// })
export default store;
