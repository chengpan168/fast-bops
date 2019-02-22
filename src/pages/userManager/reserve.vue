<template>
  <div class="wrap">
    <div style="margin-bottom: 20px;">
      <b-crumb :br-list="bcs" :action="exportData" title="导出名单" />
      <header-query v-on:on-params-change="paramsChange" :items="items" />
      <common-list
        ref="list"
        baseUrl="/subscribe/list"
        :itemMap="listItemMap"
        :query-params="queryParams"
        :columns="listColumns"
      />
    </div>
  </div>
</template>
<script>


export default {

  name: 'reserves',
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
          pl: '用户名',
          type: 'input',
          model: 'name'
        }
        // {
        //   label: '手机号',
        //   pl: '支持模糊查询',
        //   type: 'input',
        //   model: 'phone'
        // }
      ];
    },
    paramsChange(params) {
      console.log('params', params);
      this.queryParams = { ...this.queryParams, ...params };
      // const v = {};
      // if (params.sortField) {
      //   const sortField = params.sortField === 'gmtCreate' ? 'gmtCreate' : 'demandOrdersNum';
      //   v.sortField = sortField;
      //   v.sortType = sortField === 'demandOrdersNumUp' ? 'desc' : 'asc';
      // }
      // this.$set(this.queryParams, 'demandQueryDto', {
      //   ...this.queryParams.demandQueryDto,
      //   ...params,
      //   ...v
      // });
    },
    initBcs() {
      this.bcs = [{ title: '用户管理' }, { title: '预约用户' }];
    },
    listItemMap(item) {
      const { userDto, sellerDto } = item;
      const {
        name, nickName, phone, address
      } = userDto;
      return {
        ...item,
        sellerName: sellerDto && sellerDto.name,
        nickName,
        name,
        phone,
        address
      };
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
          title: '用户id',
          key: 'userId'
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
          title: '手机号',
          key: 'phone'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '婚期',
          key: 'marryTime'
        },
        {
          title: '预约商家',
          key: 'sellerName'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          render: this.renderAction
        }
      ];
    },
    renderAction(h, params) {
      const { isHandle } = params.row;
      const desc = isHandle === 'y' ? '已处理' : '未处理';
      return h(
        'div',
        {
          style: {
            display: 'flex',
            'flex-direction': 'column'
          },
          class: 'actionWrap'
        },
        [
          h('Button', {
            props: {
              type: isHandle === 'y' ? 'warning' : 'primary',
              size: 'small'
            },
            style: {
              marginTop: '8px'
            },
            on: {
              click: () => {
                this.toggle(params.row);
              }
            }
          }, desc)
        ],
      );
    },

    toggle(row) {
      const { id, isHandle } = row;
      this.$http()
        .post('/subscribe/updateHandler', { id, isHandler: isHandle === 'y' ? 'n' : 'y' })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },

    exportData() {
      this.$refs.list.exportData();
    }

  }

};

</script>
<style lang="less" scoped>
  .wrap{
    text-align: left;
  }
</style>
