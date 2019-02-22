<template>
  <div class="wrap">
    <div style="margin-bottom: 20px;">
      <b-crumb :br-list="bcs" />
      <div class="editor-wrap">
        <quill-editor v-model="content" />
      </div>
    </div>
    <Button type="primary" size="large"  @click.stop="saveData">保存</Button>
  </div>
</template>
<script>

import QuillEditor from '@comps/QuillEditor';

export default {

  name: 'faustus',
  data() {
    return {
      bcs: [{ title: '系统管理' }, { title: '黄道吉日' }],
      content: ''
    };
  },
  mounted() {
    this.getData();
  },
  components: { QuillEditor },
  methods: {
    getData() {
      this.$http()
        .post('/ar/queryByType', { type: 'niceDay' }, { isKv: true })
        .then((ret) => {
          this.content = ret.val;
        });
    },
    saveData() {
      this.$http()
        .post('/ar/update', { type: 'niceDay', val: this.content }, { isKv: true })
        .then(() => {
          this.$Message.success('保存成功！');
        }).catch(() => {
          this.$Message.error('保存失败！');
        });
    }
  }
};

</script>
<style lang="less" scoped>
  .wrap{
    text-align: left;
  }
  .editor-wrap{
    margin-top: 20px;
    width: 600px;
  }
</style>
