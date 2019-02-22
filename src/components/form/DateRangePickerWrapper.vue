<template>
  <div class="daterange-picker-wrapper">
    <DatePicker
      :clearable="clearable"
      :editable="editable"
      :format="format"
      :placeholder="placeholder"
      :readonly="readonly"
      :transfer="transfer"
      :type="type"
      v-model="currentValue"
      @on-change="onChange"
      placement="bottom-start"
      split-panels
      style="width: 280px"/>
  </div>
</template>

<script>

export default {
  name: 'dateRangeWrapper',
  props: {
    value: Object,
    start: String,
    end: String,
    placeholder: {
      type: String,
      default() {
        return '请选择日期范围';
      }
    },
    type: {
      type: String,
      default() {
        return 'daterange';
      }
    },
    clearable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    editable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    readonly: {
      type: Boolean,
      default() {
        return false;
      }
    },
    transfer: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    format() {
      if (this.type === 'daterange') {
        return 'yyyy-MM-dd';
      }
      return 'yyyy-MM-dd HH:mm:ss';
    }
  },
  components: {},
  data() {
    return {
      currentValue: [this.start, this.end]
    };
  },
  methods: {
    onChange(value) {
      this.$emit('update:start', value[0]);
      this.$emit('update:end', value[1]);
    }
  },
  watch: {
    start(newVal) {
      this.currentValue = [newVal, this.end];
    },
    end(newVal) {
      this.currentValue = [this.start, newVal];
    },
  }
};
</script>

<style lang="less" scoped>
  .daterange-picker-wrapper {
    text-align: left;
  }
</style>
