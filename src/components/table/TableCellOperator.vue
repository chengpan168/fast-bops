<template>
  <div class="table-cell-operator">
    <slot></slot>
  </div>
</template>
<script>

export default {
  name: 'tableCellOperator',
  data() {
    return {
    };
  },
  components: { },
  methods: {
  }
};
</script>
<style lang="less" scoped>
  .table-cell-operator {
    padding: 5px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
