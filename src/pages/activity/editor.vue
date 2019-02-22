<template>
  <div class="editor">
    <b-crumb :br-list="bcs"/>
    <Form :label-width="96"
          :model="formDatas"
          @submit.native.prevent
          label-position="left">
      <div class="m-form-contain">
        <Row>
          <Col span="11">
            <FormItem label="选择商户" required>
              <select-wrapper
                :items="sellers"
                clearable
                v-model="formDatas.sellerId"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="标题" required>
              <Input v-model="formDatas.name"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="副标题" required>
              <Input v-model="formDatas.avocationTitle"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="封面图" required>
              <OImgUpload :dafaults="defaultCoverAvatar" :maxNum="1" :maxSize="5"
                          desc="702*360" ref="coverImgUpload"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="活动人数" required>
              <Input number v-model="formDatas.productActivityExtDto.activityNum"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="价格">
              <Input number placeholder="不填默认免费" v-model="price"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="报名时间" required>
              <date-range-wrapper
                :end.sync="formDatas.productActivityExtDto.endTime"
                :start.sync="formDatas.productActivityExtDto.startTime"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="内容" required>
              <quill-editor v-model="formDatas.description"/>
            </FormItem>
          </Col>
        </Row>
      </div>
    </Form>
    <Button @click.stop="submit" size="large" type="primary">提交</Button>
    <Button @click.stop="toCancel" size="large" style="margin-left: 20px;">取消</Button>
  </div>
</template>
<style lang="less" scoped>
  .editor {
    .address-item /deep/ .ivu-form-item-content {
      margin-left: 10px !important;
    }
  }
</style>
<script>

import OImgUpload from '@comps/CommonImgUpload';
import QuillEditor from '@comps/QuillEditor';

export default {
  name: 'editorActivitys',
  data() {
    return {
      bcs: [{ title: '活动' }],
      curId: '',
      isEditor: false,
      defaultCoverAvatar: [],
      sellers: [],
      isLoading: false,
      price: '',
      dateTimeRange: [],
      formDatas: {
        sellerId: '',
        currentAmount: '',
        originalAmount: '',
        name: '',
        avocationTitle: '',
        description: '',
        productActivityExtDto: {
          activityNum: '',
          activitySignUpNum: '',
          startTime: '',
          endTime: ''
        }
      }
    };
  },
  components: {
    OImgUpload, QuillEditor
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
      const { id } = this.$route.query;
      this.curId = id;
      this.isEditor = !!id;
      this.$nextTick(() => {
        this.initBcs();
        this.querySellers();
      });
    },
    initBcs() {
      const bc = [];
      bc.push({ title: '活动列表' });
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
        productType: 'activity'
      }).then((data) => {
        this.isLoading = false;
        const ret = data.records || [];
        this.sellers = ret;
      }).catch(() => {
        this.isLoading = false;
        this.sellers = [];
      });
    },
    getData() {
      this.$http().post('/product/queryById', { id: this.curId }).then((data) => {
        const {
          coverFileDto, description, currentAmount, originalAmount,
          coverFileId, name, id, sellerId, productActivityExtDto,
          avocationTitle
        } = data;
        this.defaultCoverAvatar = [
          {
            name: coverFileDto.unqFileName,
            dfsId: coverFileDto.unqFileName,
            id: coverFileId
          }];
        this.price = currentAmount;
        this.dateTimeRange = [productActivityExtDto.startTime, productActivityExtDto.endTime];
        this.formDatas = {
          ...this.formDatas,
          sellerId,
          currentAmount,
          originalAmount,
          description,
          productActivityExtDto,
          name,
          avocationTitle,
          id
        };
      });
    },
    getParams() {
      const covers = this.$refs.coverImgUpload.$refs.imgUpload.getUploadList();
      const [startTime, endTime] = ['', ''];

      const params = {
        ...this.formDatas,
        coverFileId: covers.length > 0 ? covers[0].id : '',
        currentAmount: this.price,
        originalAmount: this.price,
        productActivityExtDto: {
          ...this.formDatas.productActivityExtDto,
          startTime,
          endTime
        }
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
      this.$http().post('/product/save', { ...params, type: 'activity' }, { isJson: true }).then(() => {
        this.$Message.success('操作成功！');
        this.toCancel();
      });
    },
    isVali(params) {
      let isVali = true;
      let msg = '';
      const {
        name, coverFileId, description, sellerId, productActivityExtDto, avocationTitle
      } = params;
      const {
        activityNum,
        startTime,
        endTime
      } = productActivityExtDto;
      if (!description) {
        msg = '请填写内容！';
      }
      if (!startTime || !endTime) {
        msg = '请选择时间！';
      }
      // if (!currentAmount) {
      //   msg = '请填写价格！';
      // }
      if (!activityNum) {
        msg = '请填写活动人数！';
      }
      if (!coverFileId) {
        msg = '请上传用户封面！';
      }
      if (!avocationTitle) {
        msg = '请填写副标题！';
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
        window.open('/activitys');
        this.$router.go(-1);
      }, 500);
    }
  }
};
</script>
