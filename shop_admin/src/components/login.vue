<template>
  <div class="login">
      <!-- 这里的:model="form"指定就是整个表单数据 -->
    <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img src="../assets/three.jpg" alt />
      <el-form-item label="用户名" prop="username" >
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码"  prop="password">
        <!-- 添加按键登录 -->
        <el-input type="password" v-model="form.password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button class="reset" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
             { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      //判断控件里面输入的数据是否符合规则
      this.$refs.form.validate(async (valid) => {
          if (valid) {
           let res = await this.axios({
                url: 'login',
                method: 'post',
                data: this.form
            })
            console.log(res.data)
           if(res.data.meta.status === 200){
                this.$message.success({
                  message: '恭喜你，登录成功',
                  duration: 1000
              });
              //存储服务器返回的令牌，且必须在页面跳转之前保存
              localStorage.setItem('token1',res.data.data.token)
              this.$router.push('/home')
           } else {
              this.$message.error({
                  message: '错了哦，请输入正确的用户名和密码',
                  duration: 1000
              });
            }
          } else {
            return false
          }
        })
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: gray;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 200px auto;
    padding: 75px 40px 15px 40px;
    background-color: #fff;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      width: 100px;
      height: 100px;
      top: -64px;
      left: 232px;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .reset {
      margin-left: 80px;
    }
  }
}
</style>
