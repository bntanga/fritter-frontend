<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
      class="freet"
  >
    <header @delete-freet="this.deleteFreet">
      <p v-if="freet['expiryDate'] !== ''" style="margin-bottom: 8px; font-weight: 300; font-size: 14px;"> Freet expires  {{freet.expiryDate}}</p>
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
      <h2 class="author">
        @{{ freet.author }}
      </h2>
        <CustomDropdown  v-if="$store.state.username === freet.author" :delete-freet="this.deleteFreet" :edit-freet="this.startEditing" :freet="freet"/>
        <modal
            v-if="editing"
            height = "50%"
            width = "50%"
            @close="stopEditing"
            name="edit-freet">
          <button
              @click="submitEdit"
          >
            ✅ Save changes
          </button>
          <button
              @click="stopEditing"
          >
            🚫 Discard changes
          </button>
          <textarea
              class="content"
              :value="draft"
              @input="draft = $event.target.value"
          />

        </modal>
      </div>
      <p class="info">
        Posted at {{ freet.dateModified }}
        <i v-if="freet.edited">(edited)</i>
      </p>
        <p
            class="content"
        >
          {{ freet.content }}
        </p>


      <div style="display: flex; flex-direction: row; justify-content: space-evenly">
        <div @click="()=> this.show_comments= !this.show_comments" class="hover-pointer">
          {{ comments_length}} Comments
        </div>
        <div>
          <div class="hover-pointer"
              v-if="!liked"
              @click="likeFreet">
            <font-awesome-icon icon="fa-regular fa-heart" size="lg" style="color: black;"/>
            {{ users_liking.length }} likes
          </div>
          <div
              v-else
              @click="likeFreet"
              style="color: red"
              class="hover-pointer"
          >
            <font-awesome-icon icon="fa-solid fa-heart" size="lg"/>
            {{ users_liking.length }} likes
          </div>

        </div>
      </div>
      <CommentComponent
          @updateComments = "fetch_num_comments"
          v-if="show_comments"
          :freet-id="freet._id"/>
    </header>
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
import CommentComponent from "../Comment/CommentComponent";
import CustomDropdown from "./FreetDropdown"

export default {
  name: 'FreetComponent',
  components: {CommentComponent, CustomDropdown},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      liked: false,
      users_liking: [],
      show_comments: false,
      comments_length:0,
    };
  },

  methods: {

    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited


    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },

    likeFreet() {
      /**
       * Likes or unlikes Freet
       */
      const method = this.liked ? "DELETE" : "POST";
      const params = {
        method: method,
        message: `Successfully ${method} like on freet!`,
        callback: () => {
          this.liked = this.users_liking.includes(this.$store.state.username);
        }
      };
      this.like_request(params);
    },

    fetchInitialLikes() {
      /**
       * Likes or unlikes Freet
       */
      const params = {
        method: "GET",
        message: `Successfully got likes on freet!`,
        callback: () => {
          this.liked = this.users_liking.includes(this.$store.state.username);
        }
      };
      this.like_request(params);

    },

    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async like_request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/likes/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        let users_liking = [];
        for (let liker of res) {
          users_liking.push(liker["author"]);
        }
        this.users_liking = users_liking;


        // await this.fetchInitialLikes();
        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async fetch_num_comments() {
      const options = {
        method: "GET", headers: {'Content-Type': 'application/json'}
      };
      const r = await fetch(`/api/comments/${this.freet._id}`, options);
      const res = await r.json();
      if (!r.ok) {
        console.log(res.error);
      } else {
        this.comments_length = res.length;
      }
    }
  },
  created() {
    this.fetchInitialLikes();
    this.fetch_num_comments();
    this.$modal.show('edit-freet');
  },
  updated() {
    if (this.editing) {
      this.$modal.show('edit-freet');
    }
    // this.$set(this.alerts, "This is message", 'success');
  }
};
</script>

<style scoped>
.freet {
  border: 1px solid #F0F0F0;
  padding: 20px;
  position: relative;
  margin: 20px;
  max-width: 1200px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px; /* 5px rounded corners */
}

.info {
  font-size: 16px;
  color: #cccccc;
}


.hover-pointer:hover {
  cursor: pointer;
}
.author{
  font-family: "Kohinoor Devanagari",sans-serif;
}
</style>
