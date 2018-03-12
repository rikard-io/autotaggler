<template>
  <div class="addtags">
    <h2>- Alright! Let's do it</h2>
    <div class="tags-container">
      <Tag @select="addTag" @deselect="removeTag" v-bind:class="{predicted:predicted==tag}" v-for="tag in tags" :isSelected="fileTags.indexOf(tag) !== -1" :tag="tag"></Tag>
    </div>
    <div><audio ref="audio" controls :src="fileSrc"></audio><p>[space to re-play]</p></div>
    <div v-if="onlyAllowOne"><button @click="autotag" class="huge-ass" :disabled="this.fileId < 3">Let the 🤖 do the work!</button></div>

    <button v-if="progress>0" class="huge-ass" @click="prev">Prev! [left-arrow]</button>
    <button v-if="progress<1" class="huge-ass" @click="next">Next! [enter|right-arrow]</button>
    <div v-if="progress>=1 && fileTags.length">🎇🎆🎇🎇🎆🎇🎇🎆🎇</br>You're done!</br>🎇🎆🎇🎇🎆🎇🎇🎆🎇</div>
    <div class="progress">{{parseInt(fileId)+1}}/{{totFileCount}}</div>
    <p><button class="huge-ass" @click="downloadJSON">Gimme that JSOOOON!</button></p>
  </div>

</template>

<script>
import Tag from './Tag';
import FileContainer from '@/FileContainer';

import ai from '@/ai';

export default {
  name: 'Tagging',
  components: {
    Tag,
  },
  props: ['fileId'],
  watch: {
    fileId(val) {
      setTimeout(() => {
        this.play();
      }, 100);
      this.predicted = null;
      ai.predict(this.fileBlob).then((res) => {
        this.predicted = this.tags[res];
        if (this.doAutoTag) {
          this.addTag(this.predicted);
          this.next();
        }
      });
    },
  },
  mounted() {
    ai.setup(this.tags.length);

    document.addEventListener('keyup', this.keydown, false);
    setTimeout(() => {
      this.play();
    }, 100);
  },
  destroyed() {
    document.removeEventListener('keyup', this.keydown, false);
  },
  data() {
    return {
      predicted: null,
      doAutoTag: false,
    };
  },
  computed: {
    onlyAllowOne() {
      return this.$store.getters.onlyAllowOne;
    },
    hasTag() {
      this.fileTags.length > 0;
    },
    progress() {
      const progress = parseInt(this.fileId) / (this.totFileCount - 1);


      return progress;
    },
    totFileCount() {
      return this.$store.getters.files.length;
    },
    tags() {
      return this.$store.getters.tags;
    },
    fileTags() {
      return this.$store.getters.file(this.fileId).tags;
    },
    fileBlob() {
      const file = this.$store.getters.file(this.fileId);
      const fileObj = FileContainer.get(file.hash);
      return fileObj;
    },
    fileSrc() {
      const file = this.$store.getters.file(this.fileId);

      if (!file) {
        return '';
      }
      // if we're in electorn, file.path should be present
      if (file.path) {
        return file.path;
      }

      const fileObj = FileContainer.get(file.hash);
      return window.URL.createObjectURL(fileObj);
    },
  },
  methods: {
    autotag() {
      if (confirm("🤖 Me? Are you sure? I'm not your Tesla grade AI bot! I will probably make a lot of mistakes! Only proceed if no humans will get harmed from these tags.")) {
        this.doAutoTag = true;
        if (this.predicted) {
          this.addTag(this.predicted);
        }
        this.next();
      }
    },
    keydown(e) {
      if (e.keyCode === 13 || e.keyCode === 39) {
        this.next();
      } else if (e.keyCode === 37) {
        this.prev();
      } else if (e.keyCode === 32) {
        this.play();
        e.preventDefault();
        e.stopPropagation();
      }
    },
    play() {
      this.$refs.audio.play();
    },
    next() {
      if (this.tags.indexOf(this.fileTags[0]) > -1) {
        ai.process(this.fileBlob, this.tags.indexOf(this.fileTags[0])).then(() => {
          if (this.progress < 1) {
            this.$router.push({ path: `/tagging/${parseInt(this.fileId) + 1}` });
          }
        });
      } else if (this.progress < 1) {
        this.$router.push({ path: `/tagging/${parseInt(this.fileId) + 1}` });
      }
    },
    prev() {
      if (parseInt(this.fileId) > 0) {
        this.$router.push({ path: `/tagging/${parseInt(this.fileId) - 1}` });
      }
    },
    downloadJSON() {
      const fileName = prompt('filename?', 'mytags.json');
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.$store.getters.json))}`;
      const dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute('href', dataStr);
      dlAnchorElem.setAttribute('download', fileName);
      dlAnchorElem.click();
    },
    removeTag(tag) {
      this.$store.dispatch({ type: 'removeFileTag', tag, fileId: this.fileId });
    },
    addTag(tag) {
      this.$store.dispatch({ type: 'addFileTag', tag, fileId: this.fileId });
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
  .tag {
    position: relative;
  }
  .tags-container{
    border: 3px dotted #EEE;
    margin: 1rem 0;
    padding: 1rem;
  }
  .tag.predicted:after{
    content: "🤖";
    position: absolute;
    top:-1.3rem;
    left:50%;
    transform: translate(-50%,0);
  }
</style>
