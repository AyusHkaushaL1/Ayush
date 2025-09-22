"use client";
import React, { useState } from "react";
import NewsLetter from "./NewsLetter";
import Customer from "./Customer";
import Footer from "./Footer";
import { blogData } from "../Data/blogData";

interface AllBlogsProps {
  setShowAllBlogs: (value: boolean) => void;
}

const AllBlogs: React.FC<AllBlogsProps> = ({ setShowAllBlogs }) => {
  const [search, setSearch] = useState("");

  const filteredBlogs = blogData.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredBlogs.length === 0) {
    return (
      <div className="w-full p-8">
        <button
          onClick={() => setShowAllBlogs(false)}
          className="px-6 py-2 bg-[#0a2e37] text-white rounded hover:bg-black transition mb-4"
        >
          ← Back
        </button>
        <p>No blogs found for "{search}"</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f4f2ec]">
      {/* Top Bar */}
      <div className="max-w-[1800px] mx-28 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex -mx-10 mt-5 items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setShowAllBlogs(false)}
            className="px-6 py-2 bg-[#0a2e37] text-white rounded hover:bg-black transition"
          >
            ← Back
          </button>
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

      {/* Blog Layout */}
      <div className="max-w-[1900px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-0">
        {/* Big Left Blog */}
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

        {/* Right Small Blogs */}
        <div className="grid grid-rows-3 gap-6 h-[720px]">
          {filteredBlogs.slice(1, 4).map((blog) => (
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

      {/* Sections */}
      <div className="mt-16">
        <Customer />
      </div>
      <div className="mt-16">
        <NewsLetter />
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default AllBlogs;
