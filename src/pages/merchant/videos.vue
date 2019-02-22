<template>
  <div class="wrap" key="">
    <div style="margin-bottom: 20px;">
      <b-crumb :br-list="bcs" title="添加" :action="add" />
      <header-query v-on:on-params-change="paramsChange" :items="items" />
      <common-list
        ref="list"
        baseUrl="/video/queryPageList"
        :itemMap="listItemMap"
        :query-params="queryParams"
        :columns="listColumns"
      />
    </div>
    <del-modal ref="delModal" @ok="delAction" />
    <Image-View ref="imageView" />
  </div>
</template>
<script>

import { statusReverseMap } from '@/constant';


export default {

  name: 'weddingCases',
  data() {
    return {
      bcs: [],
      items: [],
      queryParams: {
        sellerName: '',
        type: ''
      },
      listColumns: [],
      delAction: () => {}
    };
  },
  mounted() {
    this.init();
  },
  // beforeRouteEnter() {
  //   // window.location.reload();
  // },
  methods: {
    init() {
      this.$nextTick(() => {
        this.initBcs();
        this.initColumns();
        this.initQueryItems();
      });
    },
    initQueryItems() {
      this.items = [
        {
          label: '商户名称',
          pl: '支持模糊查询',
          type: 'input',
          model: 'sellerName'
        }
      ];
    },
    paramsChange(params) {
      this.queryParams = { ...this.queryParams, ...params };
    },
    add() {
      this.viewDetail();
    },
    initBcs() {
      this.bcs = [{ title: '商家' }, { title: '视频作品' }];
    },
    listItemMap(item) {
      return {
        ...item,
        img: item.coverFileDto && item.coverFileDto.url,
        sellerName: item.sellerDto && item.sellerDto.name
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
          title: '标题',
          key: 'title'
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
          title: '所属商户',
          key: 'sellerName'
        },
        {
          title: '添加时间',
          key: 'createTime'
        },
        {
          title: '操作',
          key: 'action',
          width: 220,
          render: this.renderAction
        }
      ];
    },
    renderAction(h, params) {
      const {
        status = ''
      } = params.row;
      const isAvailable = status === 'available';
      const desc = isAvailable ? '下架' : '上架';
      return h(
        'div',
        {
          style: {
            display: 'flex',
            'flex-direction': 'row',
            'flex-wrap': 'wrap'
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
              marginRight: '8px',
              marginBottom: '8px'
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
              marginRight: '8px',
              marginBottom: '8px'
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
          // h('Button', {
          //   props: {
          //     type: isBanner ? 'warning' : 'primary',
          //     size: 'small'
          //   },
          //   style: {
          //     marginRight: '8px',
          //     marginBottom: '8px'
          //   },
          //   on: {
          //     click: () => {
          //       this.toggleStatus(params.row, 'banner', isBanner);
          //     }
          //   }
          // }, '轮播图')
        ],
      );
    },

    toggle(row) {
      const { id, status } = row;
      this.$http()
        .post('/video/updateStatus', { id, status: statusReverseMap[status] })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },
    viewDetail(id) {
      const query = id ? { id } : {};
      this.$router.push({ name: 'editorVideos', query });
    },
    editor({ id }) {
      this.viewDetail(id);
    },
    showDel(row) {
      this.$refs.delModal.show();
      this.delAction = () => {
        this.$http().post('/video/remove', { id: row.id }).then(() => {
          this.$Message.success('删除成功');
          this.$refs.list.refresh();
        });
      };
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
