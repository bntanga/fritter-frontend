
<template>
  <article>
    <div class="dropdown" v-click-outside-element="closeDd">
      <div class="dropbtn" @click="show_dropdown=!show_dropdown"><font-awesome-icon icon="fa-solid fa-ellipsis" size="lg"/></div>
      <div id="myDropdown" :class=" show_dropdown? 'dropdown-content show': 'dropdown-content' " >
        <a href="#" @click="this.deleteCommentLocal"> 🗑️ Delete</a>
        <a href="#"@click="this.editCommentLocal">✏️ Edit Content</a>
      </div>
    </div>
  </article>
</template>

<script>

export default {
  name: 'CommentDropdown',
  props: {
    deleteComment:{
      required: true,
    },
  },
  data() {
    return {
      show_dropdown: false
    };
  },

  methods: {
    closeDd(){
      this.show_dropdown = false;
    },
    deleteCommentLocal(){
      this.show_dropdown = false;
      this.deleteComment();
    },
    editCommentLocal(){
      this.show_dropdown = false;
      this.$emit("showEditComment");
      this.$store.commit('show_comment_modal', true);
    }
  },
  created() {
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
