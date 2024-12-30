class HttpService {
  static async get(url: any, token: any) {
    let headers: any = {};
    let Authorization: any = "";
    if (token) headers.Authorization = token;
    let intermidateRes = await fetch(url, {
      headers,
    });
    let result = await intermidateRes.json();
    if (!result.status) {
      throw new Error(result.message);
    }
    return result;
  }

  static async post(url: string, data: any, token?: any) {
    let headers: any = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = token;
    let intermidateRes = await fetch(url, {
      headers,
      body: JSON.stringify(data),
      method: "POST",
    });
    let result = await intermidateRes.json();
    if (!result.status) {
      throw new Error(result.message);
    }
    return result;
  }
  static async put(url: any, data: any, token: any) {
    let headers: any = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = token;
    let intermidateRes = await fetch(url, {
      headers,
      body: JSON.stringify(data),
      method: "PUT",
    });
    let result = await intermidateRes.json();
    if (!result.status) {
      throw new Error(result.message);
    }
    return result;
  }
}

export default HttpService;
