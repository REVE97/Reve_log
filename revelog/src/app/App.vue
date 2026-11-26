<template>
  <div class="app-layout">
    <Sidebar />

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './layouts/Sidebar.vue';
</script>
