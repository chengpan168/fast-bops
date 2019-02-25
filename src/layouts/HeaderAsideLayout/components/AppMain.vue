<template>
  <Content :style="{minHeight, background: '#fff', padding: '10px 20px 20px'}">
    <transition mode="out-in" name="fade">
      <router-view></router-view>
    </transition>
  </Content>
</template>

<script>

import { Content } from 'iview';

export default {
  name: 'AppMain',
  components: { Content },
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
