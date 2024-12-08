const menuItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/Gallery" },
    {
      name: "Trainers",
      path: "/Trainers",
      submenu: [
        { name: "Personal Trainers", path: "/Trainers/Personal" },
        { name: "Group Trainers", path: "/Trainers/Group" },
        { name: "Trainer Profiles", path: "/Trainers/Profiles" },
      ],
    },
    {
      name: "Classes",
      path: "/Classes",
      submenu: [
        { name: "Yoga", path: "/Classes/Yoga" },
        { name: "Pilates", path: "/Classes/Pilates" },
        { name: "Strength Training", path: "/Classes/Strength" },
        { name: "Cardio", path: "/Classes/Cardio" },
        { name: "Special Classes", path: "/Classes/Special" },
      ],
    },
    { name: "Forums", path: "/Forums" },
    { name: "Blogs", path: "/Blogs" },
    {
      name: "About Us",
      path: "/About",
      submenu: [
        { name: "Our Mission", path: "/About/Mission" },
        { name: "Testimonials", path: "/About/Testimonials" },
        { name: "Careers", path: "/About/Careers" },
      ],
    },
  ];