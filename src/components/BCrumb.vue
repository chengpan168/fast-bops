<template>
  <div class="br-wrap">
    <Breadcrumb v-if="list.length > 0" separator=">">
      <BreadcrumbItem v-for="item in list" :to="item.to" :key="item.title">
        {{item.title}}
      </BreadcrumbItem>
    </Breadcrumb>
    <div style="margin-left: 20px;">
      <Button
        v-if="title"
        type="primary"
        @click.stop="action">{{title}}</Button>
    </div>
  </div>
</template>

<script>

import { Breadcrumb, BreadcrumbItem, Button } from 'iview';

export default {
  name: 'bcrumb',
  props: {
    brList: {
      type: Array,
      default() {
        return [];
      },
    },
    action: {
      type: Function,
      default() {
        return () => {};
      }
    },
    title: {
      type: String
    }
  },
  computed: {
    list() {
      return this.brList;
    }
  },
  components: {
    Breadcrumb,
    BreadcrumbItem,
    Button
  },
  data() {
    return {
      // list: this.brList
    };
  },
};
</script>

<style lang="less" scoped>

    .br-wrap{
        display: flex;
        flex-direction: row;
        align-items: center;
    }

</style>
