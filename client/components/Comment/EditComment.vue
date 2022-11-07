<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
      class="comment-container"
  >
    <p class="x-icon" @click="$store.commit('show_comment_modal', false)">X </p>
    <header>

      <p style="font-weight: bold; font-size: 24px; text-align: center; padding-top: 10px;">Edit Comment </p>
      <div style="display: flex; flex-direction: column; justify-content: space-evenly">
        <div
            style="border-top-style: solid; border-color: blue; margin-top: 2px; margin-left: 24px; margin-right: 24px; display: flex; justify-content: space-between; flex-direction: column">
        <textarea
            class="content"
            :value="draft"
            @input="draft = $event.target.value"
            placeholder="Edit comment"
            maxlength="140"
        >
        </textarea>
          <div class="the-count">
            <span id="current">{{ this.draft.length }}</span>
            <span id="maximum">/ 140</span>
          </div>
          <b-button variant="success" size="lg" @click="edit_comment"
                    style="margin-top: 20px; margin-bottom: 20px">Submit Comment
          </b-button>
        </div>
      </div>

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


export default {
  name: 'EditComment',
  props: {
    comment_curr: {
      required: true,
    },
    comment_id: {
      required: true,
    },
  },
  data() {
    return {
      alerts: {},
      comments: [],
      draft: "",
      enabled: false,
      expiry: '',
    };
  },

  methods: {
    async edit_comment() {
      const options = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: this.draft})
      };
      console.log("this is ID ", this.comment_id)
      const r = await fetch(`/api/comments/${this.comment_id}`, options);
      const res = await r.json();
      if (!r.ok) {
        console.log(res.error);
      } else {
        this.draft = "";
        const message = 'Successfully edited comment!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
        await new Promise(f => setTimeout(f, 2000));
        this.$emit("fetchComments");
        this.$emit('closeModal');
      }
    },
  },
  created() {
    this.draft = this.comment_curr.content
    console.log("received comment ", this.comment_id)
  }
};
</script>

<style scoped>
.comment-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

}

textarea {
  margin-top: 24px;
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
  margin-bottom: 18px;
  margin-top: 4px;
}


.x-icon {
  font-weight: bold;
  text-align: right;
  margin-top: 24px;
  margin-right: 24px;
  font-size: 24px;
}

.x-icon:hover {
  cursor: pointer;
}
</style>
