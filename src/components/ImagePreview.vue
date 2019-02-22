<template>
    <div class="image-preview">
        <viewer :images="imgs" @inited="inited" :options="options">
            <img v-for="(img, index) in imgs" :src="img" :key="`${index}_${img}`" style="display: none" />
        </viewer>
    </div>
</template>
<script>

import Vue from 'vue';
import Viewer from 'v-viewer';
import logger from '@/utils/logger';
// eslint-disable-next-line
import 'viewerjs/dist/viewer.css';

Vue.use(Viewer);

export default {
  name: 'imagePreview',
  data() {
    return {
      options: {
        title: false,
        rotatable: true,
        transition: true,
        toolbar: 4
      },
      imgs: []
    };
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
      Vue.prototype.$imagePreview = this;
      const { length } = this.imgs;
      if (length > 0) {
        this.$viewer.show();
      }
    },
    show(imgs, index = 0) {
      logger.debug('image preview', imgs = [], index);
      this.imgs = imgs;
      this.$nextTick(() => {
        this.$viewer.view(index);
      });
    }
  }
};

</script>
<style lang="less" scoped></style>
