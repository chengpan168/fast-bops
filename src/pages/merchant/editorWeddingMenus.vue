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
            <FormItem label="菜单名称" required>
              <Input v-model="formDatas.name"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="菜单价格" required>
              <Input v-model="price" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>元/桌</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="菜式数量" required>
              <Input v-model="formDatas.foodNum" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>道</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="热菜" required>
              <Input v-model="formDatas.hotFoodNum" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>道</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="冷菜" required>
              <Input v-model="formDatas.coldNum" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>道</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="点心" required>
              <Input v-model="formDatas.dessertNum" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>道</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="水果" required>
              <Input v-model="formDatas.fruitsNum" number></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <div class="tipWrap">
              <span>道</span>
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

import { Select, Option } from 'iview';


export default {
  name: 'editorCommoditys',
  data() {
    return {
      bcs: [{ title: '商家' }, { title: '婚宴菜单' }],
      curId: '',
      isEditor: false,
      routerFromName: '',
      sellers: [],
      isLoading: false,
      price: '',
      formDatas: {
        sellerId: '',
        size: '',
        currentAmount: '',
        originalAmount: '',
        foodNum: '',
        hotFoodNum: '',
        coldNum: '',
        dessertNum: '',
        fruitsNum: '',
        name: ''
      }
    };
  },
  components: { Select, Option },
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
        productType: 'weddingMenu'
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
            name, id, sellerId,
            extProperty, currentAmount, originalAmount
          } = data;
          this.price = currentAmount;
          const ext = JSON.parse(extProperty);
          this.formDatas = {
            ...this.formDatas,
            sellerId,
            name,
            id,
            currentAmount,
            originalAmount,
            ...ext
          };
        });
    },
    getParams() {
      const params = {
        ...this.formDatas,
        currentAmount: this.price,
        originalAmount: this.price,
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
        size, foodNum, hotFoodNum, coldNum, dessertNum, fruitsNum, ...others
      } = params;
      const extProperty = {
        size, foodNum, hotFoodNum, coldNum, dessertNum, fruitsNum
      };
      this.$http()
        .post('/product/save', {
          ...others,
          type: 'weddingMenu',
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
        name, sellerId, foodNum, hotFoodNum, coldNum, dessertNum, fruitsNum, currentAmount
      } = params;
      if (!fruitsNum) {
        msg = '请填写水果数量！';
      }
      if (!dessertNum) {
        msg = '请填写点心数量！';
      }
      if (!coldNum) {
        msg = '请填写冷菜数量！';
      }
      if (!hotFoodNum) {
        msg = '请填写热菜数量！';
      }
      if (!foodNum) {
        msg = '请填写菜式数量！';
      }
      if (!currentAmount) {
        msg = '请填写菜单价格！';
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
