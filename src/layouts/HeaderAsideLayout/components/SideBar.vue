<template>
    <Menu :active-name="navs.value" theme="light" width="auto" :open-names="[navs.openName]">
        <Submenu :name="item.value" v-for="(item, index) in navs.child" :key="`left_menu_${index}`">
            <template slot="title">{{item.label}}</template>
            <MenuItem
                  v-for="(o, i) in item.child"
                  :name="o.value"
                  :key="`left_sub_menu_${i}`"
                  :to="{path: o.path}"
            >
                {{`${o.label}`}}
            </MenuItem>
        </Submenu>
    </Menu>
</template>
<script>

import { Menu, Submenu, MenuItem } from 'iview';
import SideNav from '../sideNav';

export default {
  data() {
    return {
      navs: SideNav.operation,
      findIndex: 0
    };
  },
  components: { Menu, Submenu, MenuItem },
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
      const { name } = this.$route;
      const findIndex = this.navs.child.findIndex(p => p.child.findIndex(c => c.value === name) !== -1);
      if (findIndex < 0) return;
      this.findIndex = findIndex;
      this.navs = {
        ...this.navs,
        value: this.$route.name,
        openName: this.navs.child[findIndex].value
      };
    }
  }
};
</script>
