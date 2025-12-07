import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { getAuthUserDetails, verifyAndAcceptInvite } from "@/lib/queries";

const Page = async () => {

  const agencyId = await verifyAndAcceptInvite();
  console.log(agencyId)

  const user = await getAuthUserDetails();

  return (
    <div>Agency Page</div>
  )
}

export default Page
