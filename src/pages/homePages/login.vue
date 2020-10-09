<template>
  <div class="main">
    <div class="header">自助机管理后台</div>
    <div class="loginContent">
      <div class="loginForm">
        <div class="loginTitle">
          <a-icon type="user" />
          <span>用户登录</span>
        </div>
        <a-form-model
          :model="loginForm"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="rules"
          ref="loginForm"
        >
          <a-form-model-item label="账号" prop="loginID">
            <a-input v-model="loginForm.loginID" class="inputVal" />
          </a-form-model-item>
          <a-form-model-item label="密码" prop="password">
            <a-input
              v-model="loginForm.password"
              type="password"
              class="inputVal"
              :pressEnter="submitForm"
            />
          </a-form-model-item>

          <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button
              type="primary"
              @click="submitForm('loginForm')"
              :loading="loading"
            >
              登录
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <div class="footer">深圳市安测健康信息技术有限公司</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        loginID: '',
        password: '',
        companyID: '09bf906d3e0c461ca7425743360a2160'
      },
      loading: false,
      rules: {
        loginID: [{ trigger: 'blur', message: '请输入账号', required: true }],
        password: [{ trigger: 'blur', message: '请输入密码', required: true }]
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  },
  created() {
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.axios.login
            .loginSub(this.loginForm)
            .then(res => {
              if (res.Code === 200) {
                this.loading = false
                sessionStorage.setItem('accessToken', res.Data.access_token)
                sessionStorage.setItem('refreshToken', res.Data.refresh_token)
                this.$router.push('home')
              }
            })
            .catch(err => {
              this.loading = false
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  background: #fff;
  background: url('../../assets/loginbg.png') no-repeat;
  background-size: 100% 100%;
}
.header {
  width: 100%;
  height: 80px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  line-height: 80px;
  color: red;
  font-size: 36px;
}
.loginContent {
  width: 100%;
  height: calc(~'100% - 150px');
  display: flex;
  justify-content: center;
  align-items: center;

  .loginForm {
    width: 500px;
    height: 300px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 5px 10px 5px #a29e9e;
    background: #ffffff;
    .loginTitle {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      padding: 0 20px;
      font-size: 20px;
    }
    .ant-form {
      width: 100%;
      height: calc(~'100% - 50px');
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      .inputVal {
        width: 200px;
      }
    }
  }
}
.footer {
  width: 100%;
  height: 50px;
  line-height: 50px;
}
</style>
