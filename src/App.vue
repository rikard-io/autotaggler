<template>
  <div id="app">
    <img id="logo" src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style type="scss">

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.tag{
  background: black;
  color:white;
  padding: 0.2rem 0.3rem;
  border-radius: 0.2rem;
  margin: 0.2rem;
  display: inline-block;

}
.selected {
  border: 2px solid #e764ed;
  box-shadow: 3px 3px 0px 1px rgba(0,217,232,0.67);
}

button.huge-ass{
  padding: 0.5rem 1rem;
  margin: 1rem;
  border-radius: 0.3rem;
}

#logo{
  width:100px;
  position: fixed;
  top:0;
  left:0;
}
</style>
