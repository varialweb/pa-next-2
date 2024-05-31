import { cookies } from "next/headers";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

import { Metal_Mania } from "next/font/google";

const metalMania = Metal_Mania({ subsets: ['latin'], weight: ['400'] })

export default function Nav() {
  const cart = cookies().get('cart')
  return (
    <nav className={metalMania.className}>
      <DesktopNav cart={cart} />
      <MobileNav cart={cart} />
    </nav>
  )
}