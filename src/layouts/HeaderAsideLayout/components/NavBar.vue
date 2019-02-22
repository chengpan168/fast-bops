<template>
    <Menu mode="horizontal" theme="dark">
        <div class="logo-font">报表统计后台</div>
        <div class="layout-nav">
            <MenuItem :name="item.value" v-for="item in navs" :key="item.value">
                {{item.label}}
            </MenuItem>
        </div>
        <div class="layout-action">
            <!--<Dropdown v-on:on-click="roleChange" trigger="click" v-if="curRole">-->
                <!--<Button style="padding: 5px 15px;margin-left: 10px;margin-right: 10px" type="info">-->
                    <!--{{curRole && roleMap[curRole]}}-->
                    <!--<Icon type="ios-arrow-down"></Icon>-->
                <!--</Button>-->
                <!--<DropdownMenu slot="list">-->
                    <!--<DropdownItem :name="k.roleId" v-for="k in roles" :key="k.roleId">-->
                        <!--{{k.roleNameCn}}-->
                    <!--</DropdownItem>-->
                <!--</DropdownMenu>-->
            <!--</Dropdown>-->
            <!--<Avatar :src="avatar" />-->
            <Dropdown v-on:on-click="actionChange">
                <Button type="primary">
                    {{userName}}
                    <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="loginOut" >退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </Menu>
</template>
<script>

import {
  Menu, MenuItem, Dropdown, DropdownMenu, DropdownItem, Icon
} from 'iview';

export default {
  name: 'navBar',
  components: {
    Menu, MenuItem, Dropdown, DropdownMenu, DropdownItem, Icon
  },
  data() {
    return {
      curRole: '',
      userName: '',
      avatar: '',
      roles: [],
      roleMap: {},
      navs: [
        { label: '管理中心', value: 'operation', link: '' }
      ]
    };
  },
  computed: {
    actNav() {
      const { navKey } = this.$store.getters;
      return navKey;
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    init() {
      this.userName = this.$localStore.get('account');
    },
    roleChange(name) {
      if (name === this.curRole) return;
      const roleId = Number(name);
      this.$localStore.set('role_id', roleId);
      window.location.reload();
    },
    actionChange(name) {
      if (name === 'loginOut') {
        this.clear();
      }
    },
    onNavChange(nav) {
      if (nav !== this.actNav) {
        this.$store.dispatch('UpdateNav', { navKey: nav });
      }
    },
    clear() {
      this.$localStore.remove('user_id');
      this.$localStore.remove('token');
      this.$localStore.remove('account');
      const refer = window.location.href;
      window.location.replace(`/login?referrer=${refer}`);
    }
  }
};
</script>
<style lang="less" scoped>
    .logo-font{
        float: left;
        position: relative;
        font-size:20px;
        line-height:20px;
        color:#fff;
        top: 20px;
        left: 20px;
    }
    .layout-nav{
        float: left;
        margin-left: 50px;
    }
    .layout-action{
        float: right;
        margin-right: 20px;
    }
</style>
