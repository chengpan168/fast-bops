<template>
    <div class="list-wrap">
        <Table
            ref="table"
            @on-selection-change="onSelectChange"
            :columns="columnDefines"
            :data="dataSources"
            highlight-row/>
        <div style="margin: 10px;overflow: hidden" v-if="dataSources.length > 0">
            <div style="float: right;">
                <Page
                        :current="pageInfo.pageIndex"
                        :total="totalCount"
                        @on-change="changePage"
                        @on-page-size-change="changePageSize"
                        show-sizer></Page>
            </div>
        </div>
    </div>
</template>
<script>

import { Page, Table } from 'iview';

export default {
  name: 'commonList',
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    baseUrl: {
      type: String,
      default: ''
    },
    queryParams: {
      type: Object,
      default() {
        return {};
      }
    },
    itemMap: {
      type: Function
    },
    isInit: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Page, Table
  },
  data() {
    return {
      dataSources: [],
      // dataSources: [
      //   {
      //     title: 1,
      //     img: 'https://test-img.3dker.cn/9cbfd74dd9943224825cb25f6942c979@280w_210h_1e_1c_90q.src'
      //   },
      //   {
      //     title: 2,
      //     img: 'https://test-img.3dker.cn/13fb6857002289bb5a085103360da6f2@280w_210h_1e_1c_90q.src'
      //   }],
      initPageInfo: {
        pageIndex: 1,
        pageSize: 10
      },
      pageInfo: null,
      totalCount: 100
    };
  },
  mounted() {
    this.pageInfo = { ...this.initPageInfo };
    if (this.isInit) this.doFetch();
  },
  computed: {
    columnDefines() {
      return this.tranDefineToColumns(this.columns);
    },
    reqUrl() {
      return this.baseUrl;
    },
    reqParams() {
      return { ...this.queryParams };
    }
  },
  watch: {
    reqParams() {
      this.pageInfo = { ...this.initPageInfo };
      this.doFetch();
    }
  },
  methods: {
    refresh() {
      this.doFetch();
    },
    doFetch() {
      // console.log('doFetch');
      // console.log('reqUrl', this.reqUrl);
      // console.log('reqParams', this.reqParams);
      // console.log('pageInfo', this.pageInfo);
      const { pageIndex: current, pageSize: size } = this.pageInfo;
      this.$http().post(this.reqUrl, { ...this.reqParams, current, size }).then((data) => {
        let ret = data.records || [];
        if (this.itemMap && this.itemMap instanceof Function) {
          ret = ret.map(this.itemMap);
        }
        this.dataSources = ret;
        this.changeTotalCount(data.total);
      });
    },
    tranDefineToColumns(val = []) {
      return val.map(item => item);
    },
    changePage(pn) {
      this.pageInfo.pageIndex = pn;
      this.doFetch();
    },
    changePageSize(size) {
      this.pageInfo.pageSize = size;
      if (this.pageInfo.pageIndex === 1) {
        this.doFetch();
      }
    },
    changeTotalCount(totalCount) {
      this.totalCount = totalCount;
    },
    onSelectChange(selection) {
      this.$emit('on-selection-change', selection);
    },
    handleSelectAll(status) {
      this.$refs.table.selectAll(status);
    },
    exportData(obj = {}) {
      this.$refs.table.exportCsv(obj);
    }
  }
};
</script>
<style lang="less" scoped>
    .list-wrap{
        margin-top: 20px;
    }
</style>
