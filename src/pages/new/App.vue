<template>
  <div id="app">
    <el-row>
      <el-col :span="16" :offset="4">
        <h1>写日记</h1>
        <el-form :model="diary" ref="diaryForm" label-width="100px">
          <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '标题不能为空'}]">
            <el-input type="text" v-model="diary.title" placeholder="日记叫什么好呢？" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="天气" prop="weather">
            <el-input type="text" v-model="diary.weather" placeholder="今天天气如何？" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="心情" prop="mood">
            <el-select v-model="diary.mood" placeholder="心情怎么样呢？">
              <el-option v-for="item in moodOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="正文" prop="content" :rules="[{ required: true, message: '正文不能为空'}]">
            <el-input type="textarea" :autosize="{ minRows: 2 }" placeholder="写写今天的经历和感受吧~" v-model="diary.content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('diaryForm')">提交</el-button>
            <el-button @click="resetForm('diaryForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'New',
  data () {
    return {
      diary: {
        title: '',
        weather: '',
        mood: '',
        content: ''
      },
      moodOptions: [{
        value: '1',
        label: '开心'
      }, {
        value: '2',
        label: '一般'
      }, {
        value: '3',
        label: '不开心'
      }, {
        value: '4',
        label: '不想活了'
      }]
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/i/diary', this.diary, { emulateJSON: true }).then(
            res => {
              if (res.body.code === 200) {
                window.location = '/static/list.html'
              } else {
                this.$message.error('Save diary failed')
              }
            },
            res => {
              this.$message.error('Internal server error!')
            }
          )
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
</style>
