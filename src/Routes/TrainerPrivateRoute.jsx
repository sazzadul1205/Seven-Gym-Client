import { Navigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

// Auth and Axios hooks
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Shared components
import Loading from "../Shared/Loading/Loading";
import FetchingError from "../Shared/Component/FetchingError";

const TrainerPrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Get current user and loading status
  const location = useLocation(); // For redirecting back after login
  const axiosPublic = useAxiosPublic(); // Axios instance for public API calls

  // Step 1: Fetch user's role based on their email
  const {
    data: UserRoleData,
    isLoading: UserRoleDataIsLoading,
    error: UserRoleDataError,
  } = useQuery({
    queryKey: ["UserRoleData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/UserRole?email=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email, // Only run this query when the user's email is available
  });

  // Step 2: If the role is Trainer, check if they're banned
  const {
    data: TrainerData,
    isLoading: TrainerDataIsLoading,
    error: TrainerDataError,
  } = useQuery({
    queryKey: ["TrainerBanData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Trainers?email=${user.email}`).then((res) => res.data),
    enabled: !!user?.email && UserRoleData?.role === "Trainer", // Only run when user is a Trainer
  });

  // Show loading state if auth or any relevant data is still loading
  if (
    loading ||
    UserRoleDataIsLoading ||
    (UserRoleData?.role === "Trainer" && TrainerDataIsLoading)
  ) {
    return <Loading />;
  }

  // If not authenticated, redirect to login and preserve current location
  if (!user) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  // If any query fails, show fetching error component
  if (UserRoleDataError || TrainerDataError) {
    return <FetchingError />;
  }

  // If user is not a Trainer, redirect to Unauthorized page
  if (UserRoleData.role !== "Trainer") {
    return <Navigate to="/Unauthorized" replace />;
  }

  // Fix: TrainerData is an array, check the first item for ban
  if (TrainerData?.[0]?.ban) {
    return <Navigate to={`/Banned/${user.email}`} replace />;
  }

  // All checks passed, render protected child component
  return children;
};

// Validate prop types
TrainerPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TrainerPrivateRoute;
