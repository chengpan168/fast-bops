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
            <FormItem label="名称" required>
              <Input v-model="formDatas.name"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="图标" required>
              <OImgUpload desc="100*100" :maxNum="1" ref="imgUpload" :dafaults="defaultAvatar" :maxSize="5" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <div class="sort-item">
              <FormItem label="排序" required>
                <InputNumber v-model="formDatas.sort" />
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
import { InputNumber } from 'iview';

export default {
  name: 'editorBanners',
  data() {
    return {
      bcs: [{ title: '首页' }, { title: '商家分类' }],
      curId: '',
      isEditor: false,
      defaultAvatar: [],
      formDatas: {
        name: '',
        sort: ''
      }
    };
  },
  components: { OImgUpload, InputNumber },
  mounted() {
    const { id } = this.$route.query;
    this.curId = id;
    this.isEditor = !!id;
    this.$nextTick(this.init);
  },
  methods: {
    init() {
      let bc = { title: '添加' };
      if (this.isEditor) {
        this.getData();
        bc = { title: '编辑' };
      }
      this.bcs.push(bc);
    },
    getData() {
      this.$http()
        .post('/category/queryById', { id: this.curId })
        .then((data) => {
          const {
            imageFileDto, sort, name, id, imageFileId
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
            name,
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
      if (!isPass) return;
      this.$http()
        .post('/category/save', params)
        .then(() => {
          this.$Message.success('操作成功！');
          this.toCancel();
        });
    },
    isVali(params) {
      let isVali = true;
      let msg = '';
      const { imageFileId, sort, name } = params;
      if (!sort) {
        msg = '请填写排序！';
      }
      if (!imageFileId) {
        msg = '请上传图片！';
      }
      if (!name) {
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
