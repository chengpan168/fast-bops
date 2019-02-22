<template>
  <div class="wrap">
    <div style="margin-bottom: 20px;">
      <b-crumb :br-list="bcs" title="添加商家" :action="add"/>
      <header-query v-on:on-params-change="paramsChange" :items="items" />
      <common-list
        ref="list"
        baseUrl="/seller/list"
        :itemMap="listItemMap"
        :query-params="queryParams"
        :columns="listColumns"
      />
    </div>
    <Image-View ref="imageView" />
    <del-modal ref="delModal" @ok="delAction" />
    <Comments ref="comments" />
  </div>
</template>
<script>

import {
  statusMap, statusReverseMap, topMap, topReverseMap
} from '@/constant';
import Comments from './components/comments';

export default {

  name: 'merchants',
  data() {
    return {
      bcs: [{ title: '商家' }, { title: '商家列表' }],
      items: [],
      queryParams: {
        keywords: '',
        categoryId: ''
      },
      listColumns: [],
      delAction: () => {}
    };
  },
  mounted() {
    this.initColumns();
    this.initQueryItems();
    this.$nextTick(this.queryClassify);
  },
  components: { Comments },
  methods: {
    initQueryItems() {
      this.items = [
        {
          label: '商户名称',
          pl: '支持模糊查询',
          type: 'input',
          model: 'keywords'
        },
        {
          label: '分类选择',
          pl: '请选择分类',
          type: 'select',
          model: 'categoryId',
          list: [],
          valueKey: 'id',
          labelKey: 'name'
        }
      ];
    },
    listItemMap(item) {
      return {
        ...item,
        statusDesc: statusMap[item.status],
        topDesc: topMap[item.isTop],
        categoryName: item.categoryDto.name,
        img: item.logoFileDto && item.logoFileDto.url
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
          title: 'logo',
          key: '',
          render: (h, params) => h(
            'img',
            {
              attrs: {
                src: params.row.img
              },
              style: {
                width: '60px',
                height: '60px',
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
          title: '商户名称',
          key: 'name'
        },
        {
          title: '商户分类',
          key: 'categoryName'
        },
        {
          title: '内容数',
          key: 'weddingCaseNum'
        },
        {
          title: '收藏数',
          key: 'collectNum'
        },
        {
          title: ' 点评数',
          key: '',
          render: (h, params) => {
            const item = params.row;
            const { commentNum } = item;
            return h(
              'a',
              {
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.viewComments(params.row, params.index);
                  }
                }
              },
              commentNum
            );
          }
        },
        {
          title: '添加时间',
          key: 'createTime'
        },
        {
          title: '状态',
          key: '',
          render: (h, params) => {
            const item = params.row;
            const { statusDesc, topDesc } = item;
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
                }, `${statusDesc || ''}`),
                h('span', {
                  style: {
                    marginTop: '8px'
                  }
                }, `${topDesc || ''}`)
              ],
            );
          }
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
      const { status = '', isTop } = params.row;
      const isAvailable = status === 'available';
      const top = isTop === 'y';
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
              type: top ? 'warning' : 'primary',
              size: 'small'
            },
            style: {
              marginTop: '8px'
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

    paramsChange(params) {
      this.queryParams = {
        ...this.queryParams,
        ...params
      };
    },

    queryClassify() { // 查询分类
      const item = this.items[1];
      this.$http().post('/category/list ', {
        current: 1,
        size: 10
      }).then((data) => {
        const ret = data.records || [];
        const obj = {
          ...item,
          list: ret
        };
        this.$set(this.items, 1, obj);
      })
        .catch(() => {
          this.$set(this.items, 1, {
            ...item,
            list: []
          });
        });
    },

    toggleTop(row) {
      const { id, isTop } = row;
      this.$http()
        .post('/seller/updateIsTop', { id, isTop: topReverseMap[isTop] })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },

    toggle(row) {
      const { id, status } = row;
      this.$http()
        .post('/seller/updateStatus', { id, status: statusReverseMap[status] })
        .then(() => {
          this.$refs.list.refresh();
          this.$Message.success('操作成功');
        });
    },
    editor(row) {
      const query = row.id ? { id: row.id } : {};
      this.$router.push({ name: 'merchantsEditor', query });
      // window.open(`/merchants/editor?id=${row.id}`);
    },
    showDel(row) {
      this.$refs.delModal.show();
      this.delAction = () => {
        this.$http().post('/seller/remove', { id: row.id }).then(() => {
          this.$Message.success('删除成功');
          this.$refs.list.refresh();
        });
      };
    },
    imgPreview(url) {
      this.$refs.imageView.show([url]);
    },
    add() {
      this.$router.push({ name: 'merchantsEditor' });
    },
    viewComments(row) {
      this.$refs.comments.show(row.id);
    }
  }

};

</script>
<style lang="less" scoped>
  .wrap{
    text-align: left;
  }
</style>
