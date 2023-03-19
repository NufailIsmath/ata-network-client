import { apiConfig } from "@/utils/config";
import axios from "axios";

class API {
  async metaTx(data) {
    const result = await axios.post(`${apiConfig.baseURL}/metaTx`, data);
    return result.data;
  }
}

export const apis = new API();