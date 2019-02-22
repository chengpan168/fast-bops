<template>
  <div class="img-upload">
    <Upload
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :default-file-list="defaultList"
      :format="formats"
      :headers="reqHeaders"
      :max-size="fileMaxSize"
      :on-error="handleError"
      :on-exceeded-size="handleMaxSize"
      :on-format-error="handleFormatError"
      :on-success="handleSuccess"
      :onProgress="onProgress"
      :show-upload-list="false"
      multiple
      ref="upload"
      type="drag">
      <slot name="uploadDesc"></slot>
    </Upload>
    <div class="img-list-list-wrap">
      <div :key="index" v-for="(item, index) in uploadList">
        <template v-if="item.status === 'finished'">
          <div class="img-upload-list" v-if="type === 'img'">
            <img :src="genUrl(item.dfsId)">
            <div class="img-upload-list-cover">
              <div style="position: absolute; right: 0; top: 0;">
                <Icon @click.native="handleView(item)" type="ios-eye-outline"></Icon>
                <Icon @click.native="handleRemove(item)" type="ios-trash-outline"></Icon>
              </div>
              <div class="img-upload-setMain" v-if="enableMainPic">
                <Button @click.native="handleMain(item)" ghost size="small" type="dashed">设为首图</Button>
              </div>
            </div>
            <span class="img-upload-main" v-if="curMainPic === item.dfsId && enableMainPic">首图</span>
          </div>
          <div class="video-upload-list" v-if="type === 'video'">
            <video :src="genUrl(item.dfsId)" @click.stop.prevent=""
                   controls poster preload v-if="type !== 'img'"/>
            <div class="video-action-wrap">
              <Icon @click.native="handleRemove(item)" type="ios-trash-outline"></Icon>
            </div>
          </div>
        </template>
        <template v-else>
          <Progress :percent="item.percentage" hide-info v-if="item.showProgress"></Progress>
        </template>
      </div>
      <Image-View ref="imageView"/>
    </div>
  </div>
</template>
<script>

import { Progress, Upload } from 'iview';

export default {
  name: 'imgUpload',
  props: {
    enableMainPic: {
      type: Boolean,
      default: true
    },
    defaultMainPic: {
      type: String,
      default: ''
    },
    maxSize: {
      type: Number,
      default: 5
    },
    maxNum: {
      type: Number,
      default: 5
    },
    formats: {
      type: Array,
      default() {
        return ['jpg', 'jpeg', 'png'];
      }
    },
    extension: {
      type: Array,
      default() {
        return [];
      }
    },
    dafaults: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default: 'img'
    }
  },
  components: { Upload, Progress },
  data() {
    return {
      loading: false,
      fileMaxSize: this.maxSize * 1024,
      imgUrl: '',
      curMainPic: '',
      visible: false,
      uploadList: [],
      uploadUrl: '',
      reqHeaders: null
    };
  },
  computed: {
    defaultList() {
      return (this.dafaults || []).map(item => ({ ...item, url: `${this.$config.OSS_URL}/${item.dfsId}` }));
    }
  },
  methods: {
    genUrl(dfsId) {
      return `${this.$config.OSS_URL}/${dfsId}`;
    },
    handleView(item) {
      const { url } = item;
      console.log(url);
      this.$imagePreview.show([url]);
    },
    handleRemove(file) {
      const ref = this.$refs.upload.fileList;
      ref.splice(ref.indexOf(file), 1);
      if (this.curMainPic === file.dfsId) {
        this.curMainPic = '';
      }
      this.$nextTick(() => {
        this.setDefaultMainPic();
      });
    },
    handleMain(item) {
      this.curMainPic = item.dfsId;
    },
    onProgress() {
      if (!this.loading) {
        this.loading = true;
        this.$Message.loading('服务器正在处理中...', 0);
      }

      this.$emit('on-progress');
    },
    handleSuccess(res, file) {
      const { data, status, msg } = res;
      if (status === '400') {
        this.$Message.error('登录过期，稍后将重新登录！');
        setTimeout(() => {
          const referer = 'window.location.pathname';
          window.location.replace(`/login?referer=${referer}`);
        }, 1500);
      } else if (status === 'ok') {
        const {
          fileFullName, url, unqFileName: dfsId, id
        } = data;
        const f = file;
        f.url = url;
        f.name = fileFullName;
        f.dfsId = dfsId;
        f.id = id;
        this.setDefaultMainPic();
      } else {
        this.$Message.error(msg);
      }
    },
    setDefaultMainPic() {
      this.$nextTick(() => {
        const len = this.uploadList.length;
        if (len > 0 && !this.curMainPic) {
          this.curMainPic = this.uploadList[0].dfsId;
        }
      });
    },
    handleError() {
      console.log(1);
    },
    handleFormatError() {
      this.$Message.warning('类型不支持！');
    },
    handleMaxSize() {
      this.$Message.warning(`文件大小不能超过${this.maxSize}M`);
    },
    handleBeforeUpload(file) {
      // 检查后缀名
      const { name } = file;
      if (this.extension && this.extension.length > 0) {
        const match = this.extension.filter(item => item.test(name));
        if (!match || match.length === 0) {
          this.$Message.warning('文件类型错误');
          return false;
        }
      }

      const check = this.uploadList.length < this.maxNum;
      if (!check) {
        this.$Message.warning(`最多能上传${this.maxNum}个`);
      }
      return check;
    },
    getUploadList() {
      return this.uploadList;
    },
    getMainPic() {
      return this.curMainPic;
    },
    initUploadList() {
      this.$nextTick(() => {
        this.uploadList = this.$refs.upload.fileList;
      });
    }
  },
  mounted() {
    this.uploadUrl = `${this.$config.API_URL}/sys/upload `;
    this.reqHeaders = {
      token: this.$localStore.get('token') || ''
    };
    this.initUploadList();
  },
  watch: {
    defaultList() {
      this.initUploadList();
    },
    defaultMainPic(val) {
      this.curMainPic = val;
    }
  }
};
</script>
<style lang="less" scoped>
  .img-upload {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .img-upload-list {
    display: inline-block;
    width: 120px;
    height: 90px;
    text-align: center;
    /*line-height: 90px;*/
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 20px;
  }

  .video-upload-list {
    display: inline-block;
    width: 200px;
    height: 120px;
    text-align: center;
    /*line-height: 90px;*/
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 20px;

    > video {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }

  .img-upload-list img {
    width: 100%;
    height: 100%;
  }

  .img-list-list-wrap {
    display: flex;
    flex-direction: row;
    padding: 20px 0;
  }

  .img-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .6);
  }

  .img-upload-setMain {
    display: none;
    position: absolute;
  }

  .img-upload-main {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    background: #27a0ff;
    color: #fff;
    border-radius: 4px;
    width: 30px;
    height: 20px;
    line-height: 20px;
  }

  .img-upload-list:hover .img-upload-list-cover {
    display: block;
  }

  .img-upload-list:hover .img-upload-setMain {
    display: block;
  }

  .img-upload-list:hover .img-upload-main {
    display: none;
  }

  .img-upload-list-cover i {
    color: #fff;
    font-size: 24px;
    cursor: pointer;

    &:hover {
      color: #27A0FF;
    }
  }

  .video-action-wrap {
    position: absolute;
    right: 0;
    top: 0;
    background: rgba(0, 0, 0, .3);
    width: 32px;
    height: 32px
  }

  .video-action-wrap /deep/ .ivu-icon {
    color: #fff;
    font-size: 24px;
  }
</style>
