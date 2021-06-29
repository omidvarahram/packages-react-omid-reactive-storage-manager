import {Observable, of} from "rxjs";

enum storageType {
  local = 'local',
  session = 'session',
}

type StorageModel = 'local' | 'session';

function toObject(obj: any): any {
  if (!!obj || obj === 0 || obj === '0' || obj === '') {
    if (typeof obj === 'object' && !obj.hasOwnProperty('length')) {
      return obj;
    }
    return { data: obj };
  }
  return { data: [] };
}

function objToJson(obj: any): string {
  return JSON.stringify(toObject(obj));
}

function jsonToObj(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

function getFromLocalStorage(key: string): any {
  return localStorage.getItem(key);
}

function getFromSessionStorage(key: string): any {
  return sessionStorage.getItem(key);
}

function setOnLocalStorage(key: string, value: any): Observable<boolean> {
  try {
    localStorage.setItem(key, value);
    return of(localStorage.getItem(key) === value);
  } catch {
    return of(false);
  }
}

function setOnSessionStorage(key: string, value: any): Observable<boolean> {
  try {
    sessionStorage.setItem(key, value);
    return of(sessionStorage.getItem(key) === value);
  } catch  {
    return of(false);
  }
}

function clearLocalStorage(): Observable<boolean> {
  try {
    localStorage.clear();
    return of(true);
  } catch {
    return of(false);
  }
}

function removeFromLocalStorage(key: string): Observable<boolean> {
  try {
    const previousValue = localStorage.getItem(key);
    if (previousValue) {
      localStorage.removeItem(key);
    }

    return of(!localStorage.getItem(key));
  } catch  {
    return of(false);
  }
}

function clearSessionStorage(): Observable<boolean> {
  try {
    sessionStorage.clear();
    return of(true);
  } catch {
    return of(false);
  }
}

function removeFromSessionStorage(key: string): Observable<boolean> {
  try {
    const previousValue = sessionStorage.getItem(key);
    if (previousValue) {
      sessionStorage.removeItem(key);
    }

    return of(!sessionStorage.getItem(key));
  } catch {
    return of(false);
  }
}

class ReactiveStorageService {
  public static get(key: string, storage: StorageModel = 'session'): any {
    let value;
    if (storage === storageType.session) {
      value = getFromSessionStorage(key);
    } else {
      value = getFromLocalStorage(key);
    }

    if (value) {
      return of(jsonToObj(value));
    }

    return of(undefined);
  }

  public static set(key: string, value: any, storage: StorageModel = 'session'): Observable<boolean> {
    const convertedValue = objToJson(value);
    if (storage === storageType.session) {
      return setOnSessionStorage(key, convertedValue);
    } else {
      return setOnLocalStorage(key, convertedValue);
    }
  }

  public static remove(key: string, storage: StorageModel = 'session'): Observable<boolean> {
    if (storage === storageType.session) {
      return removeFromSessionStorage(key);
    } else {
      return removeFromLocalStorage(key);
    }
  }

  public static clear(storage: 'session' | 'local' | 'all'): Observable<boolean> {
    if (storage === storageType.session) {
      return clearSessionStorage();
    }

    if (storage === storageType.local) {
      return clearLocalStorage();
    }
    return clearSessionStorage() && clearLocalStorage();
  }
}

export default ReactiveStorageService