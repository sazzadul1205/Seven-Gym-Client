import { Navigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

// Hooks
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Components
import Loading from "../Shared/Loading/Loading";
import FetchingError from "../Shared/Component/FetchingError";

const AdminPrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  const {
    data: UserRoleData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["UserRoleData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/UserRole?email=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Show loading screen while auth or role data is loading
  if (loading || isLoading) return <Loading />;

  // Show error if role query failed
  if (error) return <FetchingError />;

  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/Login" state={{ from: location }} replace />;

  // Redirect if not an admin
  if (UserRoleData?.role !== "Admin")
    return <Navigate to="/Unauthorized" replace />;

  // Access granted
  return children;
};

// Prop types
AdminPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminPrivateRoute;
