<template>
  <div class="data-list">
    <Table
      :columns="columnDefines"
      :data="dataSources"
      :loading="loading"
      @on-selection-change="onSelectChange"
      highlight-row
      ref="table"/>
    <div style="margin: 10px;overflow: hidden" v-if="dataSources.length > 0">
      <div style="float: right;">
        <Page
          :current="pageInfo.current"
          :total="totalCount"
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
          show-sizer></Page>
      </div>
    </div>
  </div>
</template>
<script>
import logger from '@/utils/logger';
import { Page, Table } from 'iview';
import format from 'date-fns/format';

export default {
  name: 'DataList',
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    queryUrl: {
      type: String,
      default: '',
    },
    queryParams: {
      type: Object,
      default() {
        return {};
      },
    },
    dataItemHandler: {
      type: Function,
    },
    isInit: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Page, Table,
  },
  data() {
    return {
      dataSources: [],
      initPageInfo: {
        current: 1,
        size: 10,
      },
      pageInfo: {
        current: 1,
        size: 10,
      },
      totalCount: 100,
      loading: false,
    };
  },
  mounted() {
    if (this.isInit) this.doFetch();
  },
  computed: {
    columnDefines() {
      return this.tranDefineToColumns(this.columns);
    },
    reqParams() {
      return { ...this.queryParams, ...this.pageInfo };
    },
  },
  watch: {},
  methods: {
    refresh() {
      this.doFetch();
    },
    doFetch() {
      this.loading = true;
      this.$http().get(this.queryUrl, { params: this.reqParams }).then((data) => {
        let ret = data.records || [];
        if (this.dataItemHandler && this.dataItemHandler instanceof Function) {
          ret = ret.map(this.dataItemHandler);
        }
        this.dataSources = ret;
        this.totalCount = data.total;
        this.loading = false;
      }).catch((err) => {
        logger.error('load table data error', err);
        this.loading = false;
      });
    },
    tranDefineToColumns(val = []) {
      return val.map((item) => {
        if (item.type === 'id') {
          return Object.assign({
            title: 'ID',
            key: 'id',
            align: 'center'
          }, item);
        }
        if (item.type === 'phone') {
          return Object.assign({
            align: 'center',
            title: '手机号',
            key: 'phone',
            width: 110
          }, item);
        }
        if (item.type === 'date') {
          return Object.assign({
            align: 'center',
            title: '',
            width: 100,
            render(h, params) {
              let date = params.row[item.key];
              if (date) {
                date = format(date, 'YYYY-MM-DD');
              } else {
                date = '';
              }
              return h('span', date);
            }
          }, item);
        }
        if (item.type === 'datetime') {
          return Object.assign({
            align: 'center',
            title: '',
            width: 100
          }, item);
        }
        if (item.type === 'operator') {
          return Object.assign({
            align: 'center',
            title: '操作',
          }, item);
        }
        return item;
      });
    },
    onPageChange(pn) {
      this.pageInfo.current = pn;
      this.doFetch();
    },
    onPageSizeChange(size) {
      this.pageInfo.size = size;
      if (this.pageInfo.current === 1) {
        this.doFetch();
      }
    },
    onSelectChange(selection) {
      this.$emit('on-selection-change', selection);
    },
    handleSelectAll(status) {
      this.$refs.table.selectAll(status);
    },
    exportData(obj = {}) {
      logger.info('导出表格数据 csv');
      this.$refs.table.exportCsv(obj);
    },
  },
};
</script>
<style lang="less" scoped>
  .data-list {
    margin-top: 10px;
  }
</style>
