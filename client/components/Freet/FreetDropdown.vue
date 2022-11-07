
<template>
  <article>
  <div class="dropdown" v-click-outside-element="closeDd">
    <div class="dropbtn" @click="show_dropdown=!show_dropdown"><font-awesome-icon icon="fa-solid fa-ellipsis" size="lg"/></div>
    <div id="myDropdown" :class=" show_dropdown? 'dropdown-content show': 'dropdown-content' " >
      <a href="#" @click="this.deleteFreetLocal"> 🗑️ Delete Freet</a>
      <a href="#"@click="this.editFreetLocal">✏️ Edit Content</a>
      <a href="#" @click="this.editExpirationLocal" v-if="freet.expiryDate!==''">🗓️️ Edit expiry </a>
      <a href="#" @click="this.editExpirationLocal" v-else> ➕ Add Expiry </a>
      <a href="#" @click="this.deleteExpirationLocal" v-if="freet.expiryDate!==''">❌ Delete Expiry </a>

    </div>
  </div>
    <modal
        v-if="edit_exp_modal"
        @closed="edit_exp_modal=false"
        height = "50%"
        width = "50%"
        name="example">
      <EditExpiration :freet="freet" @closeModal = "edit_exp_modal=false"/>
    </modal>
    <section class="alerts">
      <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>

</template>

<script>

import EditExpiration from "./EditExpiration";
export default {
  name: 'CustomDropdown',
  components: {EditExpiration},
  props: {
    deleteFreet:{
      required: true,
    },
    editFreet:{
      required: true,
    },
    freet:{

    },
  },
  data() {
    return {
      show_dropdown: false,
      edit_exp_modal : false,
      alerts: {},
    };
  },

  methods: {
    closeDd(){
      this.show_dropdown = false;
    },
    deleteFreetLocal(){
      this.show_dropdown = false;
      this.deleteFreet();
    },
    editFreetLocal(){
      this.show_dropdown = false;
      this.editFreet();
    },
    editExpirationLocal(){
      this.show_dropdown = false;
      this.edit_exp_modal = true;
    },
    async deleteExpirationLocal(){
      const options = {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      };
      console.log("this is ID ", this.comment_id)
      const r = await fetch(`/api/expiry/${this.freet._id}`, options);
      const res = await r.json();
      if (!r.ok) {
        console.log(res.error);
      } else {
        this.draft = "";
        const message = 'Successfully deleted expiry!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
        this.show_dropdown = false;
        this.$store.commit("refreshFreets");
      }

    }
  },

  created() {
  },
  updated() {
    if (this.edit_exp_modal) {
      this.$modal.show('example');
    }
  },
};

</script>

<style scoped>
/* Dropdown Button */
.dropbtn {
  color: black;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* Dropdown button on hover & focus */
.dropbtn:hover, .dropbtn:focus {
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #ddd;}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {display:block;}

</style>
