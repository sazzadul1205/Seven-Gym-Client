const promotions = [
  {
    id: 1,
    title: "Free Trial Classes",
    description:
      "Try out our gym for free! Get a feel for the equipment, classes, and facilities. Limited time offer! Enjoy 1 week of free access to all our gym facilities including group classes and personal training sessions.",
    imageUrl: "https://via.placeholder.com/500x300",
    link: "/free-trial",
    promoDuration: "Available till January 31st, 2025",
    offerDetails:
      "No commitment required. Sign up online to claim your free trial.",
    discountPercentage: 0, // No discount, free offer
  },
  {
    id: 2,
    title: "Discounts on Memberships",
    description:
      "Sign up now and enjoy amazing discounts on all membership plans. Get up to 25% off on our 12-month memberships. Don't miss this exclusive offer to lock in a lower rate for a full year of fitness!",
    imageUrl: "https://via.placeholder.com/500x300",
    link: "/membership-discounts",
    promoDuration: "Offer valid till December 31st, 2024",
    offerDetails:
      "Discounts applied automatically during checkout. No code needed. Discounts increase with longer plans.",
    discountPercentage: 25, // Discount value
  },
  {
    id: 3,
    title: "Seasonal Offers",
    description:
      "Take advantage of our seasonal offers with special rates and packages. Whether you're looking for a membership or group classes, we have exciting deals to match your fitness goals.",
    imageUrl: "https://via.placeholder.com/500x300",
    link: "/seasonal-offers",
    promoDuration: "Valid until March 31st, 2025",
    offerDetails:
      "Seasonal packages include discounts on personal training, group classes, and more. Limited availability.",
    discountPercentage: 15, // Discount value
  },
  {
    id: 4,
    title: "Bring a Friend, Get Rewards",
    description:
      "Refer a friend to join the gym and receive up to 1 month of free membership for every successful sign-up. Plus, your friend will get a special discount on their first month!",
    imageUrl: "https://via.placeholder.com/500x300",
    link: "/refer-a-friend",
    promoDuration: "Ongoing",
    offerDetails:
      "Both you and your friend will enjoy free membership for 1 month after their sign-up. No limits on the number of friends you refer.",
    discountPercentage: 0, // Free month for referral
  },
  {
    id: 5,
    title: "Holiday Special Package",
    description:
      "Celebrate the holiday season with our exclusive holiday special membership package. Enjoy full access to all gym facilities, unlimited group classes, and a free personal training session.",
    imageUrl: "https://via.placeholder.com/500x300",
    link: "/holiday-package",
    promoDuration: "Available until December 25th, 2024",
    offerDetails:
      "Special rates for both 3-month and 6-month memberships. Includes a free consultation with our personal trainers.",
    discountPercentage: 20, // Holiday discount
  },
  {
    id: 6,
    title: "Early Bird Sign-Up Discount",
    description:
      "Be an early bird and enjoy 30% off your first month when you sign up for any membership before 10 AM! This offer is valid for a limited time only.",
    imageUrl: "https://via.placeholder.com/500x300",
    link: "/early-bird-signup",
    promoDuration: "Offer valid until further notice, 10 AM cutoff",
    offerDetails:
      "Offer is valid for new members only. Limited to the first 100 sign-ups each month.",
    discountPercentage: 30, // Early bird discount
  },
];

const PromotionsSection = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Promotions & Offers
        </h2>
        <div className="bg-white p-[1px] w-1/3 mx-auto"></div>

        {/* Promotions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-11 text-left">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="w-full h-56 object-cover"
              />
              <div className="flex-1 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {promo.title}
                </h3>
                <p className="text-gray-600 mb-6">{promo.description}</p>
              </div>
              <div className="p-6">
                <a
                  href={promo.link}
                  className="inline-block px-10 py-3 font-semibold text-white bg-[#F72C5B] hover:bg-white hover:text-[#F72C5B] border border-[#F72C5B] rounded-lg transition duration-300 transform hover:scale-105 w-full text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionsSection;
