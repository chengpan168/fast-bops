<template>
  <Modal
    width="1080"
    v-model="isShow"
    title="报名管理"
    @on-ok="confirm">

    <div class="apply-wrap">
      <div class="apply-tip">
        <div>
          <span>{{ `已报名${userTotal}人，` }}</span>
          <span>{{ `购买${totalNum}份` }}</span>
        </div>
        <Button type="primary" @click="exportData">导出</Button>
      </div>
      <common-list
        v-if="queryParams.productId"
        ref="list"
        baseUrl="/order/list"
        :isInit="false"
        :itemMap="listItemMap"
        :query-params="queryParams"
        :columns="listColumns"
      />
    </div>
  </Modal>
</template>
<style lang="less" scoped>
  .apply{
    &-wrap{
       height: 400px;
       overflow: scroll;
     }
    &-tip{
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;
    }
  }
</style>
<script>

import { Modal, Button } from 'iview';

export default {
  name: 'comments',
  props: {
    defaults: {
      type: Array
    }
  },
  data() {
    return {
      isShow: false,
      totals: 0,
      userTotal: 0,
      totalNum: 0,
      selects: [],
      queryParams: {
      },
      listColumns: [

      ],
      ext: {},
      title: ''
    };
  },
  mounted() {
    this.initColumns();
  },
  components: { Modal, Button },
  watch: {
    isShow(val) {
      if (val) {
        this.$refs.list.refresh();
      } else {
        this.queryParams = { ...this.queryParams, productId: '' };
        this.totals = 0;
      }
    }
  },
  methods: {
    exportData() {
      this.$refs.list.exportData();
    },
    show(id, ext = {}) {
      this.queryParams = { ...this.queryParams, productId: id };
      this.ext = { ...ext };
      this.getTotal(id);
      this.$nextTick(() => {
        this.isShow = true;
      });
    },
    getTotal(id) {
      this.$http()
        .post('/product/total', { id })
        .then((data) => {
          const { totalNum, totalUserNum } = data;
          this.totalNum = totalNum || 0;
          this.userTotal = totalUserNum || 0;
        });
    },
    confirm() {
      this.isShow = false;
      // this.$emit('on-art-select', [...this.selects]);
      // this.$refs.list.handleSelectAll(false);
    },
    initColumns() {
      this.listColumns = [
        {
          title: '编号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '昵称',
          key: 'nickName'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '电话',
          key: 'phone'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '购买份数',
          key: 'num'
        }
      ];
    },
    listItemMap(item) {
      return { ...item, ...item.userDto };
    }
  }
};
</script>
