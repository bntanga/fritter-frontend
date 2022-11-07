<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
      class="comment-container"
  >
    <header>
      <div style="display: flex; flex-direction: column; justify-content: space-evenly">
        <div style="border-top-style: solid; margin-top: 16px" >
        <textarea
            class="content"
            :value="draft"
            @input="draft = $event.target.value"
            placeholder=" Write your reply"
            maxlength="140"
        ></textarea>
        <div class="the-count">
          <span id="current">{{ this.draft.length }}</span>
          <span id="maximum">/ 140</span>
        </div>


        <span style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px">
          <div>
            <div>
               {{!this.enabled? "Anonymous comments are off": "Commenting anonymously"}}
            </div>
            <switches v-model="enabled" theme="bulma" color="blue"></switches>
          </div>
          <b-button variant="outline-success" size="sm" @click="add_comment" style = "margin-top: 20px; margin-bottom: 20px">Submit comment</b-button>
        </span>
        </div>
      </div>
      <SingleComment
          v-for="comment_single in comments"
          :comment="comment_single"
          @refreshComments="fetch_comments_and_refresh"
      />
    </header>
  </article>
</template>

<script>
import SingleComment from "./SingleComment";

export default {
  name: 'CommentComponent',
  components: {SingleComment},
  props: {
    freetId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      draft: "",
      enabled: false,
    };
  },

  methods: {

    async fetch_comments_and_refresh() {
      await this.fetch_comments();
      this.$emit('updateComments');
    },

    async fetch_comments() {
      console.log("fetch called");
      const options = {
        method: "GET", headers: {'Content-Type': 'application/json'}
      };
      const r = await fetch(`/api/comments/${this.freetId}`, options);
      const res = await r.json();
      if (!r.ok) {
        console.log(res.error);
      } else {
        this.comments = [];
        for (const comment_ind in res) {
          this.comments.push(res[comment_ind]);
        }
      }
    },
    async add_comment() {
      const options = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: this.draft, anonymous: this.enabled})
      };
      const r = await fetch(`/api/comments/${this.freetId}`, options);
      const res = await r.json();
      if (!r.ok) {
        console.log(res.error);
      } else {
        await this.fetch_comments();
        this.draft = "";
        this.$emit('updateComments', this.comments.length);

      }
    },
  },
  created() {
    this.fetch_comments();
  },
};
</script>

<style scoped>
.comment-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

}

textarea {
  margin-top: 10px;
  width: 100%;
  height: 80px;
  -moz-border-bottom-colors: none;
  -moz-border-left-colors: none;
  -moz-border-right-colors: none;
  -moz-border-top-colors: none;
  background: none repeat scroll 0 0 rgba(0, 0, 0, 0.07);
  border-image: none;
  border-radius: 6px 6px 6px 6px;
  border-style: none solid solid none;
  border-width: medium 1px 1px medium;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12) inset;
  color: #555555;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 1em;
  line-height: 1.4em;
  padding: 5px 8px;
  transition: background-color 0.2s ease 0s;
}


textarea:focus {
  background: none repeat scroll 0 0 #FFFFFF;
  outline-width: 0;
}

.the-count {
  float: right;
  padding: 0.1rem 0 0 0;
  font-size: 0.875rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

</style>
