// Import Prop Validation
import PropTypes from "prop-types";

// Import Icons
import { ImCross } from "react-icons/im";

// Fetch Trainer Tier Data
import { getTierBadge } from "../../../(TrainerPages)/TrainerProfile/TrainerProfileHeader/TrainerProfileHeader"; // Utility for badge styling

// Reusable info row component (label-value pair)
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm py-0.5">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// Reusable section component for consistent layout styling
const Section = ({ title, children }) => (
  <div className="px-5 py-4 border-t border-gray-300">
    <h3 className="text-center font-semibold text-sm mb-3 text-gray-800 uppercase tracking-wide">
      {title}
    </h3>
    <div className="space-y-1">{children}</div>
  </div>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// Main component to render all trainer details in a modal
const AllTrainerManagementDetails = ({ trainer }) => {
  // Close modal utility
  const closeModal = () => document.getElementById("Trainers_Details")?.close();

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-300 bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-lg text-gray-900">
          Trainer {trainer?.name}&apos;s Details
        </h2>
        <ImCross
          className="hover:text-red-600 cursor-pointer"
          onClick={closeModal}
        />
      </div>

      {/* Trainer Image */}
      <div className="py-5 text-center">
        <img
          src={trainer?.imageUrl}
          alt={trainer?.name}
          className="rounded-full w-32 h-32 mx-auto border-2 border-black object-cover"
        />
      </div>

      {/* Tier Badge */}
      {trainer?.tier && (
        <div className="flex justify-center mb-4">
          <span
            className={`px-6 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-md ring-2 ${getTierBadge(
              trainer.tier
            )}`}
          >
            {trainer.tier} Tier
          </span>
        </div>
      )}

      {/* Profile Section */}
      <Section title="Profile">
        <InfoRow label="Name" value={trainer?.name} />
        <InfoRow label="Gender" value={trainer?.gender} />
        <InfoRow label="Age" value={trainer?.age} />
        <InfoRow label="Specialization" value={trainer?.specialization} />
        <InfoRow label="Experience" value={`${trainer?.experience} Years`} />
        <InfoRow
          label="Languages"
          value={trainer?.languagesSpoken?.join(", ")}
        />
        <InfoRow label="Trainer ID" value={trainer?.trainerIdCode} />
        <InfoRow label="Per Session" value={`$${trainer?.perSession}`} />
        <InfoRow
          label="Monthly Package"
          value={`$${trainer?.monthlyPackage}`}
        />
        <InfoRow
          label="Available Days"
          value={trainer?.availableDays?.join(", ")}
        />
      </Section>

      {/* Contact Section */}
      <Section title="Contact">
        <InfoRow label="Phone" value={trainer?.contact?.phone} />
        <InfoRow label="Email" value={trainer?.contact?.email} />
        <InfoRow label="Website" value={trainer?.contact?.website} />
        <InfoRow label="LinkedIn" value={trainer?.contact?.linkedin} />
        <InfoRow label="Instagram" value={trainer?.contact?.instagram} />
        <InfoRow label="Facebook" value={trainer?.contact?.facebook} />
      </Section>

      {/* Bio Section */}
      {trainer?.bio && (
        <Section title="Bio">
          <p className="text-sm text-gray-700 leading-relaxed">{trainer.bio}</p>
        </Section>
      )}

      {/* Certifications Section */}
      {trainer?.certifications?.length > 0 && (
        <Section title="Certifications">
          <ul className="list-disc list-inside text-sm text-gray-700">
            {trainer.certifications.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Awards Section */}
      {trainer?.awards?.length > 0 && (
        <Section title="Awards">
          <ul className="text-sm text-gray-700 space-y-1">
            {trainer.awards.map((award, i) => (
              <li key={i}>
                🏆 <strong>{award.title}</strong> ({award.year}) –{" "}
                {award.organization}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Testimonials Section */}
      {trainer?.testimonials?.length > 0 && (
        <Section title="Testimonials">
          {trainer.testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded shadow-sm text-sm mb-2"
            >
              <p className="text-gray-800 italic">
                &quot;{t.testimonial}&quot;
              </p>
              <div className="text-right text-xs mt-1 text-gray-600">
                — {t.clientName}, Rating: {t.rating}/5
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Preferences Section */}
      {(trainer?.preferences?.focusAreas?.length ||
        trainer?.preferences?.classTypes?.length) > 0 && (
        <Section title="Preferences">
          {trainer.preferences?.focusAreas?.length > 0 && (
            <InfoRow
              label="Focus Areas"
              value={trainer.preferences.focusAreas.join(", ")}
            />
          )}
          {trainer.preferences?.classTypes?.length > 0 && (
            <InfoRow
              label="Class Types"
              value={trainer.preferences.classTypes.join(", ")}
            />
          )}
        </Section>
      )}

      {/* Additional Services Section */}
      {trainer?.additionalServices?.length > 0 && (
        <Section title="Additional Services">
          <ul className="list-disc list-inside text-sm text-gray-700">
            {trainer.additionalServices.map((service, i) => (
              <li key={i}>{service}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Equipment Section */}
      {trainer?.equipmentUsed?.length > 0 && (
        <Section title="Equipment Used">
          <ul className="list-disc list-inside text-sm text-gray-700">
            {trainer.equipmentUsed.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Partnerships Section */}
      {trainer?.partnerships?.length > 0 && (
        <Section title="Partnerships">
          <ul className="text-sm text-gray-700">
            {trainer.partnerships.map((partner, i) => (
              <li key={i}>
                🤝 <strong>{partner.partnerName}</strong> –{" "}
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {partner.website}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
};

// Define all expected prop types for validation and clarity
AllTrainerManagementDetails.propTypes = {
  trainer: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    tier: PropTypes.string,
    gender: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    specialization: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    languagesSpoken: PropTypes.arrayOf(PropTypes.string),
    trainerIdCode: PropTypes.string,
    perSession: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    monthlyPackage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    availableDays: PropTypes.arrayOf(PropTypes.string),
    contact: PropTypes.shape({
      phone: PropTypes.string,
      email: PropTypes.string,
      website: PropTypes.string,
      linkedin: PropTypes.string,
      instagram: PropTypes.string,
      facebook: PropTypes.string,
    }),
    bio: PropTypes.string,
    certifications: PropTypes.arrayOf(PropTypes.string),
    awards: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        organization: PropTypes.string,
      })
    ),
    testimonials: PropTypes.arrayOf(
      PropTypes.shape({
        clientName: PropTypes.string,
        testimonial: PropTypes.string,
        rating: PropTypes.number,
      })
    ),
    preferences: PropTypes.shape({
      focusAreas: PropTypes.arrayOf(PropTypes.string),
      classTypes: PropTypes.arrayOf(PropTypes.string),
    }),
    additionalServices: PropTypes.arrayOf(PropTypes.string),
    equipmentUsed: PropTypes.arrayOf(PropTypes.string),
    partnerships: PropTypes.arrayOf(
      PropTypes.shape({
        partnerName: PropTypes.string,
        website: PropTypes.string,
      })
    ),
  }),
};

export default AllTrainerManagementDetails;
