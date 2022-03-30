<template>
  <div>
    <el-button @click="go">跳转详情页</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    go() {
      this.$router.push({
        name: 'hospitalDetail',
        params: {
          id: 1,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
