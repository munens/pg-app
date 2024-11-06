import { jwtDecode, JwtPayload } from 'jwt-decode';
import { EventNames, AppEvent } from '../../models/event.ts';
import { FedhaEventTarget } from './types.ts';

class StorageService extends FedhaEventTarget {
  private static _instance: this;
  private readonly localStorage: Storage;

  constructor() {
    super();
    this.localStorage = window.localStorage;
  }

  getValueFromStorage = (token: string): string | null =>
    localStorage.getItem(token);

  getParsedValueFromStorage = <T>(token: string): (JwtPayload & T) | null => {
    const value = this.getValueFromStorage(token);
    return value ? this.parseValueFromStorage<JwtPayload & T>(value) : null;
  };

  replaceValueInStorage = <T>(token: string, value: T): void => {
    if (this.getValueFromStorage(token)) {
      this.removeValueFromStorage(token);
    }

    localStorage.setItem(token, value);
    this.dispatchEvent(new FedhaEvent(EventNames.NEW_TOKEN));
  };

  removeValueFromStorage = (token: string): void => {
    if (this.getValueFromStorage(token)) {
      localStorage.removeItem(token);
    }
    this.dispatchEvent(new FedhaEvent(EventNames.TOKEN_REMOVED));
  };

  private parseValueFromStorage = (token: string): JwtPayload =>
    jwtDecode<JwtPayload>(token);

  static getInstance = (): StorageService =>
    this._instance || (this._instance = new this());
}

const storageService = StorageService.getInstance();

export default storageService;
