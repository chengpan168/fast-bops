<template>
    <Content :style="{background: '#fff', padding: '10px 20px 20px'}">
        <Layout>
            <Content :style="{minHeight, background: '#fff'}">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </Content>
        </Layout>
    </Content>
</template>

<script>

import { Content, Layout } from 'iview';

export default {
  name: 'AppMain',
  components: { Content, Layout },
  data() {
    return {
      minHeight: '600px'
    };
  },
  mounted() {
    this.minHeight = `${window.innerHeight - 90}px`;
  }
};
</script>
