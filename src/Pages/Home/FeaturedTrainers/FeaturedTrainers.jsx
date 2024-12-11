import Title from "../../../Shared/Componenet/Title";

const trainersData = [
  {
    name: "Emily Clark",
    specialization: "Yoga Instructor",
    imageUrl: "https://i.ibb.co/JtGwF7m/User2.jpg",
    tier: "Bronze",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    contact: {
      phone: "+1 987 654 321",
      email: "emilyclark@example.com",
      website: "https://emilyclark-yoga.com",
    },
    bio: "Emily Clark is a certified yoga instructor with over 7 years of experience in guiding individuals through mindful yoga practices. She specializes in Hatha and Vinyasa yoga, aiming to help clients improve flexibility, strength, and mental clarity.",
    certifications: [
      "Certified Yoga Instructor (RYT-200)",
      "Yoga for Mental Health Certification",
    ],
    fees: {
      perSession: 40,
      monthlyPackage: 350,
    },
    socialLinks: {
      instagram: "https://instagram.com/emilyclark_yoga",
      facebook: "https://facebook.com/emilyclark.yoga",
      linkedin: "https://linkedin.com/in/emily-clark-yoga",
    },
    testimonials: [
      {
        clientName: "Sophia Martinez",
        testimonial:
          "Emily's yoga classes have helped me reduce stress and become more flexible. Highly recommend!",
        rating: 5,
      },
      {
        clientName: "Liam Johnson",
        testimonial:
          "I’ve been attending Emily's classes for months, and my posture has improved dramatically.",
        rating: 5,
      },
    ],
    workingHours: {
      Tuesday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
        {
          timeSlot: "2:00 PM - 3:00 PM",
          booking: null,
        },
      ],
      Thursday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
        {
          timeSlot: "2:00 PM - 3:00 PM",
          booking: null,
        },
      ],
      Saturday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
        {
          timeSlot: "2:00 PM - 3:00 PM",
          booking: null,
        },
      ],
    },
  },

  {
    name: "Michael Smith",
    specialization: "Personal Trainer",
    imageUrl: "https://i.ibb.co/Pzg9Tvh/User3.jpg",
    tier: "Silver",
    availableDays: ["Monday", "Wednesday", "Thursday"],
    contact: {
      phone: "+1 321 654 9870",
      email: "michaelsmith@example.com",
      website: "https://michaelsmith-fitness.com",
    },
    bio: "Michael Smith is a highly skilled personal trainer who focuses on functional training and rehabilitation. With over 8 years of experience, he helps individuals recover from injuries while improving their strength and overall fitness.",
    certifications: [
      "Certified Personal Trainer (CPT)",
      "Strength and Conditioning Specialist (CSCS)",
      "CPR & First Aid Certified",
    ],
    fees: {
      perSession: 60,
      monthlyPackage: 500,
    },
    socialLinks: {
      instagram: "https://instagram.com/michaelsmith_fitness",
      facebook: "https://facebook.com/michaelsmith.fitness",
      linkedin: "https://linkedin.com/in/michael-smith-fitness",
    },
    testimonials: [
      {
        clientName: "John Anderson",
        testimonial:
          "Michael’s approach to fitness has helped me recover from my knee injury and get stronger.",
        rating: 5,
      },
      {
        clientName: "Emma Harris",
        testimonial:
          "His workout plans are challenging yet effective. I’ve seen tremendous improvement in my strength.",
        rating: 5,
      },
    ],
    workingHours: {
      Monday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
        {
          timeSlot: "2:00 PM - 3:00 PM",
          booking: null,
        },
      ],
      Wednesday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
        {
          timeSlot: "2:00 PM - 3:00 PM",
          booking: null,
        },
      ],
      Thursday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
        {
          timeSlot: "2:00 PM - 3:00 PM",
          booking: null,
        },
      ],
    },
  },

  {
    name: "Samantha Green",
    specialization: "Nutritionist",
    imageUrl: "https://i.ibb.co/Hzp3Qfm/User4.jpg",
    tier: "Diamond",
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    contact: {
      phone: "+1 234 567 8901",
      email: "samanthagreen@example.com",
      website: "https://samanthagreen-nutrition.com",
    },
    bio: "Samantha Green is a certified nutritionist with over 12 years of experience in personalized diet planning and nutritional counseling. She specializes in helping clients achieve their health goals by providing evidence-based nutritional advice.",
    certifications: [
      "Certified Nutritionist",
      "Master's in Nutrition Science",
      "Certified Health Coach",
    ],
    fees: {
      perSession: 75,
      monthlyPackage: 650,
    },
    socialLinks: {
      instagram: "https://instagram.com/samanthagreen_nutrition",
      facebook: "https://facebook.com/samanthagreen.nutrition",
      linkedin: "https://linkedin.com/in/samantha-green-nutrition",
    },
    testimonials: [
      {
        clientName: "Olivia Davis",
        testimonial:
          "Samantha's personalized nutrition plan has helped me lose 30 pounds and feel better than ever!",
        rating: 5,
      },
      {
        clientName: "Daniel Lee",
        testimonial:
          "I’ve never felt more energized and healthier after following Samantha's expert advice on nutrition.",
        rating: 5,
      },
    ],
    workingHours: {
      Monday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
        {
          timeSlot: "2:00 PM - 3:00 PM",
          booking: null,
        },
      ],
      Tuesday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
        {
          timeSlot: "2:00 PM - 3:00 PM",
          booking: null,
        },
      ],
      Thursday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
        {
          timeSlot: "2:00 PM - 3:00 PM",
          booking: null,
        },
      ],
      Friday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
        {
          timeSlot: "2:00 PM - 3:00 PM",
          booking: null,
        },
      ],
    },
  },

  {
    name: "David Roberts",
    specialization: "Strength Training Coach",
    imageUrl: "https://i.ibb.co/6mRhLZs/User5.jpg",
    tier: "Gold",
    availableDays: ["Monday", "Wednesday", "Friday"],
    contact: {
      phone: "+1 453 987 6543",
      email: "davidroberts@example.com",
      website: "https://davidroberts-strengthcoach.com",
    },
    bio: "David Roberts is a strength training coach with over 10 years of experience in helping athletes and fitness enthusiasts increase their muscle mass, strength, and endurance. His approach focuses on progressive overload and proper form.",
    certifications: [
      "Certified Strength and Conditioning Specialist (CSCS)",
      "Certified Personal Trainer (CPT)",
      "Sports Nutrition Certified",
    ],
    fees: {
      perSession: 70,
      monthlyPackage: 600,
    },
    socialLinks: {
      instagram: "https://instagram.com/davidroberts_strength",
      facebook: "https://facebook.com/davidrobertsstrength",
      linkedin: "https://linkedin.com/in/david-roberts-strength-coach",
    },
    testimonials: [
      {
        clientName: "Lucas Walker",
        testimonial:
          "David’s training sessions pushed me beyond my limits, and I’ve seen great results in just a few months.",
        rating: 5,
      },
      {
        clientName: "Emma Green",
        testimonial:
          "I’ve been training with David for over a year, and my strength has increased significantly. Highly recommend!",
        rating: 5,
      },
    ],
    workingHours: {
      Monday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
      ],
      Wednesday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
      ],
      Friday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
      ],
    },
  },

  {
    name: "Sarah Johnson",
    specialization: "Pilates Instructor",
    imageUrl: "https://i.ibb.co/8DGRN4S/User6.jpg",
    tier: "Platinum",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    contact: {
      phone: "+1 478 239 0000",
      email: "sarahjohnson@example.com",
      website: "https://sarahjohnson-pilates.com",
    },
    bio: "Sarah Johnson is an experienced Pilates instructor who emphasizes improving core strength, flexibility, and posture. With over 6 years of teaching experience, she works with clients of all levels, offering both group and one-on-one sessions.",
    certifications: [
      "Certified Pilates Instructor (PMI)",
      "Pre/Postnatal Pilates Specialist",
      "CPR & First Aid Certified",
    ],
    fees: {
      perSession: 55,
      monthlyPackage: 450,
    },
    socialLinks: {
      instagram: "https://instagram.com/sarahjohnson_pilates",
      facebook: "https://facebook.com/sarahjohnsonpilates",
      linkedin: "https://linkedin.com/in/sarah-johnson-pilates",
    },
    testimonials: [
      {
        clientName: "Chloe Thompson",
        testimonial:
          "Sarah’s Pilates classes have been life-changing! My back pain has reduced significantly.",
        rating: 5,
      },
      {
        clientName: "Isabella Roberts",
        testimonial:
          "I never realized how important core strength was until I started Pilates with Sarah. I feel stronger every day.",
        rating: 5,
      },
    ],
    workingHours: {
      Tuesday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
      ],
      Thursday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
      ],
      Saturday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
      ],
    },
  },

  {
    name: "James Taylor",
    specialization: "Cardio Coach",
    imageUrl: "https://i.ibb.co/hW0p23k/User7.jpg",
    tier: "Silver",
    availableDays: ["Monday", "Wednesday", "Friday"],
    contact: {
      phone: "+1 542 123 4567",
      email: "jamestaylor@example.com",
      website: "https://jamestaylor-cardio.com",
    },
    bio: "James Taylor is a seasoned cardio coach specializing in endurance training, interval training, and weight loss programs. With over 5 years of experience, James tailors workouts to fit the needs of each client, helping them achieve their fitness goals.",
    certifications: [
      "Certified Cardio Coach",
      "Certified Personal Trainer",
      "Fitness Nutrition Specialist",
    ],
    fees: {
      perSession: 50,
      monthlyPackage: 400,
    },
    socialLinks: {
      instagram: "https://instagram.com/jamestaylor_cardio",
      facebook: "https://facebook.com/jamestaylorcardio",
      linkedin: "https://linkedin.com/in/james-taylor-cardio-coach",
    },
    testimonials: [
      {
        clientName: "Ryan Clark",
        testimonial:
          "James helped me prepare for my first half-marathon, and I felt amazing during the race!",
        rating: 5,
      },
      {
        clientName: "Emily Stone",
        testimonial:
          "His interval training workouts are intense but incredibly effective. I’ve lost 20 pounds in two months!",
        rating: 5,
      },
    ],
    workingHours: {
      Monday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
      ],
      Wednesday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
      ],
      Friday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
        {
          timeSlot: "1:00 PM - 2:00 PM",
          booking: null,
        },
      ],
    },
  },

  {
    name: "Olivia Martinez",
    specialization: "Yoga Instructor",
    imageUrl: "https://i.ibb.co/xfjgpY9/User8.jpg",
    tier: "Gold",
    availableDays: ["Monday", "Thursday", "Saturday"],
    contact: {
      phone: "+1 348 876 5432",
      email: "oliviamartinez@example.com",
      website: "https://oliviamartinez-yoga.com",
    },
    bio: "Olivia Martinez is a passionate yoga instructor with over 8 years of experience in helping people achieve balance, flexibility, and mindfulness. She offers a range of yoga styles including Vinyasa, Hatha, and Restorative Yoga.",
    certifications: [
      "Certified Yoga Instructor (RYT-500)",
      "Pre/Postnatal Yoga Specialist",
      "Mindfulness Meditation Certified",
    ],
    fees: {
      perSession: 60,
      monthlyPackage: 500,
    },
    socialLinks: {
      instagram: "https://instagram.com/oliviamartinez_yoga",
      facebook: "https://facebook.com/oliviamartinezyoga",
      linkedin: "https://linkedin.com/in/olivia-martinez-yoga",
    },
    testimonials: [
      {
        clientName: "Sophia Turner",
        testimonial:
          "Olivia’s classes have helped me find inner peace. Her guidance through each posture and breath is exactly what I needed.",
        rating: 5,
      },
      {
        clientName: "Ava Wilson",
        testimonial:
          "The combination of yoga and mindfulness has completely transformed my life. Olivia is an amazing teacher!",
        rating: 5,
      },
    ],
    workingHours: {
      Monday: [
        {
          timeSlot: "8:00 AM - 9:00 AM",
          booking: null,
        },
        {
          timeSlot: "9:30 AM - 10:30 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:30 PM - 1:30 PM",
          booking: null,
        },
      ],
      Thursday: [
        {
          timeSlot: "8:00 AM - 9:00 AM",
          booking: null,
        },
        {
          timeSlot: "9:30 AM - 10:30 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:30 PM - 1:30 PM",
          booking: null,
        },
      ],
      Saturday: [
        {
          timeSlot: "8:00 AM - 9:00 AM",
          booking: null,
        },
        {
          timeSlot: "9:30 AM - 10:30 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
      ],
    },
  },

  {
    name: "William Harris",
    specialization: "Bodybuilding Coach",
    imageUrl: "https://i.ibb.co/DKsftXZ/User9.jpg",
    tier: "Platinum",
    availableDays: ["Tuesday", "Friday", "Sunday"],
    contact: {
      phone: "+1 617 234 7654",
      email: "williamharris@example.com",
      website: "https://williamharris-bodybuilding.com",
    },
    bio: "William Harris is a bodybuilding coach with over 12 years of experience in training athletes and fitness enthusiasts to build muscle and improve physique. He specializes in hypertrophy training, strength building, and competition prep.",
    certifications: [
      "Certified Bodybuilding Coach",
      "Certified Personal Trainer",
      "Nutrition Specialist",
    ],
    fees: {
      perSession: 80,
      monthlyPackage: 700,
    },
    socialLinks: {
      instagram: "https://instagram.com/williamharris_bodybuilding",
      facebook: "https://facebook.com/williamharrisbodybuilding",
      linkedin: "https://linkedin.com/in/william-harris-bodybuilding",
    },
    testimonials: [
      {
        clientName: "David Carter",
        testimonial:
          "William’s training programs are intense and effective. I’ve gained muscle and strength at a level I never thought possible.",
        rating: 5,
      },
      {
        clientName: "Liam Foster",
        testimonial:
          "He’s the best coach I’ve worked with, pushing me to my limits while maintaining a focus on form and safety.",
        rating: 5,
      },
    ],
    workingHours: {
      Tuesday: [
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
      ],
      Friday: [
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
      ],
      Sunday: [
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
        {
          timeSlot: "12:00 PM - 1:00 PM",
          booking: null,
        },
      ],
    },
  },

  {
    name: "Ethan Lee",
    specialization: "Nutrition Specialist",
    imageUrl: "https://i.ibb.co/k58TgVf/User10.jpg",
    tier: "Silver",
    availableDays: ["Monday", "Wednesday", "Friday"],
    contact: {
      phone: "+1 232 874 9023",
      email: "ethanlee@example.com",
      website: "https://ethanlee-nutrition.com",
    },
    bio: "Ethan Lee is a certified nutrition specialist dedicated to helping individuals achieve their fitness goals through proper nutrition. He specializes in meal planning, weight management, and sports nutrition.",
    certifications: [
      "Certified Nutrition Specialist (CNS)",
      "Sports Nutrition Specialist",
      "Certified Personal Trainer",
    ],
    fees: {
      perSession: 50,
      monthlyPackage: 400,
    },
    socialLinks: {
      instagram: "https://instagram.com/ethanlee_nutrition",
      facebook: "https://facebook.com/ethanleenutrition",
      linkedin: "https://linkedin.com/in/ethan-lee-nutrition",
    },
    testimonials: [
      {
        clientName: "Megan Young",
        testimonial:
          "Ethan helped me create a personalized meal plan that worked with my fitness goals. I’ve lost 15 pounds and feel amazing.",
        rating: 5,
      },
      {
        clientName: "Charlie Scott",
        testimonial:
          "His advice on pre and post-workout meals has helped me recover faster and perform better in my workouts.",
        rating: 5,
      },
    ],
    workingHours: {
      Monday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
      ],
      Wednesday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
      ],
      Friday: [
        {
          timeSlot: "9:00 AM - 10:00 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
      ],
    },
  },

  {
    name: "Zara Thompson",
    specialization: "Pilates Instructor",
    imageUrl: "https://i.ibb.co/kx4wrdm/User11.jpg",
    tier: "Gold",
    availableDays: ["Monday", "Wednesday", "Friday"],
    contact: {
      phone: "+1 539 876 4321",
      email: "zara.thompson@example.com",
      website: "https://zarathompson-pilates.com",
    },
    bio: "Zara Thompson is an experienced Pilates instructor who helps clients improve posture, flexibility, and strength. She specializes in mat Pilates and reformer training, tailoring her sessions to each individual's fitness level and goals.",
    certifications: [
      "Certified Pilates Instructor",
      "Reformer Pilates Certified",
      "Posture Alignment Specialist",
    ],
    fees: {
      perSession: 70,
      monthlyPackage: 600,
    },
    socialLinks: {
      instagram: "https://instagram.com/zara_pilates",
      facebook: "https://facebook.com/zara.pilates",
      linkedin: "https://linkedin.com/in/zara-thompson-pilates",
    },
    testimonials: [
      {
        clientName: "Emily Brown",
        testimonial:
          "Zara’s Pilates classes helped me strengthen my core and improve my posture. I feel more aligned and energized after every session.",
        rating: 5,
      },
      {
        clientName: "Hannah White",
        testimonial:
          "Her attention to detail in every movement has helped me achieve better flexibility and control over my body.",
        rating: 5,
      },
    ],
    workingHours: {
      Monday: [
        {
          timeSlot: "8:00 AM - 9:00 AM",
          booking: null,
        },
        {
          timeSlot: "9:30 AM - 10:30 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
      ],
      Wednesday: [
        {
          timeSlot: "8:00 AM - 9:00 AM",
          booking: null,
        },
        {
          timeSlot: "9:30 AM - 10:30 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
      ],
      Friday: [
        {
          timeSlot: "8:00 AM - 9:00 AM",
          booking: null,
        },
        {
          timeSlot: "9:30 AM - 10:30 AM",
          booking: null,
        },
        {
          timeSlot: "11:00 AM - 12:00 PM",
          booking: null,
        },
      ],
    },
  },

  {
    name: "Michael Johnson",
    specialization: "Personal Trainer",
    imageUrl: "https://i.ibb.co/Ntq0cfm/User12.jpg",
    tier: "Platinum",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    contact: {
      phone: "+1 670 234 8790",
      email: "michael.johnson@example.com",
      website: "https://michaeljohnson-pt.com",
    },
    bio: "Michael Johnson is a professional personal trainer who specializes in high-intensity interval training (HIIT), functional strength, and endurance training. With over 10 years of experience, he works with clients to achieve their fitness goals, from weight loss to strength building.",
    certifications: [
      "Certified Personal Trainer (CPT)",
      "HIIT Specialist",
      "Strength and Conditioning Coach",
    ],
    fees: {
      perSession: 90,
      monthlyPackage: 750,
    },
    socialLinks: {
      instagram: "https://instagram.com/michaeljohnson_pt",
      facebook: "https://facebook.com/michael.johnson.pt",
      linkedin: "https://linkedin.com/in/michael-johnson-pt",
    },
    testimonials: [
      {
        clientName: "Chris Parker",
        testimonial:
          "Michael’s training pushed me to exceed my limits. His HIIT sessions are tough but extremely rewarding.",
        rating: 5,
      },
      {
        clientName: "Jack Wilson",
        testimonial:
          "I’ve gained muscle and improved my fitness level thanks to Michael’s guidance and expertise.",
        rating: 5,
      },
    ],
    workingHours: {
      Tuesday: [
        {
          timeSlot: "7:00 AM - 8:00 AM",
          booking: null,
        },
        {
          timeSlot: "8:30 AM - 9:30 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
      ],
      Thursday: [
        {
          timeSlot: "7:00 AM - 8:00 AM",
          booking: null,
        },
        {
          timeSlot: "8:30 AM - 9:30 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
      ],
      Saturday: [
        {
          timeSlot: "7:00 AM - 8:00 AM",
          booking: null,
        },
        {
          timeSlot: "8:30 AM - 9:30 AM",
          booking: null,
        },
        {
          timeSlot: "10:00 AM - 11:00 AM",
          booking: null,
        },
      ],
    },
  },

  {

    name: "Sophia Miller",
    specialization: "CrossFit Coach",
    imageUrl: "https://i.ibb.co/DRP5H6X/User13.jpg",
    tier: "Gold",
    availableDays: ["Monday", "Wednesday", "Friday"],
    contact: {
      phone: "+1 324 567 8901",
      email: "sophia.miller@example.com",
      website: "https://sophiamiller-crossfit.com",
    },
    bio: "Sophia Miller is a certified CrossFit coach with a passion for functional fitness and building strong, athletic bodies. She specializes in metabolic conditioning, strength training, and gymnastics. Sophia believes in a holistic approach to fitness, combining strength, endurance, and mobility.",
    certifications: [
      "CrossFit Level 2 Trainer",
      "Certified Strength and Conditioning Coach",
      "Functional Movement Screen Specialist",
    ],
    fees: {
      perSession: 75,
      monthlyPackage: 650,
    },
    socialLinks: {
      instagram: "https://instagram.com/sophia_miller_crossfit",
      facebook: "https://facebook.com/sophia.miller.crossfit",
      linkedin: "https://linkedin.com/in/sophia-miller-crossfit",
    },
    testimonials: [
      {
        clientName: "Luke Harris",
        testimonial:
          "Sophia’s CrossFit classes are intense, challenging, and effective. I’ve never been in better shape than I am now.",
        rating: 5,
      },
      {
        clientName: "Ryan Davis",
        testimonial:
          "Her programming has helped me improve my overall fitness and strength. She’s a great coach!",
        rating: 5,
      },
    ],
    workingHours: {
      Monday: [
        {
          timeSlot: "6:30 AM - 7:30 AM",
          booking: null,
        },
        {
          timeSlot: "8:00 AM - 9:00 AM",
          booking: null,
        },
        {
          timeSlot: "9:30 AM - 10:30 AM",
          booking: null,
        },
      ],
      Wednesday: [
        {
          timeSlot: "6:30 AM - 7:30 AM",
          booking: null,
        },
        {
          timeSlot: "8:00 AM - 9:00 AM",
          booking: null,
        },
        {
          timeSlot: "9:30 AM - 10:30 AM",
          booking: null,
        },
      ],
      Friday: [
        {
          timeSlot: "6:30 AM - 7:30 AM",
          booking: null,
        },
        {
          timeSlot: "8:00 AM - 9:00 AM",
          booking: null,
        },
        {
          timeSlot: "9:30 AM - 10:30 AM",
          booking: null,
        },
      ],
    },
  },
];

const FeaturedTrainers = () => {
  // Function to return tier badge style
  const getTierBadge = (tier) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-500 text-white";
      case "Silver":
        return "bg-gray-400 text-white";
      case "Diamond":
        return "bg-blue-600 text-white";
      case "Platinum":
        return "bg-gray-800 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="py-16 mx-auto max-w-[1200px]">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent={" Our Featured Teachers"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 mt-6 md:mt-11 px-2">
          {trainersData.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col"
            >
              {/* Tier Badge */}
              <span
                className={`absolute opacity-80 top-4 left-4 inline-block px-4 py-2 rounded-full text-sm font-semibold ${getTierBadge(
                  trainer.tier
                )}`}
              >
                {trainer.tier} Tier
              </span>

              <img
                src={trainer.imageUrl}
                alt={trainer.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 text-left flex-1">
                <h3 className="text-2xl font-bold ">{trainer.name}</h3>
                <p className="font-semibold">({trainer.specialization})</p>

                {/* Active Time Works */}
                <div className="mt-4 text-sm">
                  <p>
                    <strong>Active Time: </strong>
                    {trainer.availableFrom} - {trainer.availableUntil}
                  </p>
                  <p>
                    <strong>Available Days: </strong>
                    {trainer.availableDays.join(", ")}
                  </p>
                </div>
              </div>

              {/* Book Teacher Button */}
              <div className="mt-auto mb-1 mx-1">
                <button className="px-6 py-2 font-semibold border-2 border-[#F72C5B] hover:bg-[#F72C5B] text-[#F72C5B] hover:text-white w-full">
                  Book Teacher
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className=" px-12 md:px-24 py-3 font-semibold bg-[#F72C5B] hover:bg-white text-white hover:text-[#F72C5B] items-end gap-5 justify-end mx-auto transform transition-all duration-300 ease-in-out hover:scale-105">
            <span>Find More Teachers</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTrainers;
