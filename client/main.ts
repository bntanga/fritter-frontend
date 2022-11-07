import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Switches from 'vue-switches';

import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faHeart as faHeartSolid, faEllipsis} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import dropdown from 'vue-dropdowns';


// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
/* add icons to the library */
library.add(faHeartSolid)
library.add(faHeartRegular)
library.add(faEllipsis)

import VModal from 'vue-js-modal'
Vue.use(VModal)

import vueClickOutsideElement from 'vue-click-outside-element'


/* NOTE: By default directive mounts with `click-outside-element`
 * `app.use(vueClickOutsideElement)`
 * But you can name it whatever you want
 * app.use(vueClickOutsideElement, 'my-name')
 * And use it like `<div v-my-name="method"></div>`
 */

Vue.use(vueClickOutsideElement)

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('switches', Switches)
Vue.component('dropdown', dropdown)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
