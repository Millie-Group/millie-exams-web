<template>
  <div class="admin-layout">
    <admin-menu />

    <main class="admin-page">
      <Nuxt />
    </main>
  </div>
</template>

<script>
export default {
  head() {
    return {
      meta: [
        {hid: 'robots', name: 'robots', content: 'none'}
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://ensembleeducation.org' + this.$route.path
        }
      ]
    }
  }
}
</script>

<style lang="scss">
@import "~/styles/layouts.scss";
</style>
