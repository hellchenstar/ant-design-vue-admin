<template>
  <a-layout
    style="background:#eaeaea"
    id="components-layout-demo-custom-trigger"
  >
    <SiderBar />
    <a-layout>
      <HeaderComponent />

      <Container />
    </a-layout>
  </a-layout>
</template>
<script>
import SiderBar from '../specical/siderBar'
import HeaderComponent from '../specical/headerComponent'
import Container from '../specical/container'
export default {
  name: 'home',
  components: {
    SiderBar,
    HeaderComponent,
    Container
  },
  computed: {},
  data() {
    return {}
  }
}
</script>
<style>
#components-layout-demo-custom-trigger {
  height: 100%;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
