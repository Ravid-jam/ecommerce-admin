import { Store } from "pullstate";
interface IStoreValue {
  isLogin: boolean;
  userData: any;
  isSuccess: boolean;
  isLoading: boolean;
  successMessage: string;
  isModelOpen: boolean;
  isErrorMessage: boolean;
}
const StoreValue: IStoreValue = {
  isLogin: false,
  isSuccess: false,
  isLoading: false,
  successMessage: "",
  isModelOpen: false,
  userData: "",
  isErrorMessage: false,
};
export const store = new Store(StoreValue);

export function setSuccess(data: boolean) {
  return store.update((s) => {
    s.isSuccess = data;
  });
}
export function setSuccessMessage(data: string) {
  return store.update((s) => {
    s.successMessage = data;
  });
}
export function setIsErrorMessage(data: boolean) {
  return store.update((s) => {
    s.isErrorMessage = data;
  });
}

export function setIsModel(data: boolean) {
  return store.update((s) => {
    s.isModelOpen = data;
  });
}

export function setIsLoading(data: boolean) {
  return store.update((s) => {
    s.isLoading = data;
  });
}
export function setIsLogin(data: boolean) {
  return store.update((s) => {
    s.isLogin = data;
  });
}

export function setUserData(data: any) {
  return store.update((s) => {
    s.userData = data;
  });
}
