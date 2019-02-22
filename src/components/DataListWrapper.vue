<template>
  <div class="data-list-wrapper">
    <data-list-query
      :items="queryItems"
      @on-query="search"
      v-model="queryParams"
    />
    <data-list
      :columns="columns"
      :data-item-handler="dataItemHandler"
      :queryParams="queryParams"
      :queryUrl="queryUrl"
      ref="dataList"
    />
    <delete-modal v-if="deleteUrl" ref="deleteModal" :deleteUrl="deleteUrl" @on-success="onDeleteSuccess"/>
  </div>
</template>
<script>
import logger from '@/utils/logger.js';

export default {
  name: 'DataListWrapper',
  props: {
    queryItems: {
      type: Array,
      default() {
        return [];
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    dataItemHandler: {
      type: Function
    },
    queryUrl: {
      type: String
    },
    deleteUrl: {
      type: String
    }
  },
  components: {},
  data() {
    return {
      queryParams: {}
    };
  },
  mounted() {
  },
  computed: {},
  watch: {},
  methods: {
    search() {
      this.$refs.dataList.refresh();
      logger.debug('table data query search:', this.queryParams);
    },
    readyDelete(row) {
      logger.info('show delete modal,', row);
      this.$refs.deleteModal.show();

      /* this.$Modal.confirm({
        title: '确认',
        content: '<p>删除后无法恢复</p><p>确认删除该条记录吗？</p>',
        onOk: () => {
          this.$Message.info('Clicked ok');
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel');
        }
      }); */
    },
    onDeleteSuccess() {
      this.search();
    }
  }
};
</script>
<style lang="less" scoped>
  .data-list-wrapper {
  }
</style>
