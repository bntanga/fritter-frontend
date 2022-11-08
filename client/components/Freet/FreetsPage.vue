<!-- Default page that also displays freets -->

<template>
  <main style="min-width: 60%; display: flex; flex-direction: row; justify-content: center">
    <article style="max-width: 1200px; width: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center">
    <section v-if="$store.state.username">
      <header class = "welcome-text">
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>

      <modal
          v-if="$store.state.create_freet_modal"
          @closed="$store.commit('show_modal', false)"
          height = "800px"
          width = "700px"
          name="example">
<!--        <CreateFreetForm/>-->
        <AddFreetCustom/>
      </modal>

    </section>
    <section v-else>
      <header>
        <h2 class = "welcome-text">Welcome to Fritter!</h2>
      </header>
      <article>
        <h3 class="welcome-text">
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header style="display:flex; flex-direction: column">
        <div class="left">
          <h2 class="viewing-text">
            Viewing all freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm
              ref="getFreetsForm"
              value="author"
              placeholder="🔍 Filter by author (optional)"
              button="🔄 Get freets"
          />
        </div>
      </header>
      <section
          v-if="$store.state.freets.length"
      >
        <FreetComponent
            v-for="freet in $store.state.freets"
            :key="freet.id"
            :freet="freet"
        />
      </section>
      <article
          v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
    </article>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import ExpirationSelector from "./ExpirationComponent";
import AddFreetCustom from "./AddFreetCustom";

export default {
  name: 'FreetPage',
  components: {AddFreetCustom, ExpirationSelector, FreetComponent, GetFreetsForm, CreateFreetForm},
  mounted() {
    this.$refs.getFreetsForm.submit();
  },
  updated() {
    if (this.$store.state.create_freet_modal) {
      this.$modal.show('example');
    }
    console.log("mounted");
    console.log("this is store state open create freets: ", this.$store.state.create_freet_modal)
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
.create-modal{
}
.welcome-text{
  margin-top: 36px;
  font-family: "Kohinoor Devanagari",sans-serif;
}
.viewing-text{
  font-family: "Kohinoor Devanagari",sans-serif;
  font-size: 24px;
  margin-top: 32px;

}
</style>
