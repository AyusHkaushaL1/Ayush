import React from "react";
import AllBlogs from "./AllBlogs";

interface AllBlogsMainProps {
  setShowAllBlogs: (value: boolean) => void;
}

const AllBlogsMain: React.FC<AllBlogsMainProps> = ({ setShowAllBlogs }) => {
  return <AllBlogs setShowAllBlogs={setShowAllBlogs} />;
};

export default AllBlogsMain;
