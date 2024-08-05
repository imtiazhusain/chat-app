import { default as axios_lib } from "axios";

const axios = axios_lib.create({
  // baseURL: "http://localhost:2100/api", // local url
  baseURL: "https://chat-app-qxrf.onrender.com/api",
});

export default axios;
