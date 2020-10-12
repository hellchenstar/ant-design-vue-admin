<template>
  <a-layout-content
    :style="{
      margin: '24px 16px',
      padding: '24px',
      background: '#fff',
      minHeight: '280px',
      borderRadius: '10px',
      height: '100%'
    }"
  >
    <router-view></router-view>
  </a-layout-content>
</template>
<script>
export default {
  name: 'container'
}
</script>
