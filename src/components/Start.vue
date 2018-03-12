<template>
  <div class="hello">
    <h2>- Drag some audio files to the dropzone ...</h2>
    <div id="drop_zone" v-on:dragover="cancelEvent" v-on:dragenter="cancelEvent" v-on:drop="dropHandler">

    </div>
  </div>
</template>

<script>

export default {
  name: 'Start',

  methods: {
    cancelEvent(e) {
      e.preventDefault();
    },
    dropHandler(e) {
      e.preventDefault();

      const files = [];
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            files.push(file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
          files.push(e.dataTransfer.files[i]);
        }
      }

      this.$store.dispatch({
        type: 'addFiles',
        files,
      }).then(() => {
        this.$router.push({ path: 'addTags' });
      });
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

  #drop_zone {
    border: 1px dotted #5AF;
    width:  200px;
    height: 100px;
    width: 100%;
    min-height: 400px;
}

</style>
