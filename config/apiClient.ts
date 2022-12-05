import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
});

axiosClient.interceptors.response.use(
  function (response) {
    // if (typeof window !== 'undefined') {
    //   try {
    //     // localStorage.setItem('permissions', response.headers['x-user-permissions']);
    //     // localStorage.setItem('role', response.headers['x-user-role']);
    //     console.log("ok")
    //   } catch (error) {
    //     console.log('undefined');
    //   }
    // }
    return response;
    
  }, 
  function (error) {
    // let res = error;
    // if (res.status == 401) {
    //   window.location.href = “https://example.com/login”;
    // }
    // console.error("Looks like there was a problem. Status Code: " + res.status);
    // console.log("error res", res);
    return Promise.reject(error);
  }
);

export { 
    axiosClient 
};