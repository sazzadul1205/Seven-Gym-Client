import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://192.168.0.11:5000", 
  // baseURL: "http://localhost:5000",
  // baseURL: "https://master-job-shop-server.vercel.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
