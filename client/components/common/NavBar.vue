<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <div class="sidebar">
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div>
      <router-link to="/">
        Home
      </router-link>
    </div>
    <div>
      <router-link
          v-if="$store.state.username"
          to="/account"
      >
        Account
      </router-link>
      <router-link
          v-else
          to="/login"
      >
        Login
      </router-link>
    </div>
    <div class="freet-button" @click="$store.commit('show_modal', true)">
      Freet
    </div>
    <section class="alerts">
      <article
          v-for="(status, alert, index) in $store.state.alerts"
          :key="index"
          :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
</template>

<style scoped>
nav {
  padding: 1vw 2vw;
  background-color: #ccc;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.title {
  font-size: 32px;
  margin: 0 5px;
}

img {
  height: 32px;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  font-size: 20px;
  display: grid;
  gap: 16px;
  grid-auto-flow: column;
  align-items: center;
}

.right a {
  margin-left: 5px;
}

.alerts {
  width: 25%;
}

.sidebar {
  height: 100vh;
  width: 300px;
  position: fixed;
  left: 0;
  /*top: 0;*/
  padding-top: 40px;
  background-color: lightblue;
  overflow-y: hidden;
}

.sidebar div {
  padding: 8px;
  font-size: 24px;
  display: block;
}

.body-text {
  margin-left: 150px;
  font-size: 18px;
}

.freet-button:hover,
.freet-button:focus {
  box-shadow: 0 0.5em 0.5em -0.4em;
  transform: translateY(-0.25em);
  cursor: pointer;
}
</style>
