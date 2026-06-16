<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <img :src="logo" alt="logo"/>
    </div>

    <!-- <div class="sidebar-link">
      <img :src="github" alt="github" />
      <img :src="velog" alt="velog" />
    </div> -->

    <nav class="sidebar-nav">
      <RouterLink to="/" class="nav-item">
        Resume
      </RouterLink>

      <RouterLink to="/project" class="nav-item">
        Project
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import logo from '../assets/default_logo_clear.png'
import github from '../assets/github_clear.svg'
import velog from '../assets/velog_clear.svg'
</script>