<template>
  <Modal
    width="1080"
    v-model="isShow"
    title="全部评论"
    @on-ok="confirm">
    <div class="comment-wrap">
      <common-list
        ref="list"
        baseUrl="/comment/queryPageList"
        :isInit="false"
        :itemMap="listItemMap"
        :query-params="queryParams"
        :columns="listColumns"
      />
    </div>
  </Modal>
</template>
<style>
  .comment-wrap{
    height: 400px;
    overflow: scroll;
  }
</style>
<script>

import {
  statusReverseMap, topReverseMap
} from '@/constant';

import { Modal } from 'iview';

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
      selects: [],
      queryParams: {
        objectType: 'seller',
        objectId: ''
      },
      listColumns: [

      ],
      title: ''
    };
  },
  mounted() {
    this.initColumns();
  },
  components: { Modal },
  watch: {
    isShow(val) {
      if (val) this.$refs.list.refresh();
    }
  },
  methods: {
    show(id) {
      this.queryParams = { ...this.queryParams, objectId: id };
      this.$nextTick(() => {
        this.isShow = true;
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
          title: '用户id',
          key: 'userId'
        },
        {
          title: '用户名',
          key: 'nickName'
        },
        {
          title: '点评内容',
          key: 'content'
        },
        {
          title: '发布时间',
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
    listItemMap(item) {
      return { ...item, nickName: item.userDto.nickName };
    },

    toggleTop(row) {
      const { id, isTop } = row;
      this.$http()
        .post('/comment/updateIsTop', { id, isTop: topReverseMap[isTop] })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },

    toggle(row) {
      const { id, status } = row;
      this.$http()
        .post('/comment/updateStatus', { id, status: statusReverseMap[status] })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },

    renderAction(h, params) {
      const { status = '', isTop } = params.row;
      const isAvailable = status === 'available';
      const top = isTop === 'y';
      const desc = isAvailable ? '下架' : '上架';
      return h(
        'div',
        {
          style: {
            display: 'flex',
            'flex-direction': 'column',
            padding: '8px 0'
          },
          class: 'actionWrap'
        },
        [
          h('Button', {
            props: {
              type: top ? 'warning' : 'primary',
              size: 'small'
            },
            style: {
              marginBottom: '6px'
            },
            on: {
              click: () => {
                this.toggleTop(params.row, params.index);
              }
            }
          }, isTop === 'y' ? '取消置顶' : '置顶'),
          h('Button', {
            props: {
              type: isAvailable ? 'warning' : 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.toggle(params.row, params.index);
              }
            }
          }, desc)
        ],
      );
    },
  }
};
</script>
