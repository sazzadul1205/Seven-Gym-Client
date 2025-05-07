import PropTypes from "prop-types";

// Import Components
import BookedTrainerBasicInfo from "../../../../Shared/Component/BookedTrainerBasicInfo";

const UserTrainerAnnouncement = ({ TrainerAnnouncementData }) => {
  const announcements = Array.isArray(TrainerAnnouncementData)
    ? TrainerAnnouncementData
    : TrainerAnnouncementData
    ? [TrainerAnnouncementData]
    : [];

  return (
    <div className="px-1">
      {/* Header */}
      <div className="text-center py-4">
        <h3 className="text-xl sm:text-2xl font-semibold">
          Trainer Announcement
        </h3>
      </div>

      <hr className="p-[1px] bg-gray-800 my-3" />

      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <div
            className="bg-white border-4 border-gray-600 rounded-2xl shadow-md p-4 sm:p-6 text-black mb-6"
            key={announcement._id}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <BookedTrainerBasicInfo
                trainerID={announcement.trainerID}
                showName={false}
              />
              <h4 className="text-lg sm:text-xl font-semibold">
                Announcement Title: {announcement.title}
              </h4>
            </div>

            <hr className="bg-gray-800 my-4 p-[1px]" />

            <div
              className="prose max-w-full mb-4 text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />

            <hr className="bg-gray-800 my-4 p-[1px]" />

            <div className="flex flex-col sm:flex-row justify-between text-sm sm:text-base mt-2">
              <p>Date: {announcement.date}</p>
              <p>Time: {announcement.time}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white border-4 border-gray-600 rounded-2xl shadow-md p-6 text-black text-center mb-6">
          No announcements available.
        </div>
      )}
    </div>
  );
};

// PropTypes
UserTrainerAnnouncement.propTypes = {
  TrainerAnnouncementData: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        trainerID: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
      })
    ),
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      trainerID: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    }),
  ]),
};

export default UserTrainerAnnouncement;
