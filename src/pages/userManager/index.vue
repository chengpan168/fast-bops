<template>
  <div class="wrap">
    <div style="margin-bottom: 20px;">
      <bread-crumb-wrapper :items="bcs" />
      <data-list-wrapper
          ref="dataListWrapper"
          :data-item-handler="listItemMap"
          query-url="/user/list"
          :query-items="items"
          :columns="listColumns"
      />
    </div>
  </div>
</template>
<script>


export default {

  name: 'users',
  data() {
    return {
      bcs: [],
      items: [],
      queryParams: {
        name: ''
      },
      listColumns: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initBcs();
      this.initColumns();
      this.initQueryItems();
    });
  },
  methods: {
    initQueryItems() {
      this.items = [
        {
          label: '用户名',
          placeholder: '用户名',
          type: 'input',
          model: 'name'
        },
        {
          label: '婚期时间',
          placeholder: '请选择',
          type: 'daterange',
          model: 'timeRange'
        }
      ];
    },
    paramsChange(params) {
      console.log('params', params);
      const { timeRange, ...others } = params;
      const isTimeEx = timeRange && timeRange.length > 1;
      this.queryParams = {
        ...this.queryParams,
        ...others,
        beginMarryTime: isTimeEx ? this.getData(timeRange[0]) : '',
        endMarryTime: isTimeEx ? this.getData(timeRange[1]) : ''
      };
    },
    initBcs() {
      this.bcs = [{ title: '用户管理' }, { title: '用户列表' }];
    },
    listItemMap(item) {
      return { ...item, marryTimeDesc: this.getData(item.marryTime) };
    },
    initColumns() {
      this.listColumns = [
        {
          type: 'id',
          title: '用户id',
          key: 'id'
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
          type: 'phone'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          type: 'date',
          title: '婚期',
          key: 'marryTimeDesc'
        },
        {
          type: 'datetime',
          title: '创建时间',
          key: 'registTime'
        }
      ];
    },
    getData(ts) {
      if (!ts) return '';
      return '';
    }
  }

};

</script>
<style lang="less" scoped>
.wrap {
  text-align: left;
}
</style>
