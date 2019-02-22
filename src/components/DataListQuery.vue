<template>
  <div class="">
    <Row class="data-list-query-wrapper" justify="start" type="flex" v-if="list.length > 0">
      <Col
        :key="`query_item_input_${index}`"
        class-name="query-col" :span="item.span || 6" v-for="(item, index) in list">
        <label class="query-label">{{item.label}}</label>
        <Input
          :placeholder="item.placeholder"
          clearable
          style="width: 200px"
          v-if="item.type === 'input'"
          v-model="queryParams[item.model]"/>
        <DatePicker
          :placeholder="item.placeholder"
          :type="item.type"
          split-panels
          style="width: 200px"
          v-else-if="item.type.indexOf('date') !== -1"
          v-model="queryParams[item.model]"/>
        <Select
          :placeholder="item.placeholder"
          clearable
          style="width:200px"
          v-else-if="item.type === 'select'"
          v-model="queryParams[item.model]">
          <Option :key="o[item.valueKey]"
                  :value="o[item.valueKey]"
                  v-for="o in item.list">{{ o[item.labelKey] }}
          </Option>
        </Select>
        <Select
          :loading="item.isLoading"
          :placeholder="item.placeholder"
          :remote-method="item.fn"
          clearable
          filterable
          remote
          style="width:200px;"
          v-else-if="item.type === 'selectAsync'"
          v-model="queryParams[item.model]">
          <Option :key="o[item.valueKey]"
                  :value="o[item.valueKey]"
                  v-for="o in item.list">{{ o[item.labelKey] }}
          </Option>
        </Select>
      </Col>
      <Col class="btn-col" span="2">
        <Button @click="onQuery" type="primary">搜索</Button>
      </Col>

    </Row>
  </div>
</template>
<script>

import {
  Button, Col, DatePicker, Input, Option, Row, Select
} from 'iview';

export default {
  name: 'DataListQuery',
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    Row, Col, Button, DatePicker, Select, Option, Input,
  },
  data() {
    return {
      queryParams: {},
      resParams: {},
    };
  },
  methods: {
    reset() {
      this.onCancel();
    },
    onQuery() {
      this.tranParams();
      this.onParamsChange();
      this.$emit('on-query');
    },
    onCancel() {
      const obj = Object.keys(this.resParams).reduce((pre, cur) => {
        if (!cur) return pre;
        const v = pre;
        v[cur] = '';
        return v;
      }, {});
      this.resParams = { ...obj };
      this.queryParams = { ...obj };
      this.onParamsChange();
    },
    onParamsChange() {
      this.$emit('on-change', this.resParams);
    },
    tranParams() {
      this.resParams = { ...this.queryParams };
      this.list.forEach((item) => {
        const { type, model } = item;
        const val = this.queryParams[model];
        if (['datetime', 'datetimerange', 'date'].indexOf(type) !== -1) {
          this.$set(this.resParams, model, this.tranDate(val));
        }
      });
      // this.filterEmpty();
    },
    isEmpty(val) {
      if (!val) return true;
      if (Array.isArray(val)) {
        return val.every(item => !item);
      }
      return false;
    },
    tranDate(val) {
      if (!val) return '';
      if (Array.isArray(val)) {
        const v = val.map(o => (o && new Date(o).getTime()) || '');
        return this.isEmpty(v) ? '' : v;
      }
      return new Date(val).getTime();
    },
    filterEmpty() {
      this.resParams = Object.keys(this.resParams).reduce((pre, cur) => {
        if (!cur) return pre;
        const v = this.resParams[cur];
        const ret = pre;
        if (v) ret[cur] = v;
        return ret;
      }, {});
    },
  },
  computed: {
    list() {
      return this.items;
    },
  },
};
</script>
<style lang="less" scoped>

  .data-list-query-wrapper {
    margin-top: 10px;

    .query-col {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .query-label {
      margin-right: 10px;
      font-size: 12px;
      color: #3b3b3b;
      text-align: left;
    }
    .btn-col {
      text-align: center;
    }
  }

</style>
