// lib/axios.ts
import axios from "axios";
import { baseUrl } from "@/config/constants";

export const api = axios.create({
  baseURL: `${baseUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});
