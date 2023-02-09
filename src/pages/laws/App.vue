<template>
  <div id="app" style="margin-top: 20px;">
    <h2>
      法律法规检索
    </h2>
  </div>
</template>

<script>
export default {
  name: 'Laws',
  mounted () {
    this.$http.get('/i/laws').then(
      res => {
        if (res.body.code === 200) {
          this.lawsList = res.body.data
        } else {
          this.$message.error('Fetch diary list failed')
        }
      },
      res => {
        this.$message.error('Internal server error')
      }
    )
  },
  data () {
    return {
      lawsList: ''
    }
  },
  methods: {
    lawsDetail: function (id) {
      window.location = `/static/detail.html?id=${id}`
    }
  }
}
</script>

<style>
</style>
