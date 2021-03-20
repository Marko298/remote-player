import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "./assets/tailwind.css";
import VueSocketIO from "vue-socket.io";
import { io } from "socket.io-client";

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io(process.env.VUE_APP_SERVER),
  })
);

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
