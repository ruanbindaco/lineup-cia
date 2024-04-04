import "./assets/main.css";
import "regenerator-runtime/runtime";

import { createApp } from "vue";
import * as Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueHtml2Canvas from "vue-html2canvas";

const app = createApp(App);

app.use(VueHtml2Canvas);
app.use(router);

app.mount("#app");
