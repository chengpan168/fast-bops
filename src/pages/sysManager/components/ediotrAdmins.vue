<template>
  <Modal
    width="360"
    v-model="isShow"
    :loading="loading"
    title="编辑管理员"
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
            <FormItem label="姓名" required>
              <Input v-model="formDatas.name"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="电话" required>
              <Input v-model="formDatas.phone"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="密码" required>
              <Input v-model="formDatas.password"></Input>
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
  name: '',
  phone: '',
  password: ''
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
      const { name, phone, password } = this.formDatas;
      let msg = '';
      if (!password) {
        msg = '请填写密码！';
      }
      if (!phone) {
        msg = '请填写手机号！';
      }
      if (!name) {
        msg = '请填写姓名！';
      }
      if (msg) {
        this.messageWarningFn(msg);
        return;
      }
      this.$http()
        .post('/manager/add', this.formDatas)
        .then(() => {
          this.isShow = false;
          this.$Message.success('操作成功');
          this.$emit('ok');
        });
    }
  }
};
</script>
