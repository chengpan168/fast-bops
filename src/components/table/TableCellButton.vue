<template>
  <Button
    class="table-cell-button"
    size="small"
    :type="type"
    @click="onClick"
  >
    <slot></slot>
  </Button>
</template>
<script>

export default {
  name: 'tableCellButton',
  props: {
    type: String
  },
  data() {
    return {
    };
  },
  components: { },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
};
</script>
<style lang="less" scoped>
  .table-cell-button {
    margin: 2px;
  }
</style>
