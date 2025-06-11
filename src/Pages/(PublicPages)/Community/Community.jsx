import { useState } from "react";
import {
  FaPlus,
  FaCommentAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaTimes,
} from "react-icons/fa";
import Forums_Background from "../../../assets/Forums-Background/Forums-Background.jfif";

const mockPosts = Array.from({ length: 12 }).map((_, i) => ({
  id: `p${i + 1}`,
  author: ["JohnDoe", "FitnessQueen", "MuscleMax", "HealthGuru"][i % 4],
  authorImg: `https://i.pravatar.cc/150?img=${i + 1}`,
  role: ["Member", "Trainer", "Coach", "Enthusiast"][i % 4],
  title: [
    "How do you stay consistent with your workout routine?",
    "Quick high-protein meal prep ideas?",
    "Best stretches post workout?",
    "Tips for running your first 5K?",
  ][i % 4],
  content:
    "Let’s share tips, experiences and encouragement! Feel free to post questions or your own strategies here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.",
  likes: Math.floor(Math.random() * 50),
  dislikes: Math.floor(Math.random() * 10),
  comments: Math.floor(Math.random() * 20),
  date: `2025-06-${(i % 30) + 1}`,
  allComments: Array.from({ length: (i % 5) + 1 }).map((_, j) => {
    const commenters = [
      {
        user: "Alice",
        userImg: "https://i.pravatar.cc/150?img=11",
        role: "Member",
        comments: [
          "Loved this insight!",
          "Thanks for sharing!",
          "This really helped me!",
          "I’ve been struggling with this too.",
          "What a helpful thread.",
        ],
      },
      {
        user: "Bob",
        userImg: "https://i.pravatar.cc/150?img=12",
        role: "Trainer",
        comments: [
          "Good tips, I’ll try them.",
          "Form matters more than speed.",
          "Recovery is crucial.",
          "Start light, stay consistent.",
          "This advice tracks well.",
        ],
      },
      {
        user: "Charlie",
        userImg: "https://i.pravatar.cc/150?img=13",
        role: "Coach",
        comments: [
          "Nutrition matters too.",
          "Mindset is everything.",
          "Warm-ups are underrated.",
          "Don't skip cooldowns!",
          "Consistency over perfection.",
        ],
      },
    ];

    const commenter = commenters[j % commenters.length];

    return {
      user: commenter.user,
      userImg: commenter.userImg,
      role: commenter.role,
      time: `2025-06-${(j % 30) + 1} 12:${10 + j} PM`,
      text: commenter.comments[j % commenter.comments.length],
    };
  }),
}));

const Community = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  console.log(selectedPost);

  return (
    <div
      className="bg-fixed bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${Forums_Background})` }}
    >
      {/* Header */}
      <h3 className="bg-gradient-to-bl from-[#F72C5B] to-[#c199a2] text-white text-center text-4xl font-extrabold py-8 shadow-lg">
        Community Corner
      </h3>

      {/* Content */}
      <div className="bg-gradient-to-b from-gray-100/50 to-gray-300/50 py-8 px-6 lg:px-16">
        {/* Add Post CTA */}
        <div className="flex justify-end mb-6">
          <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition">
            <FaPlus /> Add New Post
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockPosts.map((post) => {
            const isLong = post.content.length > 100;
            const preview = isLong
              ? post.content.slice(0, 300) + "..."
              : post.content;

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-4">
                    <img
                      src={post.authorImg}
                      alt={post.author}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {post.author}
                      </h4>
                      <p className="text-sm text-gray-500">{post.role}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{post.date}</span>
                </div>

                {/* Title & Content */}
                <div className="p-6 flex-1">
                  <h5 className="text-2xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h5>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {preview}{" "}
                    {isLong && (
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Show more
                      </button>
                    )}
                  </p>

                  {/* Interaction */}
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 hover:text-green-600 transition">
                        <FaThumbsUp /> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 hover:text-red-600 transition">
                        <FaThumbsDown /> {post.dislikes}
                      </button>
                      <button
                        className="flex items-center gap-2 hover:text-blue-600 transition"
                        onClick={() => {
                          setSelectedPost(post);
                          document
                            .getElementById("Post_Details_Modal")
                            .showModal();
                        }}
                      >
                        <FaCommentAlt /> {post.comments}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments Modal */}

      <dialog id="Post_Details_Modal" className="modal">
        <div className="modal-box min-w-3xl p-0 bg-linear-to-b from-white to-gray-300 text-black">
          {/* Close Button */}
          <button
            onClick={() =>
              document.getElementById("Post_Details_Modal").close()
            }
            className="absolute top-2 right-2 text-white bg-red-400 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-50 cursor-pointer "
          >
            <FaTimes className="text-sm" />
          </button>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-4">
              <img
                src={selectedPost?.authorImg}
                alt={selectedPost?.author}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {selectedPost?.author}
                </h4>
                <p className="text-sm text-gray-500">{selectedPost?.role}</p>
              </div>
            </div>
            <span className="text-sm text-gray-400">{selectedPost?.date}</span>
          </div>

          {/* Title & Content */}
          <div className="p-6 flex-1">
            <h5 className="text-2xl font-bold text-gray-900 mb-3">
              {selectedPost?.title}
            </h5>
            <p className="text-gray-700 leading-relaxed mb-4">
              {selectedPost?.content}
            </p>

            {/* Interaction */}
            <div className="flex items-center justify-between text-gray-600">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 hover:text-green-600 transition">
                  <FaThumbsUp /> {selectedPost?.likes}
                </button>
                <button className="flex items-center gap-2 hover:text-red-600 transition">
                  <FaThumbsDown /> {selectedPost?.dislikes}
                </button>
              </div>
            </div>
          </div>

          {/* All Comments */}
          <div className="bg-white pb-5">
            {/* Header */}
            <h3 className="text-lg font-bold p-2">
              Comments : <span className="font-thin">( 5 )</span>
            </h3>

            {/* Comments */}
            <div className="pl-12 pr-5 hover:bg-gray-100 cursor-default">
              {/* Header */}
              <div className="flex justify-between border-b py-2">
                <div className="flex items-center gap-4">
                  {/* Commenter Avatar */}
                  <img
                    src={selectedPost?.authorImg}
                    alt={selectedPost?.author}
                    className="w-12 h-12 rounded-full"
                  />
                  {/* Commenter Name & role */}
                  <div>
                    {/* Name */}
                    <h4 className="text-lg font-semibold text-gray-800">
                      {selectedPost?.author}
                    </h4>

                    {/* Role */}
                    <p className="text-sm text-gray-500">
                      {selectedPost?.role}
                    </p>
                  </div>
                </div>

                {/* Comment Date */}
                <span className="text-sm text-gray-400">
                  {selectedPost?.date}
                </span>
              </div>

              {/* Comment */}
              <p className="px-14 py-2">{selectedPost?.content}</p>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Community;
