import Vue from 'vue';
import Vuex from 'vuex';
import FileContainer from '../FileContainer';

Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  files: [],
  tags: [],
  onlyAllowOne: true,
  keyboardTagMap: {},
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  addFiles(state, hashedFiles) {
    hashedFiles.forEach(f => state.files.push({
      hash: f.hash,
      name: f.name,
      path: f.path,
      tags: [],
    }));
  },
  addTag(state, tag) {
    state.tags.push(tag);
  },
  removeTag(state, tag) {
    const idx = state.tags.indexOf(tag);
    if (idx > -1) {
      state.tags.splice(idx, 1);
    }
  },
  addFileTag(state, payload) {
    const fileEntry = state.files[payload.fileId];
    const tags = fileEntry.tags;
    tags.push(payload.tag);
    Vue.set(state.files, payload.fileId, fileEntry);
  },
  removeFileTag(state, payload) {
    const idx = state.files[payload.fileId].tags.indexOf(payload.tag);
    if (idx > -1) {
      state.files[payload.fileId].tags.splice(idx, 1);
    }
  },
  removeAllFileTags(state, fileId) {
    Vue.set(state.files[fileId], 'tags', []);
  },
  mapKeyToTag(state, mapping) {
    Vue.set(state.keyboardTagMap, mapping.key, mapping.tag);
  },
  removeKeyToTagMapping(state, key) {
    Vue.set(state.keyboardTagMap, key, null);
  },
  updateOnlyAllowOne(state, toggle) {
    state.onlyAllowOne = toggle;
  },
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  addFiles: ({ commit }, data) => {
    commit('addFiles', data.files.map((f) => {
      const hash = FileContainer.add(f);
      return {
        hash,
        name: f.name,
        path: f.path,
      };
    }));
  },
  addTag: ({ commit }, payload) => {
    commit('addTag', payload.tag);
  },
  removeTag: ({ commit }, payload) => {
    commit('removeTag', payload.tag);
  },
  mapKeyToTag: ({ commit, state }, payload) => {
    commit('removeKeyToTagMapping', getters.keymapForTag(state)(payload.tag));
    if ('abcdefghijklmnopqrstuvwxyzåäöABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ1234567890'.indexOf(payload.key) !== -1) {
      commit('mapKeyToTag', {
        key: payload.key,
        tag: payload.tag,
      });
    }
  },
  removeFileTag: ({ commit, state }, payload) => {
    const tags = getters.file(state)(payload.fileId).tags;
    if (tags.indexOf(payload.tag) > -1) {
      commit('removeFileTag', payload);
    }
  },
  addFileTag: ({ commit, state }, payload) => {
    if (state.onlyAllowOne) {
      commit('removeAllFileTags', payload.fileId);
    }
    const tags = getters.file(state)(payload.fileId).tags;
    if (tags.indexOf(payload.tag) === -1) {
      commit('addFileTag', payload);
    }
  },
  updateOnlyAllowOne: ({ commit, state }, payload) => {
    commit('updateOnlyAllowOne', payload.v);
  },

};

// getters are functions
const getters = {
  tags: state => state.tags,
  keymapForTag: state => (tag) => {
    const key = Object.keys(state.keyboardTagMap).find(k => state.keyboardTagMap[k] === tag);
    return key;
  },
  file: state => fileId => state.files[fileId],
  files: state => state.files,
  tagsForFile: state => fileId => state.files[fileId].tags,
  json: (state) => {
    const json = {};
    state.files.forEach((f) => {
      json[f.name] = f.tags.map(f => f);
      if (f.path) {
        json[f.name].path = f.path;
      }
    });
    return json;
  },
  onlyAllowOne: state => state.onlyAllowOne,
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
