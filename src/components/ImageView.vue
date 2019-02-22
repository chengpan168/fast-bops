<template>
    <div class="image-view">
      <img v-for="(img, index) in imgs" :src="img" :key="`${index}_${img}`"/>
    </div>
</template>
<script>
export default {
  name: 'imageView',
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
  methods: {
  }
};

</script>
<style lang="less" scoped></style>
