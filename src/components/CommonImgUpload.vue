<template>
    <div class="common-img-upload">
        <img-upload
                :enableMainPic="false"
                :maxNum="maxNum"
                :maxSize="maxSize"
                :dafaults="dafaults"
                :formats="formats"
                :type="type"
                ref="imgUpload"
        >
            <div style="width: 120px; height: 90px; line-height: 90px;" slot="uploadDesc">
                <Icon type="ios-camera" size="50"></Icon>
            </div>
        </img-upload>
      <div class="desc" v-if="desc">{{desc}}</div>
    </div>
</template>
<script>

import ImgUpload from './ImgUpload';

export default {
  name: 'OImgUpload',
  props: {
    maxNum: {
      type: Number,
      default: 5
    },
    maxSize: {
      type: Number,
      default: 5
    },
    dafaults: {
      type: Array,
      default() {
        return [];
      }
    },
    formats: {
      type: Array,
      default() {
        return ['jpg', 'jpeg', 'png'];
      }
    },
    type: {
      type: String,
      default: 'img'
    },
    desc: String
  },
  components: { ImgUpload }
};
</script>
<style lang="less" scoped>
    .common-img-upload{
        & /deep/ .img-upload{
            flex-direction: row;
            & .img-list-list-wrap{
                padding: 0;
                margin-left: 20px;
            }
        }
      .desc{
        text-align: left;
      }
    }
</style>
