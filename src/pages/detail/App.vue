<template>
  <div id="app">
    <h1> Details </h1>
    <h2>{{ diary.title }}</h2>
    <h4>{{ diary.date }}</h4>
    <h4>{{ diary.mood }}</h4>
    <h4>{{ diary.weather }}</h4>
    <h4>{{ diary.content }}</h4>
  </div>
</template>

<script>
export default {
  name: 'New',
  mounted () {
    for (let item of window.location.search.slice(1).split('&')) {
      let vs = item.split('=')
      if (vs[0] === 'id') {
        let id = vs[1]
        this.$http.get('/i/detail', {
          params: {
            id: id
          }
        }).then(
          res => {
            if (res.body.code === 200) {
              this.diary = res.body.data
            } else {
              this.$message.error('Get diary detail failed!')
            }
          }, res => {
            this.$message.error('Internal server error!')
          }
        )
      }
    }
  },
  data () {
    return {
      diary: {}
    }
  }
}
</script>

<style>
</style>
