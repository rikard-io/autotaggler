const _files = {};
const FileContainer = {
  install(Vue, options) {
    Vue.prototype.$fileContainer = this;
  },
  hash(f) {
    const hash = `${f.lastModified}-${f.size}-${f.name}`;
    return hash;
  },

  add(file) {
    const hash = this.hash(file);
    _files[hash] = file;
    return hash;
  },

  get(hash) {
    return _files[hash];
  },

  getFiles() {
    return _files;
  },
};

export default FileContainer;
