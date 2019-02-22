<template>
  <div class="breadcrumb-wrapper">
    <Breadcrumb separator=">" v-if="items.length > 0">
      <BreadcrumbItem :key="item.title" :to="item.to" v-for="item in items">
        {{item.title}}
      </BreadcrumbItem>
    </Breadcrumb>
    <div style="margin-left: 20px;">
      <Button
        @click.stop="onAction"
        type="primary"
        v-if="title">{{title}}
      </Button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'breadcrumb-wrapper',
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    action: {
      type: Function,
      default() {
        return () => {};
      },
    },
    to: {
      type: Object
    },
    title: {
      type: String,
    },
  },
  computed: {},
  components: {
  },
  data() {
    return {};
  },
  methods: {
    onAction() {
      this.$router.push(this.to);
    }
  }
};
</script>

<style lang="less" scoped>

  .breadcrumb-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

</style>
