<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
      class="single-comment-container"
  >
    <header>
      <div style="display: flex; flex-direction: row; justify-content: space-between">
        <div style="font-family: 'Kohinoor Devanagari',sans-serif; font-weight: 600">@{{ comment.author }} </div>
        <div style="  font-size: 14px; color: #cccccc; margin-left: 24px">
          Posted on {{ comment.dateCreated }}
        </div>
      </div>
      <div style="display: flex; flex-direction: row; justify-content: space-between">
        <div style="padding-top: 8px; font-family: Roboto; font-size: 18px">
          {{ comment.content }}
        </div>
        <div v-if="$store.state.username === comment.author">
          <CommentDropdown :delete-comment="deleteComment" @showEditComment="show_edit_comment=true"/>
        </div>

      </div>
    </header>
    <modal
        v-if="show_edit_comment"
        @closed="show_edit_comment=false"
        height = "50%"
        width = "50%"
        name="example">
      <EditComment :comment_curr='this.comment' @fetchComments = "$emit('refreshComments')" :comment_id='this.comment._id' @closeModal="show_edit_comment=false"/>
    </modal>
  </article>
</template>

<script>
import CommentDropdown from "./CommentDropdown";
import EditComment from "./EditComment";
export default {
  name: 'SingleComment',
  components: {EditComment, CommentDropdown},
  props: {
    // Data from the stored freet
    comment: {
      type: Object,
      required: false
    },
  },
  data() {
    return {
      show_edit_comment: false,
    };
  },

  methods: {
    async deleteComment() {
      const options = {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const r = await fetch(`/api/comments/${this.comment._id}`, options);
      const res = await r.json();
      if (!r.ok) {
        console.log(res.error);
      } else {
        this.$store.commit("refresh");
        this.$emit("refreshComments");
      }
    },

  },

  created() {
    console.log("created comment");
    console.log("this is comment", this.comment._id);
  },
  updated() {
    if (this.$store.state.show_comment_modal) {
      this.$modal.show('example');
    }
  }
};
</script>

<style scoped>
.freet {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  margin: 20px;
  border-radius: 20px;
}

.info {
  font-size: 16px;
  color: #cccccc;
}

.single-comment-container {
  border-top-color: green;
  border-width: 1px;
  border-top-style: solid;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom-color: green;
  border-bottom-style: solid;
}

</style>
