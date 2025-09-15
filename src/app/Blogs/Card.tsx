"use client";

import React from "react";
import Image from "next/image";

interface CardProps {
  image: string;
  title: string;
  date: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ image, title, date, description }) => {
  return (
    <div className="w-full h-full bg-white shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-500 hover:scale-110"
          unoptimized
        />
      </div>
      <div className="mt-4 px-2 md:px-4 pb-6">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-4">{date}</p>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
    </div>
  );
};

export default Card;
