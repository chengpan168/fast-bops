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
            <FormItem label="商户分类" required>
              <Select
                v-model="formDatas.categoryId"
                :disabled="isEditor"
                clearable>
                <Option v-for="o in categorys"
                        :value="o.id"
                        :key="o.id">{{ o.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>提交后商户分类不可更改！</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="商户名称" required>
              <Input v-model="formDatas.name"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="5">
            <FormItem label="商户地址" required>
              <Select
                v-model="formDatas.districtCode"
                clearable>
                <Option v-for="o in addresss"
                        :value="o.code"
                        :key="o.id">{{ o.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <div class="address-item">
              <FormItem>
                <Input v-model="formDatas.address"></Input>
              </FormItem>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="商户电话" required>
              <Input v-model="formDatas.phone"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="客服微信" required>
              <Input v-model="formDatas.customerServiceWxAccount"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="商户简介" required>
              <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                     v-model="formDatas.description"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="商户logo" required>
              <OImgUpload desc="200像素以上正方形最佳" :maxNum="1" ref="logoImgUpload"
                          :dafaults="defaultLogoAvatar" :maxSize="5" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="商户封面" required>
              <OImgUpload desc="750*300" :maxNum="1" ref="coverImgUpload" :dafaults="defaultCoverAvatar" :maxSize="5" />
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
      .tipWrap{
        text-align: left;
        padding-left: 10px;
        line-height: 30px;
      }
    }
</style>
<script>

import OImgUpload from '@comps/CommonImgUpload';
import { Select, Option } from 'iview';


export default {
  name: 'editorMerchant',
  data() {
    return {
      bcs: [{ title: '商家' }, { title: '商家列表' }],
      curId: '',
      isEditor: false,
      addresss: [],
      addressName: '',
      defaultLogoAvatar: [],
      defaultCoverAvatar: [],
      categorys: [],
      formDatas: {
        categoryId: '',
        cityCode: '330400',
        cityName: '嘉兴市',
        districtCode: '',
        districtName: '',
        address: '',
        name: '',
        phone: '',
        customerServiceWxAccount: '',
        description: ''
      }
    };
  },
  components: { OImgUpload, Select, Option },
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
      const { id } = this.$route.query;
      this.curId = id;
      this.isEditor = !!id;
      this.$nextTick(() => {
        this.initBcs();
        this.queryClassify();
        this.queryAddress();
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
    queryClassify() {
      this.$http().post('/category/list', {
        current: 1,
        size: 99
      }).then((data) => {
        const ret = data.records || [];
        this.categorys = ret;
      })
        .catch(() => {
          this.categorys = [];
        });
    },
    queryAddress() {
      this.$http().post('/region/queryByParam', {
        parent: '330400',
        current: 1,
        size: 99
      }).then((data) => {
        const ret = data || [];
        this.addresss = ret;
      })
        .catch(() => {
          this.addresss = [];
        });
    },
    getData() {
      this.$http()
        .post('/seller/queryById', { id: this.curId })
        .then((data) => {
          const {
            coverFileDto, districtCode, districtName, address,
            phone, customerServiceWxAccount, description,
            coverFileId, name, id, logoFileDto, logoFileId, categoryId
          } = data;
          this.defaultLogoAvatar = [{
            name: logoFileDto.unqFileName,
            dfsId: logoFileDto.unqFileName,
            id: logoFileId
          }];
          this.defaultCoverAvatar = [{
            name: coverFileDto.unqFileName,
            dfsId: coverFileDto.unqFileName,
            id: coverFileId
          }];
          this.formDatas = {
            ...this.formDatas,
            categoryId,
            districtCode,
            districtName,
            address,
            phone,
            customerServiceWxAccount,
            description,
            name,
            id
          };
        });
    },
    getParams() {
      const logos = this.$refs.logoImgUpload.$refs.imgUpload.getUploadList();
      const covers = this.$refs.coverImgUpload.$refs.imgUpload.getUploadList();
      let districtName = '';
      if (this.formDatas.districtCode) {
        const f = this.addresss.find(v => v.code === this.formDatas.districtCode);
        if (f) districtName = f.name;
      }
      const params = {
        ...this.formDatas,
        districtName,
        coverFileId: covers.length > 0 ? covers[0].id : '',
        logoFileId: logos.length > 0 ? logos[0].id : ''
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
        .post('/seller/save', params)
        .then(() => {
          this.$Message.success('操作成功！');
          this.toCancel();
        });
    },
    isVali(params) {
      let isVali = true;
      let msg = '';
      const {
        districtName, address, name, logoFileId, coverFileId, phone,
        description, customerServiceWxAccount, categoryId
      } = params;
      if (!coverFileId) {
        msg = '请上传用户封面！';
      }
      if (!logoFileId) {
        msg = '请上传logo！';
      }
      if (!description) {
        msg = '请填写商户简介！';
      }
      if (!customerServiceWxAccount) {
        msg = '请填写客服微信！';
      }
      if (!phone) {
        msg = '请填写手机号！';
      }
      if (!districtName || !address) {
        msg = '请完善地址！';
      }
      if (!name) {
        msg = '请填写标题！';
      }
      if (!categoryId) {
        msg = '请选择分类！';
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
