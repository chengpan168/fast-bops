<template>
  <div class="select-wrapper">
    <Select
      :value="currentValue"
      @on-change="onChange"
      :clearable="clearable">
      <Option v-for="o in items"
              :value="o.value || o.id"
              :key="o.value || o.id">{{ o.label || o.name }}</Option>
    </Select>
  </div>
</template>

<script>

export default {
  name: 'selectWrapper',
  props: {
    value: [Number, String],
    placeholder: {
      type: String
    },
    items: {
      type: Array
    },
    clearable: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
  },
  components: {},
  data() {
    return {
      currentValue: this.value
    };
  },
  methods: {
    onChange(value) {
      this.currentValue = value;
      this.$emit('input', value);
      this.$emit('on-change', value);
    }
  },
  watch: {
    value(newVal) {
      this.currentValue = newVal;
    }
  },
};
</script>

<style lang="less" scoped>
  .select-wrapper {
    text-align: left;
  }
</style>
