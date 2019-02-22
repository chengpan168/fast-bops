<template>
  <div class="editor">
    <b-crumb :br-list="bcs"/>
    <Form :model="formDatas"
          :label-width="96"
          label-position="left"
          @submit.native.prevent>
      <div class="m-form-contain">
        <Row>
          <Col span="11">
            <FormItem label="选择商户" required>
              <Select
                v-model="formDatas.sellerId"
                clearable>
                <Option v-for="o in sellers"
                        :value="o.id"
                        :key="o.id">{{ o.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="标题" required>
              <Input v-model="formDatas.title"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="策划公司" required>
              <Input v-model="formDatas.planCompany"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="封面图" required>
              <OImgUpload desc="340*340" :maxNum="1" ref="coverImgUpload" :dafaults="defaultCoverAvatar" :maxSize="5" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="13">
            <FormItem label="内容" required>
              <quill-editor v-model="formDatas.description" />
            </FormItem>
          </Col>
        </Row>
      </div>
    </Form>
    <Button type="primary" size="large"  @click.stop="submit">提交</Button>
    <Button size="large" @click.stop="toCancel" style="margin-left: 20px;">取消</Button>
  </div>
</template>
<style lang="less" scoped>
    .editor {
      .address-item /deep/ .ivu-form-item-content {
        margin-left: 10px!important;
      }
    }
</style>
<script>

import OImgUpload from '@comps/CommonImgUpload';
import { Select, Option } from 'iview';
import QuillEditor from '@comps/QuillEditor';

export default {
  name: 'editorCommoditys',
  data() {
    return {
      bcs: [{ title: '商家' }, { title: '婚礼案例' }],
      curId: '',
      isEditor: false,
      routerFromName: '',
      defaultCoverAvatar: [],
      sellers: [],
      isLoading: false,
      formDatas: {
        sellerId: '',
        title: '',
        planCompany: '',
        description: ''
      }
    };
  },
  components: {
    OImgUpload, Select, Option, QuillEditor
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
      const { id, come } = this.$route.query;
      this.curId = id;
      this.isEditor = !!id;
      this.routerFromName = come;
      this.$nextTick(() => {
        this.initBcs();
        this.querySellers();
        this.formDatas = { ...this.formDatas };
      });
    },
    initBcs() {
      const bc = [];
      if (this.isEditor) {
        this.getData();
        bc.push({ title: '编辑' });
      } else {
        bc.push({ title: '添加' });
      }
      this.bcs = [...this.bcs, ...bc];
    },
    querySellers(keywords) {
      this.isLoading = true;
      this.$http().post('/seller/list', {
        keywords,
        productType: 'weddingCase'
      }).then((data) => {
        this.isLoading = false;
        const ret = data.records || [];
        this.sellers = ret;
      })
        .catch(() => {
          this.isLoading = false;
          this.sellers = [];
        });
    },
    getData() {
      this.$http()
        .post('/wc/queryById', { id: this.curId })
        .then((data) => {
          const {
            coverFileDto, description, planCompany,
            coverFileId, title, id, sellerId,
          } = data;
          this.defaultCoverAvatar = [{
            name: coverFileDto.unqFileName,
            dfsId: coverFileDto.unqFileName,
            id: coverFileId
          }];
          this.formDatas = {
            ...this.formDatas,
            sellerId,
            description,
            planCompany,
            title,
            id
          };
        });
    },
    getParams() {
      const covers = this.$refs.coverImgUpload.$refs.imgUpload.getUploadList();
      const params = {
        ...this.formDatas,
        coverFileId: covers.length > 0 ? covers[0].id : ''
      };
      return params;
    },
    submit() {
      const params = this.getParams();
      const isPass = this.isVali(params);
      // if (this.isEditor) {
      //   params.id = this.curId;
      // }
      if (!isPass) return;
      this.$http()
        .post('/wc/save', params)
        .then(() => {
          this.$Message.success('操作成功！');
          this.toCancel();
        });
    },
    isVali(params) {
      let isVali = true;
      let msg = '';
      const {
        title, coverFileId, description, sellerId, planCompany
      } = params;
      if (!description) {
        msg = '请填写简介！';
      }
      if (!coverFileId) {
        msg = '请上传用户封面！';
      }
      if (!planCompany) {
        msg = '请填写策划公司！';
      }
      if (!title) {
        msg = '请填写标题！';
      }
      if (!sellerId) {
        msg = '请选择商户！';
      }
      if (msg) {
        this.$Message.warning(msg);
        isVali = false;
      }
      return isVali;
    },
    toCancel() {
      setTimeout(() => {
        this.$router.go(-1);
      }, 500);
    }
  }
};
</script>
