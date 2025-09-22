"use client";

import React from "react";
import Card from "./Card";
import { blogData } from "../Data/blogData";

interface WholePageProps {
  setShowAllBlogs: (value: boolean) => void;
}

const WholePage: React.FC<WholePageProps> = ({ setShowAllBlogs }) => {
  const firstThreeBlogs = blogData.slice(0, 3);

  return (
    <div className="w-full min-h-screen px-6 md:px-12 py-16 bg-gray-50">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Know Your Diamond Jewellery</h1>
        <p className="text-gray-600 text-lg max-w-4xl mx-auto">
          Stay informed with the latest industry trends and insights. Our blog
          is your go-to resource for expert advice, tips, and thought-provoking
          ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
        {firstThreeBlogs.map((blog) => (
          <Card
            key={blog.id}
            image={blog.image}
            title={blog.title}
            date={blog.date}
            description={blog.description}
          />
        ))}
      </div>

      <div className="flex justify-center mt-16">
        <button
          onClick={() => setShowAllBlogs(true)}
          className="px-10 py-4 bg-[#0a2e37] text-white text-lg shadow hover:bg-black transition"
        >
          Read Blogs
        </button>
      </div>
    </div>
  );
};

export default WholePage;
