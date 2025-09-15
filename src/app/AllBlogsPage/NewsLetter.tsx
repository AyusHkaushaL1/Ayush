"use client";
import React, { useState } from "react";

const NewsLetter = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full bg-[#f4f2ec] py-20 mt-16">
      <div className="max-w-[1000px] mx-auto px-6">

        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#163d3c] mb-8">
            Sign Up For Our Free Weekly Newsletter
          </h2>
          <form className="flex flex-col md:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter Email Address"
              className="w-full md:w-[400px] border-b border-gray-400 bg-transparent focus:outline-none text-lg py-2"
            />
            <button
              type="submit"
              className="px-10 py-3 bg-[#163d3c] text-white text-sm tracking-[2px] uppercase"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
