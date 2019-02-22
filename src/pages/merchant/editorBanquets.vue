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
            <FormItem label="名称" required>
              <Input v-model="formDatas.name"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="封面图" required>
              <OImgUpload desc="340*340" :maxNum="1" ref="coverImgUpload"
                          :dafaults="defaultCoverAvatar" :maxSize="5" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="起订桌数" required>
              <Input v-model="formDatas.startTableNum" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>桌</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="最大桌数" required>
              <Input v-model="formDatas.maxTableNum" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>桌</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="面积" required>
              <Input v-model="formDatas.area" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>平方米</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="棚高" required>
              <Input v-model="formDatas.shedHeight" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>米</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="柱子数量" required>
              <Input v-model="formDatas.pillarNum" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>根</span>
            </div>
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
import QuillEditor from '@comps/QuillEditor';

export default {
  name: 'editorCommoditys',
  data() {
    return {
      bcs: [{ title: '商家' }, { title: '宴会厅' }],
      curId: '',
      isEditor: false,
      routerFromName: '',
      defaultCoverAvatar: [],
      sellers: [],
      isLoading: false,
      formDatas: {
        sellerId: '',
        startTableNum: '',
        maxTableNum: '',
        area: '',
        shedHeight: '',
        pillarNum: '',
        name: '',
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
        productType: 'banquetHall'
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
        .post('/product/queryById', { id: this.curId })
        .then((data) => {
          const {
            coverFileDto, description,
            coverFileId, name, id, sellerId,
            extProperty
          } = data;
          const ext = JSON.parse(extProperty);
          this.defaultCoverAvatar = [{
            name: coverFileDto.unqFileName,
            dfsId: coverFileDto.unqFileName,
            id: coverFileId
          }];
          this.formDatas = {
            ...this.formDatas,
            sellerId,
            description,
            name,
            id,
            ...ext
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
      const {
        startTableNum, maxTableNum, area, shedHeight, pillarNum, ...others
      } = params;
      const extProperty = {
        startTableNum, maxTableNum, area, shedHeight, pillarNum
      };
      this.$http()
        .post('/product/save', {
          ...others,
          type: 'banquetHall',
          extProperty: JSON.stringify(extProperty)
        }, { isJson: true })
        .then(() => {
          this.$Message.success('操作成功！');
          this.toCancel();
        });
    },
    isVali(params) {
      let isVali = true;
      let msg = '';
      const {
        name, coverFileId, description, sellerId, startTableNum, maxTableNum, area, shedHeight, pillarNum
      } = params;
      if (!description) {
        msg = '请填写简介！';
      }
      if (!pillarNum) {
        msg = '请填写柱子数量！';
      }
      if (!shedHeight) {
        msg = '请填写最大棚高！';
      }
      if (!area) {
        msg = '请填写面积！';
      }
      if (!maxTableNum) {
        msg = '请填写最大桌数！';
      }
      if (!startTableNum) {
        msg = '请填写起订桌数！';
      }
      if (!coverFileId) {
        msg = '请上传用户封面！';
      }
      if (!name) {
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
