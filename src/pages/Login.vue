<template>
  <div class="login">
    <div class="login-block">
      <div class="login-font">XXX管理后台</div>
      <Form :model="formItem" :rules="ruleValidate" ref="formItem">
        <FormItem prop="account">
          <Input placeholder="手机号" size="large" type="text" v-model="formItem.account">
            <Icon size="large" slot="prepend" type="ios-person-outline"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input @on-enter="login"
                 placeholder="密码"
                 size="large" type="password"
                 v-model="formItem.password"
          >
            <Icon size="large" slot="prepend" type="ios-lock-outline"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button @click="submit('formItem')" long size="large" type="primary">登录</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      formItem: {
        account: '',
        password: '',
      },
      ruleValidate: {
        account: [
          {
            required: true, message: '请填写手机号', trigger: 'blur',
          }],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }, {
            type: 'string', min: 6, message: '密码不能小于6个字符', trigger: 'blur',
          }],
      },
    };
  },
  mounted() {
  },
  methods: {
    submit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.login();
        } else {
          this.$Message.error('请完善表单信息!');
        }
      });
    },
    home() {
      const { query } = this.$route;
      const { referer } = query;
      const url = referer || '/';
      this.$router.replace(url);
    },
    login() {
      const { account, password } = this.formItem;
      return this.$http().get('/manager/login', {
        params: {
          phone: account,
          password,
        },
      }).then((data) => {
        const { id, token, account: acc } = data;
        this.$localStore.set('token', token);
        this.$localStore.set('account', acc);
        this.$localStore.set('user_id', id);
        this.$Message.success('登录成功！');
        setTimeout(() => {
          this.home();
        }, 1500);
      }).catch((err) => {
        console.log(err);
        // this.$Message.error('登录出错！');
      });
    },
    getRole(userId) {
      return this.$http.post('/role/getUserRoleByConditions', {
        userRoleDto: { userId },
        pageInfo: {
          pageIndex: 1,
          pageSize: 9999,
        },
      }).then(data => data);
    },
  },
};
</script>
<style scoped lang="less">
  .login {
    background-image: url('../assets/login_bg.jpg');
    background-repeat: no-repeat, no-repeat;
    background-position: center center, center center;
    background-size: cover, cover;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;

    .login-block {
      width: 396px;
      height: 292px;
      padding: 50px;
      padding-top: 40px;
      background-color: rgba(255, 255, 255, 0.81);
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
      border-radius: 6px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -146px;
      margin-left: -198px;

      .login-font {
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #27a0ff;
        line-height: 20px;
        text-align: center;
        margin-bottom: 28px;
      }
    }
  }
</style>
