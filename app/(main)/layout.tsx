import { dark } from "@clerk/themes"
import { ClerkProvider } from "@clerk/nextjs"

const Layout = ({ children }: {children: React.ReactNode}) => {
  return (
    <div>
      <ClerkProvider appearance={dark}>
        {children}
      </ClerkProvider>
    </div>
  )
}

export default Layout
