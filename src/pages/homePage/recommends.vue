<template>
  <div class="wrap">
    <div style="margin-bottom: 20px;">
      <b-crumb :br-list="bcs" :key="`${routerName}-bc`" />
      <template v-if="routerName === 'hotRecommends'">
        <common-list
          ref="list"
          baseUrl="/plat/list"
          :key="`${routerName}-list`"
          :itemMap="listItemMap"
          :query-params="queryParams"
          :columns="listColumns"
        />
      </template>
      <template v-if="routerName === 'likeRecommends'">
        <common-list
          ref="list"
          baseUrl="/plat/list"
          :key="`${routerName}-list`"
          :itemMap="listItemMap"
          :query-params="queryParams"
          :columns="listColumns"
        />
      </template>
      <template v-if="routerName === 'bannerRecommends'">
        <common-list
          ref="list"
          baseUrl="/plat/list"
          :key="`${routerName}-list`"
          :itemMap="listItemMap"
          :query-params="queryParams"
          :columns="listColumns"
        />
      </template>
    </div>
    <Image-View ref="imageView" :key="`${routerName}-iv`" />
    <del-modal ref="delModal" @ok="delAction" :key="`${routerName}-dm`" />
  </div>
</template>
<script>

import { statusMap, statusReverseMap, recConstants } from '@/constant';

export default {

  name: 'recommends',
  data() {
    return {
      bcs: [{ title: '首页' }],
      items: [],
      queryParams: {},
      listColumns: [],
      routerName: '',
      delAction: () => {}
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    init() {
      this.routerName = this.$route.name;
      this.queryParams = { ...recConstants[this.$route.name].queryParams };
      this.$nextTick(() => {
        this.initBcs();
        this.initColumns();
      });
    },
    listItemMap(item) {
      return { ...item, img: item.imageFileDto && item.imageFileDto.url, statusDesc: statusMap[item.status] };
    },
    initBcs() {
      this.bcs = [{ title: '商家' }, { title: recConstants[this.routerName].title }];
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
          title: '状态',
          key: 'statusDesc'
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
        .post('/plat/updateStatus', { id, status: statusReverseMap[status] })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },
    editor(row) {
      const { editorName, routerKey } = recConstants[this.routerName];
      this.$router.push({ name: editorName, query: { id: row.id, key: routerKey } });
      // window.open(`/home/${routerKey}/editor?id=${row.id}&key=${routerKey}`);
    },
    showDel(row) {
      this.$refs.delModal.show();
      this.delAction = () => {
        this.$http().post('/plat/remove', { id: row.id }).then(() => {
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
