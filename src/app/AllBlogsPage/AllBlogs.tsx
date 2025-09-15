"use client";
import React, { useState } from "react";
import NewsLetter from "./NewsLetter";

const blogs = [
  {
    id: 1,
    title: "Lab-Grown Diamonds in India: 2025 Buyer’s Guide",
    date: "01 Sep, 2025",
    image:
      "https://www.candere.com/media/mageplaza/blog/post/Blog---Banner.jpg",
  },
  {
    id: 2,
    title:
      "Why a Solitaire Engagement Ring Is the Perfect Choice for Your Proposal",
    date: "11 Jul, 2025",
    image:
      "https://res2.yourwebsite.life/site/60700cd22f84ad002129b2f1/preview1600_1000",
  },
  {
    id: 3,
    title: "Yellow Gold Diamond Engagement Rings: Top Styles for 2025",
    date: "10 Jul, 2025",
    image:
      "https://themewagon.com/wp-content/uploads/2018/08/Blanca-free-HTML5-personal-website-template.jpg",
  },
  {
    id: 4,
    title: "Where to Buy Promise Rings for Couples – Best Place & Tips",
    date: "09 Jul, 2025",
    image:
      "https://images-wixmp-530a50041672c69d335ba4cf.wixmp.com/templates/image/8986240a850fd42b7d259e3469225816bf72748c787dd15b78ba94e807611e941584443523109.jpg",
  },
];

interface AllBlogsProps {
  setShowAllBlogs: (value: boolean) => void;
}

const AllBlogs: React.FC<AllBlogsProps> = ({ setShowAllBlogs }) => {
  const [search, setSearch] = useState("");

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full bg-[#f4f2ec] py-10">
      <div className="max-w-[1800px] mx-auto px-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setShowAllBlogs(false)}
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          >
            ← Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold">All Blogs</h1>
        </div>

        <div className="relative w-full md:w-[400px]">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-b border-gray-400 bg-transparent focus:outline-none pl-8 pr-4 py-2"
          />
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500">
            🔍
          </span>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-0">
        <div className="lg:col-span-2">
          <div className="relative w-full h-[720px] overflow-hidden rounded-md">
            <img
              src={filteredBlogs[0].image}
              alt={filteredBlogs[0].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-4xl font-semibold drop-shadow-lg">
                {filteredBlogs[0].title}
              </h2>
              <p className="text-base mt-2">{filteredBlogs[0].date}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-rows-3 gap-6 h-[720px]">
          {filteredBlogs.slice(1).map((blog) => (
            <div
              key={blog.id}
              className="relative flex w-full h-full overflow-hidden rounded-md cursor-pointer group"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-1/2 h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="flex flex-col justify-center px-4 bg-black/40 w-1/2 text-white">
                <h3 className="text-xl font-semibold">{blog.title}</h3>
                <p className="text-sm mt-2">{blog.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NewsLetter/>
    </div>
  );
};

export default AllBlogs;
