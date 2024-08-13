import { default as axios_lib } from "axios";

const axios = axios_lib.create({
  // baseURL: "http://localhost:2100/api", // local url
  baseURL: import.meta.env.VITE_API_URL,
});

export default axios;
