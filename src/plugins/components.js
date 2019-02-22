import Vue from 'vue';
// global component
import ImagePreview from '@/components/ImagePreview.vue';
import DataList from '@/components/DataList.vue';
import DataListWrapper from '@/components/DataListWrapper.vue';
import DataListQuery from '@/components/DataListQuery.vue';
import TableCellImage from '@/components/table/TableCellImage.vue';
import TableCellOperator from '@/components/table/TableCellOperator.vue';
import TableCellButton from '@/components/table/TableCellButton.vue';
import BreadCrumbWrapper from '@/components/BreadCrumbWrapper.vue';
import DeleteModal from '@/components/DeleteModal.vue';

import SelectWrapper from '@/components/form/SelectWrapper.vue';
import DateRangePickerWrapper from '@/components/form/DateRangePickerWrapper.vue';
import DatePickerWrapper from '@/components/form/DatePickerWrapper.vue';

Vue.component('ImagePreview', ImagePreview);
Vue.component('DataList', DataList);
Vue.component('DataListWrapper', DataListWrapper);
Vue.component('DataListQuery', DataListQuery);
Vue.component('TableCellImage', TableCellImage);
Vue.component('TableCellOperator', TableCellOperator);
Vue.component('TableCellButton', TableCellButton);
Vue.component('BreadCrumbWrapper', BreadCrumbWrapper);
Vue.component('DeleteModal', DeleteModal);

Vue.component('SelectWrapper', SelectWrapper);
Vue.component('DateRangePickerWrapper', DateRangePickerWrapper);
Vue.component('DatePickerWrapper', DatePickerWrapper);
