<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <div class="sidebar">
    <div style="display: flex; flex-direction: column; align-items: center; ">
      <img src="../../public/logo.svg">
      <h1 style="font-size: 32px; font-family: 'Arial Hebrew',serif; font-weight: 600">
        Fritter
      </h1>
    </div>
    <div @click="onClickHome">
      <router-link to="/" :class="$store.state.active_page === 'home'? 'nav-link':'nav-link-alt'">
        <!--        <router-link to="/" class="nav-link-2">-->
        Home
      </router-link>
    </div>
    <div @click="onClickAccount" v-if="$store.state.username">
      <router-link :class="$store.state.active_page === 'account'? 'nav-link':'nav-link-alt'"

                   to="/account"
      >
        Account
      </router-link>
    </div>
    <div @click="onClickLogin" v-else>
      <router-link :class="$store.state.active_page === 'account'? 'nav-link':'nav-link-alt'"

                   to="/login"
      >
        Login
      </router-link>
    </div>
    <div class="freet-button" @click="onClickCreateFreet" v-if="$store.state.username">
      Create Freet
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



<script>
import router from "../../router";

export default {
  name: 'NavBar',
  props: {},
  data() {
    return {}
  },
  methods: {

    onClickHome(){
      router.push("/");
      this.$store.commit('change_active_page', 'home');
    },
    onClickAccount(){
      router.push("/account");
      this.$store.commit('change_active_page', 'account');
    },
    onClickLogin(){
      router.push("/login");
      this.$store.commit('change_active_page', 'account');
    },
    onClickCreateFreet(){
      if(this.$store.state.active_page === "account"){
        router.push("/");
      }
      this.$store.commit('show_modal', true);
      this.$store.commit('change_active_page', 'home');
    }
  },
}


</script>

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
  width: 15%;
  max-width: 400px;
  position: fixed;
  left: 0;
  /*top: 0;*/
  padding-top: 40px;
  background-color: #EECBCB;
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

.freet-button{
  font-weight: 600;
  font-family: "Arial Hebrew", sans-serif;
  width: 90%;
  text-decoration: none;
  background-color: #D16060;
  border-radius: 24px;
  text-align: center;
  margin-left: 16px;
  margin-top: 100px;
  color: #FCDFDF;
  font-size: 28px !important;

}
.freet-button:hover,
.freet-button:focus {
  box-shadow: 0 0.5em 0.5em -0.4em;
  transform: translateY(-0.25em);
  cursor: pointer;
  color: #FFFFFF;
}

.nav-link {
  color: black;
  font-weight: 500;
  font-family: "Hoefler Text", sans-serif;
  background-color: white;
  padding: 20px;
  width: 600px;
}

.nav-link-alt {
  color: black;
  font-weight: 500;
  font-family: "Hoefler Text", sans-serif;
  width: 600px;
  text-decoration: none;
  padding: 20px;
}

.nav-link:hover {
  color: red;
  box-shadow: 0 0.5em 0.5em -0.4em;
  transform: translateY(-0.25em);
}

.nav-link-alt:hover {
  color: red;
  transform: translateY(-0.25em);
}

</style>
