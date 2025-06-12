import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

export const useUserOrTrainerData = (email) => {
  const axiosPublic = useAxiosPublic();
  // Step 1: Get user basic data by email
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["UserData", email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/BasicProfile?email=${email}`)
        .then((res) => res.data),
    enabled: !!email,
  });

  // Step 2: If role is Trainer, fetch Trainer Basic Info
  const {
    data: trainerData,
    isLoading: trainerLoading,
    error: trainerError,
  } = useQuery({
    queryKey: ["TrainerData", email],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/BasicInfo?email=${email}`)
        .then((res) => res.data),
    enabled: !!userData?.role && userData?.role === "Trainer",
  });

  const isLoading =
    userLoading || (userData?.role === "Trainer" && trainerLoading);
  const error = userError || trainerError;
  const finalData = userData?.role === "Trainer" ? trainerData : userData;

  return { data: finalData, isLoading, error, role: userData?.role };
};
