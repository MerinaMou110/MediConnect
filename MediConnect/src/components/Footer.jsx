const Footer = () => {
  return (
    <footer className="bg-[#4A8BBE] text-white text-center py-4 mt-10">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Hospital Management. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
