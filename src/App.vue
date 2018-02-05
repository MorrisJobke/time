<template>
  <div id="app">
    <router-view/>
    <div class="footer">
      Made with ♥ by <a href="http://morrisjobke.de/">Morris Jobke</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #111;
  margin-top: 60px;
}

#app,
.footer {
  max-width: 600px;
  margin: auto;
}

.footer {
  text-align: center;
  opacity: .5;
  font-size: 10px;
}

.footer a {
  color: #333;
  font-size: 10px;
}
</style>
