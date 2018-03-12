<template>
  <div class="tag" v-bind:class="{selected: selected}" @click="select">
    <span>{{tag}}</span>
    <span v-if="keyMap && keyMap!=='undefined'" class="keymap-lbl">[{{keyMap}}]</span>
  </div>
</template>

<script>

import eventBus from '../eventBus';

export default {
  name: 'Tag',
  props: ['isSelected', 'tag'],
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
  mounted() {
    document.addEventListener('keyup', this.keydown, false);
  },
  destroyed() {
    document.removeEventListener('keyup', this.keydown, false);
  },
  watch: {
    isSelected(val) {
      this.selected = val;
    },
  },
  methods: {
    keydown(e) {
      if (e.key === this.keyMap) {
        this.select();
      }
    },
    select(e) {
      this.selected = !this.selected;
      if (this.selected) {
        this.$emit('select', this.tag);
      } else {
        this.$emit('deselect', this.tag);
      }
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
