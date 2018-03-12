<template>
  <div tabindex="0" class="tag" @keyup="mapKey" v-bind:class="{selected: selected}" @blur="deselect" @click="select">
    <span ref="tagName">{{tag}}</span>
    <button @click="remove">[💥]</button>
    <span v-if="keyMap && keyMap!=='undefined'" class="keymap-lbl">[{{keyMap}}]</span>
  </div>
</template>

<script>

import eventBus from '../eventBus';

export default {
  name: 'Tag',
  props: ['tag'],
  data() {
    return {
      selected: false,
    };
  },
  computed: {
    keyMap() {
      return this.$store.getters.keymapForTag(this.tag);
    },
  },
  mounded() {
    eventBus.$on('TAG::SELECT_TAG', this.deselect);
  },
  destroyed() {
    eventBus.$off('TAG::SELECT_TAG', this.deselect);
  },
  methods: {
    mapKey(e) {
      const key = e.key;
      this.$store.dispatch({ type: 'mapKeyToTag', tag: this.tag, key });
    },
    deselect() {
      this.selected = false;
    },
    select(e) {
      eventBus.$emit('TAG::SELECT_TAG');
      this.selected = true;
    },
    remove(e) {
      this.$store.dispatch({ type: 'removeTag', tag: this.tag });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="scss">

button{
  padding: 0;
  background: none;
  border: none;
  color: white;
  height: 100%;
}


.keymap-lbl{
  color: #ed64e7;
}


</style>
