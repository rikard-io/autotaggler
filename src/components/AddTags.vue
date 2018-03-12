<template>
  <div class="addtags">
    <p> - 🔥 hOt tip! click select a tag and map to a keyboard button! 🏇🔥</p>
    <h2>- Let's add some tags</h2>
    <input ref="tagInput" type="text" placeholder="grandma" @keyup.enter="addTag"></input>
    <div class="tags-container">
      <InputTag class="tag" v-for="tag in tags" :tag="tag"></InputTag>
    </div>
    <label>
      Limit selection to one:</br>
      <input type="checkbox" v-model="onlyAllowOne"></input></br>
      (and allow for the tag-bot 🤖 to do your work!)
    </label>
    <div>
      <router-link to="/tagging/0" tag="button" :disabled="this.tags.length<2" class="huge-ass">Let's tag!</router-link>
    </div>
  </div>

</template>

<script>
import InputTag from './InputTag';

export default {
  name: 'AddTags',
  components: {
    InputTag,
  },
  data() {
    return {
    };
  },
  computed: {
    tags() {
      return this.$store.getters.tags;
    },
    onlyAllowOne: {
      get() {
        return this.$store.getters.onlyAllowOne;
      },
      set(v) {
        return this.$store.dispatch({ type: 'updateOnlyAllowOne', v });
      },
    },
  },
  methods: {
    addTag(e) {
      const tag = this.$refs.tagInput.value;
      this.$refs.tagInput.value = '';
      if (this.tags.indexOf(tag) === -1) {
        this.$store.dispatch({
          type: 'addTag',
          tag,
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="scss">
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
    li {
      display: inline-block;
      margin: 0 10px;
    }
  }

  .tags-container{
    border: 3px dotted #EEE;
    margin: 1rem 0;
    padding: 1rem;
  }

</style>
