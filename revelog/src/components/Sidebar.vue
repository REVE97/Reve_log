<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <img :src="logo" alt="logo"/>
    </div>

    <div class="sidebar-link">
      <a href="https://github.com/REVE97" target="_blank">
        <img :src="github" alt="github" />
      </a>
      <a href="https://velog.io/@zxcv9675/posts" target="_blank">
        <img :src="velog" alt="velog" />
      </a>
    </div>
    
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