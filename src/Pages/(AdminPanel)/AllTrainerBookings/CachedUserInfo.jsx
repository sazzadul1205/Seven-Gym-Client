import { useEffect } from "react";
import PropTypes from "prop-types";

const CachedUserInfo = ({ user, email, setUserInfoCache, userInfoCache }) => {
  useEffect(() => {
    if (!userInfoCache[email]) {
      setUserInfoCache((prev) => ({
        ...prev,
        [email]: user,
      }));
    }
  }, [email, user, userInfoCache, setUserInfoCache]);

  return (
    <div className="flex items-center gap-2">
      <div className="border-r-2 pr-2 border-black">
        <img
          src={user.profileImage}
          alt={user.fullName}
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>
      <div>
        <span className="font-medium block leading-tight">{user.fullName}</span>
        <span className="text-xs ">{user.email}</span>
      </div>
    </div>
  );
};

CachedUserInfo.propTypes = {
  user: PropTypes.shape({
    profileImage: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  email: PropTypes.string.isRequired,
  setUserInfoCache: PropTypes.func.isRequired,
  userInfoCache: PropTypes.object.isRequired,
};

export default CachedUserInfo;
