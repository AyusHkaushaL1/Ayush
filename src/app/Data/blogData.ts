export interface Blog {
  id: number;
  image: string;
  title: string;
  date: string;
  description: string;
}

export const blogData: Blog[] = [
  {
    id: 1,
    image:
      "https://colorlib.com/wp/wp-content/uploads/sites/2/woodmart-jewelry-wordpress-theme.jpg",
    title: "Lorem Ipsum Dolor Sit Amet",
    date: "01 Jan, 2025",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.",
  },
  {
    id: 2,
    image:
      "https://themewagon.com/wp-content/uploads/2018/08/Blanca-free-HTML5-personal-website-template.jpg",
    title: "Sed Do Eiusmod Tempor Incididunt",
    date: "02 Feb, 2025",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    image: "https://www.candere.com/media/mageplaza/blog/post/Blog---Banner.jpg",
    title: "Ut Enim Ad Minim Veniam",
    date: "03 Mar, 2025",
    description:
      "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];
