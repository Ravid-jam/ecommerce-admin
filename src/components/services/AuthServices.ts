class AuthServices {
  static setToken(token: string) {
    localStorage.setItem("token", token);
  }
  static getToken() {
    return localStorage.getItem("token");
  }

  static setUserInfo(info: any) {
    localStorage.setItem("info", JSON.stringify(info));
  }
  static getUserInfo() {
    let detail: any = localStorage.getItem("info");
    return JSON.parse(detail);
  }

  static getUser() {
    let detail: any = sessionStorage.getItem("userInfo");
    return JSON?.parse(detail);
  }

  static clearLoginData() {
    localStorage.removeItem("token");
  }
  static setUser(info: any) {
    sessionStorage.setItem("userInfo", JSON.stringify(info));
  }
}
export default AuthServices;
