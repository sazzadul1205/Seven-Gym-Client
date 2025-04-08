import { Navigate, useLocation } from "react-router";

// Import Query
import { useQuery } from "@tanstack/react-query";

// import Validation
import PropTypes from "prop-types";

// Import Hooks
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Import Loading and Error
import Loading from "../Shared/Loading/Loading";
import FetchingError from "../Shared/Component/FetchingError";

const MemberPrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const axiosPublic = useAxiosPublic();

  // Only run query when user and email are available
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
    enabled: !!user?.email, // ✅ important: only fetch when email is ready
  });

  if (loading || UserRoleDataIsLoading) {
    return <Loading />;
  }

  if (!user) {
    // User is not authenticated
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (UserRoleDataError) {
    <FetchingError />;
  }

  if (UserRoleData.role !== "Member") {
    // User does not have the 'Member' role
    return <Navigate to="/Unauthorized" replace />;
  }

  // User is authenticated and has the 'Member' role
  return children;
};

// Prop Type Validation
MemberPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MemberPrivateRoute;
