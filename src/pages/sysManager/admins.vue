<template>
  <div class="wrap">
    <div style="margin-bottom: 20px;">
      <!--<b-crumb :br-list="bcs" title="添加" :action="add" />-->
      <bread-crumb-wrapper :items="bcs" />
      <data-list-wrapper
        ref="dataListWrapper"
        :data-item-handler="listItemMap"
        query-url="/manager/list"
        delete-url="/manager/remove"
        :query-items="[]"
        :columns="listColumns"
      />

    </div>
    <delete-modal ref="delModal" @on-ok="delAction" />
    <editor-admin ref="adminModal" @ok="refresh"></editor-admin>
  </div>
</template>
<script>
import EditorAdmin from './components/ediotrAdmins';

export default {

  name: 'pushMsgs',
  data() {
    return {
      bcs: [],
      items: [],
      queryParams: {},
      listColumns: [],
      delAction: () => {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initBcs();
      this.initColumns();
    });
  },
  components: { EditorAdmin },
  methods: {
    refresh() {
      this.$refs.list.refresh();
    },
    add() {
      this.showEditorModal();
    },
    initBcs() {
      this.bcs = [{ title: '系统管理' }, { title: '管理员设置' }];
    },
    listItemMap(item) {
      return { ...item, role: '管理员' };
    },
    initColumns() {
      this.listColumns = [
        {
          type: 'id',
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          type: 'phone'
        },
        {
          title: '密码',
          key: 'password'
        },
        {
          title: '角色',
          key: 'role'
        },
        {
          type: 'datetime',
          title: '创建时间',
          key: 'createTime'
        },
        {
          type: 'datetime',
          title: '最近登录',
          key: 'lastLoginTime'
        },
        {
          type: 'operator',
          width: 140,
          render: this.renderAction
        }
      ];
    },
    renderAction(h, params) {
      return h(
        'TableCellOperator',
        [
          h('TableCellButton', {
            on: {
              click: () => {
                this.editor(params.row, params.index);
              }
            }
          }, '编辑'),
          h('TableCellButton', {
            on: {
              click: () => {
                this.$refs.dataListWrapper.readyDelete(params.row);
                // this.showDel(params.row);
              }
            }
          }, '删除')
        ],
      );
    },
    editor({
      id, name, phone, password
    }) {
      this.showEditorModal({
        id, name, phone, password
      });
    },
    showEditorModal(params) {
      this.$refs.adminModal.show(params);
    },
    showDel(row) {
      this.$refs.delModal.show();
      this.delAction = () => {
        this.$http().post('/manager/remove', { id: row.id }).then(() => {
          this.$Message.success('删除成功');
          this.$refs.list.refresh();
        });
      };
    }
  }

};

</script>
<style lang="less" scoped>
  .wrap{
  }
</style>
