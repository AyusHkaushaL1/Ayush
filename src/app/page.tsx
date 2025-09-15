"use client";
import { useState } from "react";
import AllBlogsMain from "./AllBlogsPage/AllBlogsMain";
import WholePage from "./Blogs/wholePage";

export default function HomePage() {
  const [showAllBlogs, setShowAllBlogs] = useState(false);

  return (
    <div>
      {!showAllBlogs ? (
        <WholePage setShowAllBlogs={setShowAllBlogs} />
      ) : (
        <AllBlogsMain setShowAllBlogs={setShowAllBlogs} />
      )}
    </div>
  );
}