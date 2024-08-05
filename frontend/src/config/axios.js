import { default as axios_lib } from "axios";

const axios = axios_lib.create({
  baseURL: "https://chat-app-qxrf.onrender.com/api",
});

export default axios;
