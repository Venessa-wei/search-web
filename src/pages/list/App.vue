<template>
  <div id="app">
    <el-row>
      <el-col :span="16" :offset="4">
        <el-row style="display: flex;align-items: center">
          <el-col :span="8" :offset="8">
             <h1 style="text-align: center;">Diary</h1>
          </el-col>
          <el-col :span="2" :offset="6">
            <el-button type="primary" icon="el-icon-plus" onclick="window.location='/static/new.html'">写日记</el-button>
          </el-col>
        </el-row>
        <div>
          <el-timeline>
            <el-timeline-item :timestamp="formatTimestamp(diary.date)" placement="top" v-for="diary in diaryList" :key="diary.id">
              <div @click="diaryDetail(diary.id)">
                <el-card>
                  <h4>{{ diary.title }}</h4>
                  <p>{{ diary.content.slice(0, 20) + '...' }}</p>
                </el-card>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    this.$http.get('/i/list').then(
      res => {
        if (res.body.code === 200) {
          this.diaryList = res.body.data
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
      diaryList: ''
    }
  },
  methods: {
    formatTimestamp: function (timestamp) {
      timestamp = new Date(timestamp * 1000)
      return timestamp.toLocaleDateString().replace(/\//g, '-') + ' ' + timestamp.toTimeString().substr(0, 8)
    },
    diaryDetail: function (id) {
      window.location = `/static/detail.html?id=${id}`
    }
  }
}
</script>

<style>
</style>
