import { ModeToggle } from "@/components/global/mode-toogle"
import { UserButton } from "@clerk/nextjs"
import { User } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"

type Props = {
  user?: null | User
}

const Navigation = ({ user }: Props) => {
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image
          src={'/plura-logo.svg'}
          width={40}
          height={40}
          alt="nebulla logo"
        />
        <span className="text-2xl font-bold">Nebulla.</span>
      </aside>

      <nav className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ul className="inline-flex gap-8 items-center text-lg">
          <li className="hover:text-blue-500"><Link href="#">Pricing</Link></li>
          <li className="hover:text-blue-500"><Link href="#">Absolute</Link></li>
          <li className="hover:text-blue-500"><Link href="#">Documentation</Link></li>
          <li className="hover:text-blue-500"><Link href="#">Features</Link></li>
        </ul>
      </nav>

      <aside className="flex items-center justify-center gap-2">
        <Link href={'/agency'} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-primary/80">Login</Link>
        <UserButton />
        <ModeToggle />
      </aside>

    </div>
  )
}

export default Navigation
