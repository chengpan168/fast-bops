<template>
  <div class="wrap" key="">
    <div style="margin-bottom: 20px;" v-if="queryParams.type">
      <b-crumb :br-list="bcs" title="添加" :action="add" />
      <header-query :key="`${routerName}-hq`" v-on:on-params-change="paramsChange" :items="items" />
      <common-list
        :key="`${routerName}-cl`"
        ref="list"
        baseUrl="/product/list"
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

import { commoditysCons, statusReverseMap } from '@/constant';


const dt = new Date().getTime();

export default {

  name: `commoditys${dt}`,
  data() {
    return {
      bcs: [],
      items: [],
      queryParams: {
        sellerName: '',
        type: ''
      },
      listColumns: [],
      routerName: 'allCommoditys',
      delAction: () => {}
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.queryParams = {
        sellerName: '',
        type: ''
      };
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
      this.queryParams = { ...this.queryParams, type: commoditysCons[key].type };
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
      this.bcs = [{ title: '商家' }, { title: commoditysCons[this.routerName].title }];
    },
    listItemMap(item) {
      const extProperty = (item.extProperty && JSON.parse(item.extProperty)) || {};
      return {
        ...item,
        img: item.coverFileDto && item.coverFileDto.url,
        sellerName: item.sellerDto && item.sellerDto.name,
        ...extProperty
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
          title: '最大桌数',
          key: 'maxTableNum'
        },
        {
          title: '面积(平米)',
          key: 'area'
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
        ],
      );
    },

    toggle(row) {
      const { id, status } = row;
      this.$http()
        .post('/product/updateStatus', { id, status: statusReverseMap[status] })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },
    viewDetail(id) {
      const query = id ? { id } : {};
      this.$router.push({ name: 'banquetEditor', query });
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
      this.$refs.imageView.show([url]);
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
  .wrap{
    text-align: left;
  }
</style>
