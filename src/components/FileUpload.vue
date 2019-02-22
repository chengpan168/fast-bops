<template>
    <div class="fileUpload">
        <Upload
                ref="upload"
                :default-file-list="dafaults"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :headers="reqHeaders"
                :format="formats"
                :max-size="fileMaxSize"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                style="margin-bottom: 20px"
                :action="uploadUrl">
            <div style="padding: 40px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <slot></slot>
            </div>
        </Upload>
        <div class="file-list-wrap">
            <Button size="large" type="primary"
                    @click.stop="downloadAll"
                    v-if="uploadList.length > 0 && enableDownload">下载全部</Button>
            <ul class="file-upload-list" v-for="(item, index) in uploadList" :key="index">
                <template v-if="item.status === 'finished'">
                    <li class="file-upload-list-item">
                        <span class="desc">
                            <span>{{item.name}}</span>
                            <span>{{item.sizeDesc}}</span>
                        </span>
                        <span class="action">
                            <Icon custom="iconfont icon-delete" size="20" title="删除" @click="handleRemove(item)" />
                            <Icon v-if="enableDownload"
                                  custom="iconfont icon-xiazailiang"
                                  size="20" style="margin-left: 20px"
                                  title="下载"
                                  @click="download(item)"
                            />
                        </span>
                    </li>
                </template>
                <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" style="width: 100%"></Progress>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>

import {
  Upload, Progress, Button, Icon
} from 'iview';

export default {
  name: 'fileUpload',
  props: {
    maxSize: {
      type: Number,
      default: 10
    },
    maxNum: {
      type: Number,
      default: 20
    },
    formats: {
      type: Array,
      default() {
        return ['stl', 'obj', 'stp', 'step'];
      }
    },
    dafaults: {
      type: Array,
      default() {
        return [];
      }
    },
    enableDownload: {
      type: Boolean,
      default: true
    },
    urlQuery: {
      type: String,
      default: ''
    }
  },
  components: {
    Upload,
    Progress,
    Button,
    Icon
  },
  data() {
    return {
      fileMaxSize: this.maxSize * 1024,
      uploadList: [],
      uploadUrl: '',
      reqHeaders: null
    };
  },
  methods: {
    handleRemove(file) {
      const ref = this.$refs.upload.fileList;
      ref.splice(ref.indexOf(file), 1);
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
          fileFullName, url, dfsId, fileSize
        } = data;
        const f = file;
        f.url = url;
        f.name = fileFullName;
        f.dfsId = dfsId;
        f.sizeDesc = this.$utils.getFileSizeDesc(fileSize);
        f.fileLength = fileSize;
      } else {
        this.$Message.error(msg);
      }
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
    handleBeforeUpload() {
      const check = this.uploadList.length <= this.maxNum;
      if (!check) {
        this.$Message.warning(`最多能上传${this.maxNum}个`);
      }
      return check;
    },
    getUploadList() {
      return this.uploadList;
    },
    downloadAll() {
      const token = this.$Store.get('token');
      const dfsIds = this.uploadList.map(item => item.dfsId).join(',');
      const url = `${this.$globalConfig.API_URL}/sys/batchDownload?token=${token}&dfsIds=${dfsIds}`;
      console.log('all', url);
      window.open(url);
    },
    download(item) {
      const token = this.$Store.get('token');
      const url = `${this.$globalConfig.API_URL}/sys/download?token=${token}&dfsId=${item.dfsId}`;
      console.log('one', url);
      window.open(url);
    },
    initUploadList() {
      this.$nextTick(() => {
        this.uploadList = this.$refs.upload.fileList;
      });
    },
    genUploadUrl() {
      let url = `${this.$globalConfig.API_URL}/sys/fileUpload`;
      if (this.urlQuery) {
        url += `?${this.urlQuery}`;
      }
      this.uploadUrl = url;
    }
  },
  mounted() {
    this.genUploadUrl();
    this.reqHeaders = {
      token: this.$Store.get('token')
    };
    this.initUploadList();
  },
  watch: {
    dafaults() {
      this.initUploadList();
    }
  }
};
</script>

<style lang="less" scoped>
    .fileUpload{
        .file-upload-list{
            list-style: none;
            margin-top: 10px;
            &-item {
                height: 32px;
                padding: 4px 10px;
                color: #515a6e;
                border-radius: 4px;
                transition: background-color .2s ease-in-out;
                overflow: hidden;
                position: relative;
                cursor: pointer;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                .action{
                    display: none;
                    .iconfont{
                        color: #333;
                        &:hover{
                            color: #27A0FF;
                        }
                    }
                }
                .desc  {
                    display: inline-flex;
                    justify-content: center;
                    & span:first-child{
                        display: inline-block;
                        width: 300px;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap
                    }
                }
                &:hover {
                    background: #f3f3f3;
                    .desc {
                        color: #27A0FF;
                    }
                    .action{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                    }
                }
            }
        }
    }
</style>
