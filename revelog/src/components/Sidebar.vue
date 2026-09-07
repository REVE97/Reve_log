<script setup>
import logo from '../assets/reve_logo.svg'
</script>

<template>
  <aside class="sidebar">
    <RouterLink
      to="/"
      class="sidebar-brand"
      aria-label="REVE 홈"
    >
      <img
        :src="logo"
        alt=""
        class="sidebar-logo"
      />
      <span>REVE</span>
    </RouterLink>
    <nav
      class="sidebar-nav"
      aria-label="주 메뉴"
    >
      <RouterLink
        to="/"
        class="nav-item"
      >
        <span
          class="icon icon-resume"
          aria-hidden="true"
        ></span>
        Resume
      </RouterLink>
    </nav>
    <nav
      class="section-nav"
      aria-label="경력기술서 목차"
    >
      <RouterLink :to="{ path: '/', hash: '#profile' }">
        <span>01</span>
        Profile
      </RouterLink>
      <RouterLink :to="{ path: '/', hash: '#experience' }">
        <span>02</span>
        Experience
      </RouterLink>
      <RouterLink :to="{ path: '/', hash: '#skills' }">
        <span>03</span>
        Skills
      </RouterLink>
    </nav>
    <p class="sidebar-caption">
      A record of
      <br />
      work & growth.
    </p>
  </aside>
</template>
