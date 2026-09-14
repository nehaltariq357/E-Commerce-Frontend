import React from "react";
import Link from "next/link";
import LogoutPage from "../logout/page";

const Navbar = () => {
  return (
    <div>
      <h1>Navbar</h1>
      <Link href="/login">Login</Link>
      <Link href="/register">Signup</Link>
      
        <LogoutPage />
      
    </div>
  );
};

export default Navbar;
