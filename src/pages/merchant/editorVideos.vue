<template>
  <div class="editor">
    <b-crumb :br-list="bcs"/>
    <Form :model="formDatas"
          :label-width="96"
          label-position="left"
          @submit.native.prevent>
      <div class="m-form-contain">
        <Row>
          <Col span="11">
            <FormItem label="选择商户" required>
              <Select
                v-model="formDatas.sellerId"
                clearable>
                <Option v-for="o in sellers"
                        :value="o.id"
                        :key="o.id">{{ o.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="标题" required>
              <Input v-model="formDatas.title"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="封面图" required>
              <OImgUpload desc="702*360" :maxNum="3" ref="coverImgUpload"
                          :dafaults="defaultCoverAvatar" :maxSize="5" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="上传视频" required>
              <OImgUpload
                desc="限10s以内"
                :maxNum="1" ref="videoUpload"
                :dafaults="defaultVideo" :maxSize="20"
                :formats="['mp4']"
                type="video"
              />
            </FormItem>
          </Col>
        </Row>
      </div>
    </Form>
    <Button type="primary" size="large"  @click.stop="submit">提交</Button>
    <Button size="large" @click.stop="toCancel" style="margin-left: 20px;">取消</Button>
  </div>
</template>
<style lang="less" scoped>
    .editor {
      .address-item /deep/ .ivu-form-item-content {
        margin-left: 10px!important;
      }
    }
</style>
<script>

import OImgUpload from '@comps/CommonImgUpload';
import { Select, Option } from 'iview';

export default {
  name: 'editorCommoditys',
  data() {
    return {
      bcs: [{ title: '商家' }, { title: '视频作品' }],
      curId: '',
      isEditor: false,
      defaultCoverAvatar: [],
      defaultVideo: [],
      sellers: [],
      isLoading: false,
      formDatas: {
        sellerId: '',
        title: ''
      }
    };
  },
  components: { OImgUpload, Select, Option },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    init() {
      const { id, come } = this.$route.query;
      this.curId = id;
      this.isEditor = !!id;
      this.routerFromName = come;
      this.$nextTick(() => {
        this.initBcs();
        this.querySellers();
      });
    },
    initBcs() {
      const bc = [];
      if (this.isEditor) {
        this.getData();
        bc.push({ title: '编辑' });
      } else {
        bc.push({ title: '添加' });
      }
      this.bcs = [...this.bcs, ...bc];
    },
    querySellers(keywords) {
      this.isLoading = true;
      this.$http().post('/seller/list', {
        keywords,
        productType: 'videosWorks'
      }).then((data) => {
        this.isLoading = false;
        const ret = data.records || [];
        this.sellers = ret;
      })
        .catch(() => {
          this.isLoading = false;
          this.sellers = [];
        });
    },
    getData() {
      this.$http()
        .post('/video/queryById', { id: this.curId })
        .then((data) => {
          const {
            coverFileDto, videoFileId, videoFileDto,
            coverFileId, title, id, sellerId,
          } = data;
          if (coverFileDto) {
            this.defaultCoverAvatar = [{
              name: coverFileDto.unqFileName,
              dfsId: coverFileDto.unqFileName,
              id: coverFileId
            }];
          }
          if (videoFileDto) {
            this.defaultVideo = [
              {
                name: videoFileDto.unqFileName,
                dfsId: videoFileDto.unqFileName,
                id: videoFileId
              }
            ];
          }
          this.formDatas = {
            ...this.formDatas,
            sellerId,
            title,
            id
          };
        });
    },
    getParams() {
      const covers = this.$refs.coverImgUpload.$refs.imgUpload.getUploadList();
      const videos = this.$refs.videoUpload.$refs.imgUpload.getUploadList();
      const params = {
        ...this.formDatas,
        coverFileId: covers.length > 0 ? covers[0].id : '',
        videoFileId: videos.length > 0 ? videos[0].id : ''
      };
      return params;
    },
    submit() {
      const params = this.getParams();
      const isPass = this.isVali(params);
      // if (this.isEditor) {
      //   params.id = this.curId;
      // }
      if (!isPass) return;
      this.$http()
        .post('/video/save', params)
        .then(() => {
          this.$Message.success('操作成功！');
          this.toCancel();
        });
    },
    isVali(params) {
      let isVali = true;
      let msg = '';
      const {
        title, coverFileId, sellerId, videoFileId
      } = params;
      if (!videoFileId) {
        msg = '请上传视频！';
      }
      if (!coverFileId) {
        msg = '请上传用户封面！';
      }
      if (!title) {
        msg = '请填写标题！';
      }
      if (!sellerId) {
        msg = '请选择商户！';
      }
      if (msg) {
        this.$Message.warning(msg);
        isVali = false;
      }
      return isVali;
    },
    toCancel() {
      setTimeout(() => {
        this.$router.go(-1);
      }, 500);
    }
  }
};
</script>
