import axios, { AxiosInstance } from 'axios';
import { omit } from 'lodash';
import storageService from '../storage';
import { EventNames } from '../../models/event.ts';
import { TOKEN_KEY } from '../../constants.ts';

class ApiService {
  private static _instance: ApiService;
  readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_SERVER_URL,
      timeout: 5000
    });

    storageService.addEventListener(
      EventNames.NEW_TOKEN,
      this.updateClientAuthorizationHeader
    );

    storageService.addEventListener(
      EventNames.TOKEN_REMOVED,
      this.removeClientAuthorizationHeader
    );

    this.updateClientAuthorizationHeader();
  }

  updateClientAuthorizationHeader = () => {
    const payload = storageService.getValueFromStorage(TOKEN_KEY);
    if (payload) {
      this.client.defaults.headers.common['Authorization'] = payload;
    }
  };

  removeClientAuthorizationHeader = () => {
    this.client.defaults.headers.common = omit(
      this.client.defaults.headers.common,
      ['Authorization']
    );
  };

  static getInstance = (): ApiService =>
    this._instance || (this._instance = new this());
}

const apiService = ApiService.getInstance();

export default apiService;
