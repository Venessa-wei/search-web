<template>
  <div id="app">
    <h1>Login</h1>
    <div class="login-form">
      <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="用户名"
          prop="username"
          :rules="[
          { required: true, message: '用户名不能为空'}
        ]"
        >
          <el-input type="text" v-model="numberValidateForm.username" placeholder="请输入用户名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :rules="[
          { required: true, message: '密码不能为空'}
        ]"
        >
          <el-input type="password" v-model="numberValidateForm.password" autocomplete="off" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>
          <el-button @click="resetForm('numberValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  mounted () {
    this.$http.get('/user/login').then(response => {
      if (response.body.code === 200) {
        window.location = '/static/laws.html'
      }
    }, response => {
      // not login
    })
  },
  data () {
    return {
      numberValidateForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/user/login', {
            username: this.numberValidateForm.username,
            password: this.numberValidateForm.password
          }, { emulateJSON: true }).then(
            function (res) {
              if (res.body.code === 200) {
                window.location = '/static/laws.html'
              } else {
                this.$message.error('error password!')
              }
              //  成功的处理
            },
            function (res) {
              this.$message.error('internal server error')
              //  失败的处理
            }
          )
        } else {
          console.log('error submit!!')
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
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .login-form {
    width: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
