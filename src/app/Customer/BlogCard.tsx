"use client";

import React from "react";
import { Blog } from "../Data/blogs";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <div
      className="
        bg-teal-950 text-white 
        p-10 
        h-[550px] w-[420px] 
        text-center 
        shadow-2xl border border-gray-800 
        flex flex-col justify-between 
        transform transition-transform duration-500 ease-in-out 
        hover:scale-105 hover:shadow-3xl 
        cursor-pointer
      "
    >
      <div>
        <p className="text-6xl mb-8">“</p>
        <p className="mb-10 text-lg leading-relaxed line-clamp-8">
          {blog.content}
        </p>
      </div>
      <div>
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        )}
        <h3 className="font-semibold uppercase tracking-wide text-2xl">
          {blog.name}
        </h3>
      </div>
    </div>
  );
};

export default BlogCard;
