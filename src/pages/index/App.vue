<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <button @click="testClick">button</button>
    <img src="./assets/logo.png">
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    this.$http.get('/api/greet', {
      'params': {
        'id': 1
      }
    }).then(response => {
      if (response.body.code === 200) {
        this.msg = response.body.msg
      }
    }, response => {
      console.log(response)
    })
  },
  data () {
    return {
      msg: 'Wrong msg'
    }
  },
  methods: {
    testClick () {
      this.$http.get('/api/greet', {
        'params': {
          'id': 2
        }
      }).then(response => {
        if (response.body.code === 200) {
          this.msg = response.body.msg
        }
      }, response => {
        console.log(response)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
