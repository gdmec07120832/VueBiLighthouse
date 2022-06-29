<template>
  <iframe :src="$route.meta.realPath" width="100%" height="100%" style="border: 0"></iframe>
</template>

<script>
export default {
name: "FakeFrame"
}
</script>

<style scoped>

</style>
