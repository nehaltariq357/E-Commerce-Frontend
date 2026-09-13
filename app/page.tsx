import Image from "next/image";
import LoginPage from "./login/page";
import Navbar from "./components/Navbar";
import AdminCategoriesPage from "./admin/categories/page";
import AdminProductPage from "./admin/products/page";

export default function Home() {
  return (
 <div>
 {/* test */}
{/* <AdminCategoriesPage/> */}
<AdminProductPage/>
 </div>
  );
}
