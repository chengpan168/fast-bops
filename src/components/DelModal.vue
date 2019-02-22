<template>
  <Modal
    width="300"
    v-model="isShow"
    @on-ok="confirm">
    <p>确认删除吗</p>
  </Modal>
</template>
<script>

import { Modal } from 'iview';

export default {
  name: 'delModal',
  data() {
    return {
      isShow: false
    };
  },
  components: { Modal },
  methods: {
    show() {
      this.isShow = true;
    },
    confirm() {
      this.$emit('ok');
    }
  }
};
</script>
