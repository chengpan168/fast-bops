<template>
  <div class="wrap">
    <div style="margin-bottom: 20px;">
      <b-crumb :br-list="bcs" title="添加" :action="add" />
      <common-list
        ref="list"
        baseUrl="/hkw/list"
        :itemMap="listItemMap"
        :query-params="queryParams"
        :columns="listColumns"
      />
    </div>
    <del-modal ref="delModal" @ok="delAction" />
  </div>
</template>
<script>

import { statusMap, statusReverseMap } from '@/constant';


export default {

  name: 'antistops',
  data() {
    return {
      bcs: [{ title: '商家' }, { title: '热搜关键词' }],
      items: [],
      queryParams: {},
      listColumns: [],
      delAction: () => {}
    };
  },
  mounted() {
    this.initColumns();
  },
  methods: {
    listItemMap(item) {
      return { ...item, statusDesc: statusMap[item.status] };
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
          title: '排序',
          key: 'sort'
        },
        {
          title: '关键词',
          key: 'name'
        },
        {
          title: '状态',
          key: 'statusDesc'
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
      const { status = '' } = params.row;
      const isAvailable = status === 'available';
      const desc = isAvailable ? '下架' : '上架';
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
              type: isAvailable ? 'warning' : 'primary',
              size: 'small'
            },
            style: {
              marginTop: '8px'
            },
            on: {
              click: () => {
                this.toggle(params.row, params.index);
              }
            }
          }, desc),
          h('Button', {
            props: {
              size: 'small'
            },
            style: {
              margin: '8px 0'
            },
            on: {
              click: () => {
                this.editor(params.row, params.index);
              }
            }
          }, '编辑'),
          h('Button', {
            props: {
              size: 'small'
            },
            style: {
              marginBottom: '8px'
            },
            on: {
              click: () => {
                this.showDel(params.row, params.index);
              }
            }
          }, '删除')
        ],
      );
    },

    toggle(row) {
      const { id, status } = row;
      this.$http()
        .post('/hkw/updateStatus', { id, status: statusReverseMap[status] })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },
    editor(row) {
      this.viewDetail(row.id);
    },

    add() {
      this.viewDetail();
    },

    viewDetail(id) {
      const query = id ? { id } : {};
      this.$router.push({ name: 'editorAntistops', query });
    },

    showDel(row) {
      this.$refs.delModal.show();
      this.delAction = () => {
        this.$http().post('/hkw/remove', { id: row.id }).then(() => {
          this.$Message.success('删除成功');
          this.$refs.list.refresh();
        });
      };
    },

  }

};

</script>
<style lang="less" scoped>
  .wrap{
    text-align: left;
  }
</style>
