<template>
  <div class="wrap">
    <div style="margin-bottom: 20px;">
      <b-crumb :br-list="bcs" title="添加分类" :action="add" />
      <common-list
        ref="list"
        baseUrl="/category/list "
        :itemMap="listItemMap"
        :query-params="queryParams"
        :columns="listColumns"
      />
    </div>
    <Image-View ref="imageView" />
    <del-modal ref="delModal" @ok="delAction" />
  </div>
</template>
<script>

import { statusMap, statusReverseMap } from '@/constant';


export default {

  name: 'classifys',
  data() {
    return {
      bcs: [{ title: '首页' }, { title: '商家分类' }],
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
      return { ...item, img: item.imageFileDto.url, statusDesc: statusMap[item.status] };
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
          title: '名称',
          key: 'name'
        },
        {
          title: '图片',
          key: '',
          render: (h, params) => h(
            'img',
            {
              attrs: {
                src: params.row.img
              },
              style: {
                width: '100px',
                height: '100px',
                cursor: 'pointer',
                display: 'block',
                margin: '6px'
              },
              on: {
                click: () => {
                  this.imgPreview(params.row.img);
                }
              }
            },
          )
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
        .post('/category/updateStatus', { id, status: statusReverseMap[status] })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },
    viewDetail(id) {
      const query = id ? { id } : {};
      this.$router.push({ name: 'editorClassifys', query });
    },
    editor({ id }) {
      this.viewDetail(id);
    },
    showDel(row) {
      this.$refs.delModal.show();
      this.delAction = () => {
        this.$http().post('/category/remove', { id: row.id }).then(() => {
          this.$Message.success('删除成功');
          this.$refs.list.refresh();
        });
      };
    },
    add() {
      this.viewDetail();
    },
    imgPreview(url) {
      this.$refs.imageView.show([url]);
    }

  }

};

</script>
<style lang="less" scoped>
  .wrap{
    text-align: left;
  }
</style>
