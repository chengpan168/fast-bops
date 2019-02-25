<template>
  <div class="layout">
    <Layout>
      <nav-bar/>
      <Layout>
        <Sider :style="{background: '#fff'}" collapsible hide-trigger>
          <side-bar/>
        </Sider>
        <Layout>
          <app-main/>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>

import { Layout, Sider } from 'iview';
import { AppMain, NavBar, SideBar } from './components';

export default {
  name: 'layout',
  components: {
    AppMain, SideBar, NavBar, Sider, Layout
  }
};
</script>

<style lang="less" scoped>
  .layout {
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
