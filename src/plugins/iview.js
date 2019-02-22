import Vue from 'vue';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Select,
  Option,
  DatePicker,
  Col,
  Form,
  FormItem,
  Icon,
  Input,
  Message,
  Modal,
  Row,
  Spin
} from 'iview';

import 'iview/dist/styles/iview.css';

Vue.prototype.$Modal = Modal;
Vue.prototype.$Message = Message;
Vue.prototype.$Spin = Spin;

Vue.component('Button', Button);
Vue.component('Breadcrumb', Breadcrumb);
Vue.component('BreadcrumbItem', BreadcrumbItem);
Vue.component('Row', Row);
Vue.component('Col', Col);

Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('Input', Input);
Vue.component('DatePicker', DatePicker);
Vue.component('Icon', Icon);
