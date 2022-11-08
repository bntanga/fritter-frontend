<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div>
    <p class = "x-icon" @click="$emit('closeModal');">X </p>
    <div class="component-container">
    <p v-if="freet.expiryDate!==''"
        style="font-weight: 600; font-size: 20px; text-align: center; margin-bottom: 30px; color: green"> Edit Expiration </p>
    <p v-else
       style="font-weight: 600; font-size: 20px; text-align: center; margin-bottom: 30px; color: green"> Add Expiration </p>
    <article style="display: flex; flex-direction: row">
      <div class="single-dd-container">
        <div class="dropdown-intro">Month</div>
        <b-dropdown id="dropdown-1" :text="curr_month" class="m-md-2 dropdown-container" variant="outline-primary"
                    size="sm">
          <b-dropdown-item v-for="month in months" @click="()=> curr_month=month">{{ month }}</b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="single-dd-container">
        <div class="dropdown-intro">Day</div>
        <b-dropdown id="dropdown-1" :text="curr_day" class="m-md-2 dropdown-container" variant="outline-primary"
                    size="sm">
          <b-dropdown-item v-for="day in days" @click="()=> curr_day=day">{{ day }} </b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="single-dd-container">
        <div class="dropdown-intro">Year</div>
        <b-dropdown id="dropdown-1" :text="curr_year" class="m-md-2 dropdown-container" variant="outline-primary"
                    size="sm">
          <b-dropdown-item v-for="year in years" @click="()=> curr_year=year">{{ year }}</b-dropdown-item>
        </b-dropdown>
      </div>
    </article>


    <div style="display: flex; flex-direction: row">
      <div class="single-dd-container">
        <div class="dropdown-intro">Hour</div>
        <b-dropdown id="dropdown-1" :text="curr_hour" class="m-md-2 dropdown-container" variant="outline-primary"
                    size="sm">
          <b-dropdown-item v-for="hour in hours" @click="()=> curr_hour=hour">{{ hour }}  </b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="single-dd-container">
        <div class="dropdown-intro">Minute</div>
        <b-dropdown id="dropdown-1" :text="curr_min" class="m-md-2 dropdown-container" variant="outline-primary"
                    size="sm">
          <b-dropdown-item v-for="min in mins" @click="()=> curr_min=min">{{ min }} </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>

    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <div v-if="freet.expiryDate!==''"
           style="font-weight: 600; font-size: 16px; text-align: left; margin-bottom: 10px; color: blue;  margin-top: 8px">Current Expiration: {{freet.expiryDate}}</div>
    </div>


    <section class="alerts">
      <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
    </div>
    <p>
      <b-button variant="success"  @click="setExpiry" style="margin-top: 24px; margin-left: 16px; margin-right: 16px; width: 94%">Set expiry</b-button>
    </p>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: 'EditExpiration',
  props: {
    freet: {},
  },
  data() {
    return {
      hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      curr_hour: "Hour ",
      mins: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
      curr_min: "Minute ",
      months: ["January ", "February ", "March ", "April ", "May ", "June ", "July ", "August ", "September ", "October ", "November ", "December "],
      curr_month: "Month",
      days: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      curr_day: "Day ",
      years: ['2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036', '2037', '2038', '2039', '2040', '2041', '2042', '2043', '2044', '2045', '2046', '2047', '2048', '2049', '2050', '2051', '2052', '2053', '2054', '2055', '2056', '2057', '2058', '2059', '2060', '2061', '2062', '2063', '2064', '2065', '2066', '2067', '2068', '2069', '2070', '2071', '2072', '2073', '2074', '2075', '2076', '2077', '2078', '2079', '2080', '2081', '2082', '2083', '2084', '2085', '2086', '2087', '2088', '2089', '2090', '2091', '2092', '2093', '2094', '2095', '2096', '2097', '2098', '2099'],
      curr_year: "Year ",
      alerts: {},
      has_valid_expiry: false,
      curr_expiration: "",
    };


  },

  methods: {
    clearExpiry(){
      this.curr_hour = "Hour ";
      this.curr_min = "Minute ";
      this.curr_day = "Day ";
      this.curr_month = "Month ";
      this.curr_day = "Day ";
      this.has_valid_expiry = false;
      this.curr_expiration = null;
      this.$emit("removeExpiry");
    },
    async setExpiry(){
      console.log("setting expiry");
      let monthMap = {
        "January ": "01", "February ":"02", "March ":"03", "April ":"04", "May ":"05", "June ":"06",
        "July ":"07", "August ":"08", "September ":"09", "October ":"10", "November ":"11", "December ":"12"
      }
      const date_string = `${this.curr_year}-${monthMap[this.curr_month]}-${this.curr_day}T${this.curr_hour}:${this.curr_min}`;
      if (!moment(date_string).isValid()){
        this.$set(this.alerts, "Invalid Date Selected", 'error');
        setTimeout(() => this.$delete(this.alerts, date_string), 3000);
        return
      }
      let curr_date = new Date(date_string);
      if (curr_date < new Date()){
        this.$set(this.alerts, "Cannot set expiration in past", 'error');
        setTimeout(() => this.$delete(this.alerts, "Cannot set expiration in past"), 3000);
        return
      }
      this.has_valid_expiry = true;
      this.curr_expiration = moment(curr_date).format('MMMM Do YYYY, h:mm:ss a');
      await this.edit_expiry_request(date_string);
    },

    async edit_expiry_request(new_expiry) {
      let method = "";
      let message = "";
      if (this.freet.expiryDate===''){
        method = "POST"
        message = 'Successfully added expiry!';

      } else {
        method = "PUT"
        message = 'Successfully edited expiry!';
      }
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({expiryDate: new_expiry})
      };
      console.log("this is ID ", this.comment_id)
      const r = await fetch(`/api/expiry/${this.freet._id}`, options);
      const res = await r.json();
      if (!r.ok) {
        console.log(res.error);
      } else {
        this.draft = "";
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
        await new Promise(f => setTimeout(f, 2000));
        this.$store.commit('refreshFreets');
        this.$emit('closeModal');
      }
    },
  },

  created() {
    console.log("created expiration");
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

.dropdown-container /deep/ .dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
  width: 30px;
}

.single-dd-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dropdown-intro {
  text-align: center;
  color: green;
  font-size: 12px;
}
.component-container{
  border-radius: 8px;
  border-color: blue;
  border-width:2px;
  border-style: solid;
  padding: 24px;
  margin-left: 16px;
  margin-right: 16px;
}
.x-icon{
  font-weight: bold; text-align: right; margin-top: 24px; margin-right: 24px; font-size: 24px;
}
.x-icon:hover{
  cursor: pointer;
}
</style>
