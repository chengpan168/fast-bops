<template>
    <div class="layout">
        <Layout>
            <nav-bar />
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <side-bar />
                </Sider>
                <app-main />
            </Layout>
        </Layout>
    </div>
</template>

<script>

import { Sider, Layout } from 'iview';
import { AppMain, SideBar, NavBar } from './components';

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
