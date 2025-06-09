import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useFetchData = (queryKey, endpoint, fallbackValue = []) => {
  const axiosPublic = useAxiosPublic();

  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(endpoint);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return fallbackValue;
        throw err;
      }
    },
  });
};

export default useFetchData;
