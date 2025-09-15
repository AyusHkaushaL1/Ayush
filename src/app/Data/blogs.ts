export interface Blog {
  id: number;
  name: string;
  content: string;
  image?: string;
}

export const blogs: Blog[] = [
  {
    id: 1,
    name: "Ayumun Naqvi",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    name: "Meenakshi Karanth",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
    image: "/images/meenakshi.jpg",
  },
  {
    id: 3,
    name: "Rema Ramachandran",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.",
    image: "/images/rema.jpg",
  },
  {
    id: 4,
    name: "Arjun Mehta",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia arcu eget nulla.",
  },
];
