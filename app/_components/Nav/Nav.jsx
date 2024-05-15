import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

import { Metal_Mania } from "next/font/google";

const metalMania = Metal_Mania({ subsets: ['latin'], weight: ['400'] })

export default function Nav() {
  return (
    <nav className={metalMania.className}>
      <DesktopNav />
      <MobileNav />
    </nav>
  )
}