import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 ">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 ">
        <p className="text-base text-gray-400">
          &copy; 2024 BarPrep. All rights reserved.
          <Link
            href="/terms-of-use"
            className="text-orange-500 hover:text-orange-600 hover:underline ml-4"
          >
            Terms of Use
          </Link>
          <Link
            href="/privacy-policy"
            className="text-orange-500 hover:text-orange-600 hover:underline ml-4"
          >
            Privacy Policy
          </Link>
          <Link
            href="mailto:support@barquest.ca"
            className="text-orange-500 hover:text-orange-600 hover:underline ml-4"
          >
            Contact Us
          </Link>
          <Link
            href="/blog"
            className="text-orange-500  hover:text-orange-600 ml-4"
          >
            Our Blog
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
