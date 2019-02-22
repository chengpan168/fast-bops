<template>
  <Modal v-model="visible" width="360">
    <p slot="header" style="color:#ff9900;">
      <Icon type="md-help-circle"/>
      <span>删除</span>
    </p>
    <div>
      <p>删除后无法恢复</p>
      <p>确认要删除该条记录吗？</p>
    </div>
    <div slot="footer">
      <Button @click="onCancel" type="text">取消</Button>
      <Button :loading="loading" @click="onOk" type="warning">删除</Button>
    </div>
  </Modal>
</template>
<script>

import { Modal } from 'iview';

export default {
  name: 'deleteModal',
  props: {
    deleteUrl: {
      type: String,
      default: '',
    },
    id: [Object, Number, String]
  },
  data() {
    return {
      visible: false,
      loading: false
    };
  },
  components: { Modal },
  methods: {
    show() {
      this.visible = true;
    },
    onCancel() {
      this.visible = false;
      this.$emit('on-cancel');
    },
    onOk() {
      if (!this.deleteUrl) {
        this.$Message.error('请设置删除路径');
        return;
      }
      this.$http().post(this.deleteUrl, { id: this.id }).then((data) => {
        console.log(data);
        this.$emit('on-success');
      }).catch(() => {
        this.$emit('on-error');
      });
      this.$emit('on-ok');
    }
  }
};
</script>
