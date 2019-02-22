<template>
  <div class="wrap">
    <div style="margin-bottom: 20px;">
      <b-crumb :br-list="bcs" title="添加" :action="add" />
      <common-list
        ref="list"
        baseUrl="/message/list"
        :itemMap="listItemMap"
        :columns="listColumns"
      />
    </div>
    <del-modal ref="delModal" @ok="delAction" />
    <editor-msg ref="editorMsgModal" @ok="refresh"></editor-msg>
  </div>
</template>
<script>

import EditorMsg from './components/ediotrPushMsgs';

export default {

  name: 'pushMsgs',
  data() {
    return {
      bcs: [],
      items: [],
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
  components: { EditorMsg },
  methods: {
    add() {
      this.viewDetail();
    },
    initBcs() {
      this.bcs = [{ title: '系统管理' }, { title: '消息推送' }];
    },
    listItemMap(item) {
      return item;
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
          title: '标题',
          key: 'title'
        },
        {
          title: '内容',
          key: 'content'
        },
        {
          title: '打开人数',
          key: 'openUserNum'
        },
        {
          title: '发送时间',
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
      const { hasSend = 'n' } = params.row;
      const desc = hasSend === 'y' ? '已发送' : '发送';
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
              type: 'primary',
              size: 'small',
              disabled: hasSend === 'y'
            },
            style: {
              marginTop: '8px'
            },
            on: {
              click: () => {
                this.send(params.row);
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
                this.showDel(params.row);
              }
            }
          }, '删除')
        ],
      );
    },

    send(row) {
      const { id } = row;
      this.$http()
        .post('/message/send', { id })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },

    refresh() {
      this.$refs.list.refresh();
    },

    viewDetail(params) {
      this.$refs.editorMsgModal.show(params);
    },

    editor({ id, title, content }) {
      this.viewDetail({ id, title, content });
    },
    showDel(row) {
      this.$refs.delModal.show();
      this.delAction = () => {
        this.$http().post('/message/remove', { id: row.id }).then(() => {
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
    text-align: left;
  }
</style>
