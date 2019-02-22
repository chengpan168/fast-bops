/*eslint-disable*/
import Vue from 'vue';

import BCrumb from '@/components/BCrumb.vue';
// import HeaderOther from '@/components/HeaderOther.vue';
import HeaderQuery from '@/components/HeaderQuery.vue';
import CommonList from '@/components/CommonList.vue';
import DelModal from '@/components/DelModal.vue';
// import ImgUpload from '@/components/ImgUpload.vue';
// import CommonImgUpload from '@/components/CommonImgUpload.vue';
// import FileUpload from '@/components/FileUpload.vue';
// import ArtSelect from '@/components/ArtSelect.vue';


Vue.component('BCrumb', BCrumb);
// Vue.component('HeaderOther', HeaderOther);
Vue.component('HeaderQuery', HeaderQuery);
Vue.component('CommonList', CommonList);
Vue.component('DelModal', DelModal);
// Vue.component('ImgUpload', ImgUpload);
// Vue.component('CommonImgUpload', CommonImgUpload);
// Vue.component('FileUpload', FileUpload);
// Vue.component('ArtSelect', ArtSelect);
// Vue.component('HtmlEditor', (resolve) => {
//   require(['@/components/editor/index.vue'], resolve);
// });
Vue.component('ImageView', (resolve) => {
  require(['@/components/ImageView.vue'], resolve);
});
