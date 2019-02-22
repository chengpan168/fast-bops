<template>
  <div class="table-cell-image">
    <template v-if="img">
      <img :src="img" alt="" @click="onPreview">
    </template>
    <template v-else>
      <img v-for="(item, index) in imgs"
           @click="onPreview(index)"
           :src="item"
           :key="`table_cell_image_${index}`"/>
    </template>
  </div>
</template>
<script>

export default {
  name: 'tableCellImage',
  props: {
    imgs: {
      type: Array
    },
    img: {
      type: String
    }
  },
  data() {
    return {
    };
  },
  components: {},
  methods: {
    onPreview(index) {
      let imgs = [];
      imgs = this.img ? [this.img] : this.imgs;
      this.$imagePreview.show(imgs, index);
    }
  }
};
</script>
<style lang="less" scoped>
  .table-cell-image {
    padding: 5px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    img {
      max-width: 50px;
      max-height: 50px;
      cursor: pointer;
      border-radius: 4px;
    }
  }
</style>
