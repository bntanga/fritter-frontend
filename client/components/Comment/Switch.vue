<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <!-- Rounded switch -->
  <label class="switch">
    <input type="checkbox">
    <span class="slider round"></span>
  </label>
</template>

<script>
export default {
  name: 'Switch',
  props: {
    // Data from the stored freet
    comment: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
    };
  },

  methods: {
  },
  created() {
    console.log("created comment");
    console.log("this is comment", this.comment);
  },
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

</style>
