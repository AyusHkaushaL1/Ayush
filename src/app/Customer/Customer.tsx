"use client";

import React, { useState } from "react";
import { blogs } from "../Data/blogs";
import BlogCard from "./BlogCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Customer: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCards = 3;

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? blogs.length - visibleCards : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCards >= blogs.length ? 0 : prev + 1
    );
  };

  const visibleBlogs = blogs.slice(startIndex, startIndex + visibleCards);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Our Happy Customers</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hear from people who trusted us with their diamond jewellery
          experience.
        </p>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex justify-center gap-8 flex-nowrap">
          {visibleBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Customer;
