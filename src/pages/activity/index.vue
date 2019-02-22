<template>
  <div class="wrap" key="">
    <div>
      <bread-crumb-wrapper :items="bcs" title="添加" :to="{ name: 'editorActivitys' }"/>
      <data-list-wrapper
        :columns="listColumns"
        :data-item-handler="listItemMap"
        :query-items="items"
        query-url="/product/list"
        delete-url="/product/remove"
        ref="dataListWrapper"
      />
    </div>
    <del-modal @ok="delAction" ref="delModal"/>
    <Image-View ref="imageView"/>
    <Applys ref="applyModal"/>
  </div>
</template>
<script>

import { commoditysCons, statusReverseMap, topReverseMap } from '@/constant';
import Applys from './components/applys';

export default {

  name: 'activitys',
  data() {
    return {
      bcs: [],
      items: [],
      queryParams: {
        sellerName: '',
        type: 'activity'
      },
      listColumns: [],
      routerName: 'allCommoditys',
      delAction: () => {}
    };
  },
  components: { Applys },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.$nextTick(this.init);
    }
  },
  // beforeRouteEnter() {
  //   // window.location.reload();
  // },
  methods: {
    init() {
      const key = this.$route.name;
      this.routerName = key;
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
    initBcs() {
      this.bcs = [{ title: '活动' }, { title: '活动列表' }];
    },
    listItemMap(item) {
      // const extProperty = JSON.parse(item.extProperty);
      return {
        ...item,
        img: item.coverFileDto && item.coverFileDto.url,
        sellerName: item.sellerDto && item.sellerDto.name,
        endTime: item.productActivityExtDto && item.productActivityExtDto.endTime
      };
    },
    initColumns() {
      this.listColumns = [
        {
          type: 'id'
        },
        {
          title: '标题',
          key: 'name'
        },
        {
          title: '图片',
          key: '',
          render: (h, params) => h(
            'TableCellImage',
            {
              props: {
                img: params.row.img
              }
            }
          )
        },
        {
          title: '参与人数',
          key: 'maxTableNum'
        },
        {
          title: '价格',
          key: '',
          render: (h, params) => {
            const item = params.row;
            const { currentAmount, originalAmount } = item;
            return h(
              'div',
              {
                style: {
                  display: 'flex',
                  'flex-direction': 'column'
                }
              },
              [
                h('span', {
                  style: {
                    marginTop: '8px'
                  }
                }, `现价：${currentAmount || ''}`),
                h('span', {
                  style: {
                    marginTop: '8px'
                  }
                }, `原价：${originalAmount || ''}`)
              ]
            );
          }
        },
        {
          title: '所属商户',
          key: 'sellerName'
        },
        {
          type: 'datetime',
          title: '截止报名',
          key: 'endTime'
        },
        {
          type: 'datetime',
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '状态',
          key: ''
        },
        {
          type: 'operator',
          title: '操作',
          key: 'action',
          width: 220,
          render: this.renderAction
        }
      ];
    },
    renderAction(h, params) {
      const {
        status = '', isTop, isBanner
      } = params.row;
      const isAvailable = status === 'available';
      const desc = isAvailable ? '下架' : '上架';
      const topDesc = isTop === 'y' ? '取消置顶' : '置顶';
      return h(
        'TableCellOperator',
        [
          h('TableCellButton', {
            props: {
              type: isAvailable ? 'warning' : 'primary',
            },
            on: {
              click: () => {
                this.toggle(params.row, params.index);
              }
            }
          }, desc),
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
                // this.showDel(params.row, params.index);
                this.$refs.dataListWrapper.readyDelete(params.row);
              }
            }
          }, '删除'),
          h('TableCellButton', {
            props: {
              type: 'warning',
            },
            on: {
              click: () => {
                this.toggleStatus(params.row, 'banner', isBanner);
              }
            }
          }, '轮播图'),
          h('TableCellButton', {
            props: {
              type: isTop === 'y' ? 'warning' : 'primary',
            },
            on: {
              click: () => {
                this.toggleTop(params.row);
              }
            }
          }, topDesc),
          h('TableCellButton', {
            props: {
              type: 'primary',
            },
            on: {
              click: () => {
                this.showApply(params.row);
              }
            }
          }, '报名管理')
        ]
      );
    },

    toggle(row) {
      const { id, status } = row;
      this.$http().post('/product/updateStatus', { id, status: statusReverseMap[status] }).then(() => {
        this.$refs.list.refresh();
        this.$Message.success('操作成功');
      });
    },
    viewDetail(id) {
      const query = id ? { id } : {};
      this.$router.push({ name: 'editorActivitys', query });
    },
    editor({ id }) {
      this.viewDetail(id);
    },
    showDel(row) {
      this.$refs.delModal.show();
      this.delAction = () => {
        this.$http().post('/product/remove', { id: row.id }).then(() => {
          this.$Message.success('删除成功');
          this.$refs.list.refresh();
        });
      };
    },
    imgPreview(url) {
      this.$imagePreview.show([url]);
    },
    showApply(row) {
      this.$refs.applyModal.show(row.id, row.productActivityExtDto);
    },
    toggleTop(row) {
      const { id, isTop } = row;
      this.$http().post('/product/updateIsTop', { id, isTop: topReverseMap[isTop] }).then(() => {
        this.$refs.list.refresh();
        this.$Message.success('操作成功');
      });
    },
    toggleStatus(row, type, isToggle) {
      const url = isToggle ? '/plat/cancel' : '/plat/submit';
      this.$http().post(url, {
        objectId: row.id,
        objectType: commoditysCons[this.routerName].objectType,
        type
      }).then(() => {
        this.$Message.success('设置成功');
        this.$refs.list.refresh();
      });
    }
  }

};

</script>
<style lang="less" scoped>
  .wrap {
    text-align: left;
  }
</style>
