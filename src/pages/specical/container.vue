<template>
  <a-layout-content
    :style="{
      margin: '10px',
      marginTop: 0,
      padding: '16px',
      background: '#fff',
      minHeight: '280px',
      height: '100%',
      overflowY: 'auto'
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
