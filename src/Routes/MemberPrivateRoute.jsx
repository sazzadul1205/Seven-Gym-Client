import { Navigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

// Import custom hooks
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Import loading and error components
import Loading from "../Shared/Loading/Loading";
import FetchingError from "../Shared/Component/FetchingError";

const MemberPrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  // 🔄 Fetch user role data based on email
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
    enabled: !!user?.email, // ✅ Only run query when email is available
  });

  // ⏳ Show loading screen while auth or query is loading
  if (loading || UserRoleDataIsLoading) {
    return <Loading />;
  }

  // 🔒 Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  // ❌ Show error screen if query fails
  if (UserRoleDataError) {
    return <FetchingError />;
  }

  // 🚫 If user is banned, redirect to Banned page
  if (UserRoleData?.ban) {
    return <Navigate to={`/Banned/${user?.email}`} replace />;
  }

  // ❌ If user does not have 'Member' role, redirect to Unauthorized page
  if (UserRoleData.role !== "Member") {
    return <Navigate to="/Unauthorized" replace />;
  }

  // ✅ User is authenticated, not banned, and has 'Member' role
  return children;
};

// Prop type validation
MemberPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MemberPrivateRoute;
