import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useFetchData = (
  queryKey,
  endpoint,
  fallbackValue = [],
  enabled = true
) => {
  const axiosPublic = useAxiosPublic();

  return useQuery({
    queryKey: [queryKey, endpoint], // include endpoint to avoid stale cache
    queryFn: async () => {
      if (!endpoint) return fallbackValue; // bail early if no endpoint
      try {
        const res = await axiosPublic.get(endpoint);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return fallbackValue;
        throw err;
      }
    },
    enabled: enabled && !!endpoint, // only enabled if flag true and endpoint exists
  });
};

export default useFetchData;
