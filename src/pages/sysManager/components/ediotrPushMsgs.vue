<template>
  <Modal
    width="360"
    v-model="isShow"
    :loading="loading"
    title="编辑消息"
    @on-ok="confirm">
    <div class="msg-wrap">
      <Form
        :model="formDatas"
        :label-width="96"
        label-position="left"
        @submit.native.prevent
      >
        <Row>
          <Col>
            <FormItem label="标题" required>
              <Input v-model="formDatas.title"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="内容" required>
              <Input v-model="formDatas.content"
                     type="textarea"
                     :autosize="{minRows: 2,maxRows: 5}"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  </Modal>
</template>
<style lang="less" scoped>
.apply {
  &-wrap {
    height: 400px;
    overflow: scroll;
  }
  &-tip {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
  }
}
</style>
<script>
import {
  Modal, Row, Col, Form, FormItem, Input
} from 'iview';

const initDatas = {
  title: '',
  content: ''
};

export default {
  name: 'editorMsgs',
  props: {},
  data() {
    return {
      isShow: false,
      loading: true,
      formDatas: {
        ...initDatas
      }
    };
  },
  components: {
    Modal,
    Row,
    Col,
    Form,
    FormItem,
    Input
  },
  watch: {
    isShow(val) {
      if (!val) {
        this.formDatas = { ...this.initData };
      }
    }
  },
  methods: {
    show(params) {
      if (params) {
        this.formDatas = {
          ...this.formDatas,
          ...params
        };
      }
      this.$nextTick(() => {
        this.isShow = true;
      });
    },
    messageWarningFn(text) {
      this.$Message.warning(text);
      setTimeout(() => {
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true;
        });
      }, 500);
    },
    confirm() {
      const { title, content } = this.formDatas;
      let msg = '';
      if (!title) {
        msg = '请填写标题！';
      }
      if (!content) {
        msg = '请填写内容！';
      }
      if (msg) {
        this.messageWarningFn(msg);
        return;
      }
      this.$http()
        .post('/message/save', this.formDatas)
        .then(() => {
          this.isShow = false;
          this.$Message.success('操作成功');
          this.$emit('ok');
        });
    }
  }
};
</script>
