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
            <FormItem label="标题" required>
              <Input v-model="formDatas.title"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="图片" required>
              <OImgUpload :desc="imgDesc" :maxNum="1" ref="imgUpload" :dafaults="defaultAvatar" :maxSize="10" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <div class="sort-item">
              <FormItem label="排序" required>
                <InputNumber v-model="formDatas.sort"></InputNumber>
              </FormItem>
            </div>
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
      .sort-item /deep/ .ivu-form-item-content {
        width: 80px;
      }
    }
</style>
<script>

import OImgUpload from '@comps/CommonImgUpload';
import { recConstants } from '@/constant';
import { InputNumber } from 'iview';


export default {
  name: 'editorRecommend',
  data() {
    return {
      bcs: [{ title: '首页' }],
      curId: '',
      isEditor: false,
      defaultAvatar: [],
      routerFromName: '',
      formDatas: {
        title: '',
        sort: '',
        href: 'sd'
      },
      imgDesc: ''
    };
  },
  components: { OImgUpload, InputNumber },
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
      const { id, key } = this.$route.query;
      this.curId = id;
      this.isEditor = !!id;
      this.routerFromName = key;
      this.$nextTick(() => {
        this.imgDesc = recConstants[this.routerFromName].imgDesc;
        this.initBcs();
        this.formDatas = { ...this.formDatas, type: recConstants[this.routerFromName].queryParams.type };
      });
    },
    initBcs() {
      const bc = [];
      bc.push({ title: recConstants[this.routerFromName].title });
      if (this.isEditor) {
        this.getData();
        bc.push({ title: '编辑' });
      } else {
        bc.push({ title: '添加' });
      }
      this.bcs = [...this.bcs, ...bc];
    },
    getData() {
      this.$http()
        .post('/plat/queryById', { id: this.curId })
        .then((data) => {
          const {
            imageFileDto, sort, title, id, imageFileId
          } = data;
          this.defaultAvatar = [{
            name: imageFileDto.unqFileName,
            dfsId: imageFileDto.unqFileName,
            id: imageFileId
          }];
          this.formDatas = {
            ...this.formDatas,
            imageFileId,
            sort,
            title,
            id
          };
        });
    },
    getParams() {
      const imgs = this.$refs.imgUpload.$refs.imgUpload.getUploadList();
      const params = {
        ...this.formDatas,
        imageFileId: imgs.length > 0 ? imgs[0].id : ''
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
        .post('/plat/save', params)
        .then(() => {
          this.$Message.success('操作成功！');
          this.toCancel();
        });
    },
    isVali(params) {
      let isVali = true;
      let msg = '';
      const { imageFileId, sort, title } = params;
      if (!sort) {
        msg = '请填写排序！';
      }
      if (!imageFileId) {
        msg = '请上传图片！';
      }
      if (!title) {
        msg = '请填写标题！';
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
