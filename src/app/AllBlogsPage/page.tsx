// app/allblogs/page.tsx
import React from "react";
import AllBlogsMain from "./AllBlogsMain";

export default function AllBlogsPage() {
  return <AllBlogsMain setShowAllBlogs={function (value: boolean): void {
    throw new Error("Function not implemented.");
  } } />;
}
