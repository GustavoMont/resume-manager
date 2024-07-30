import axios from "axios";
import { API_URL } from "config/constants";

const DFEAULT_CONFIG = {
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
};

const createRequester = () => {
  const api = axios.create(DFEAULT_CONFIG);
  return api;
};

const createTestRequester = () => {
  const api = axios.create({
    ...DFEAULT_CONFIG,
    validateStatus,
  });
  function validateStatus(status: number) {
    return !!status;
  }
  return api;
};

const requester = {
  createTestRequester,
  createRequester,
};

export default requester;
