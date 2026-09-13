import React from "react";
import LoginPage from "../login/page";
import Link from "next/link";
import LogoutPage from "../logout/page";

const Navbar = () => {
  return (
    <div>
      <h1>Navbar</h1>
      <Link href="/login">Login</Link>
      <button>
        <LogoutPage />
      </button>
    </div>
  );
};

export default Navbar;
