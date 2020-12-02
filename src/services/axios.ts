import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

const _Axios = axios.create({
  baseURL: 'http://localhost:3100/'
});

// export const $get = (url: string, config?: AxiosRequestConfig) => Axios.get(url, config).then(x => x.data);

// export const $post = (url: string, data?: any, config?: AxiosRequestConfig) => Axios.post(url, data, config).then(x => x.data);

export const Axios = {
  ..._Axios,
  $get: (url: string, config?: AxiosRequestConfig) => Axios.get(url, config).then(x => x.data),
  $post: (url: string, data?: any, config?: AxiosRequestConfig) => Axios.post(url, data, config).then(x => x.data)
}