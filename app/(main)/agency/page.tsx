import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import AgencyDetails from "@/components/forms/agency-details";
import { getAuthUserDetails, verifyAndAcceptInvite } from "@/lib/queries";

const Page = async ({ searchParams }: { searchParams: { plan: Plan; state: string; code: string } }) => {

  const agencyId = await verifyAndAcceptInvite();
  console.log(agencyId)

  const user = await getAuthUserDetails();
  if (agencyId) {
    if (user?.user?.role === "SUBACCOUNT_GUEST" || user?.user?.role === "SUBACCOUNT_USER") {
      return redirect('/subaccount');
    } else if (user?.user?.role === "AGENCY_ADMIN" || user?.user?.role === "AGENCY_OWNER") {
      if (searchParams.plan) {
        return redirect(`/agency${agencyId}/billing?plan=${searchParams.plan}`)
      }

      if (searchParams.state) {
        const statePath = searchParams.state.split('_')[0];
        const stateAgencyId = searchParams.state.split('___')[1];

        if (!stateAgencyId) return <div>Not authorized</div>
        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`)
      } else return redirect(`/agency/${agencyId}`);
    } else return <div>Not authorized</div>
  }

  const authUser = await currentUser();
  return <div className="flex justify-center items-center mt-4">

    <div className="max-w-[850px] border p-4 rounded-xl">
      <h1 className="text-4xl">Create An Agency</h1>
      <AgencyDetails
        data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
      >

      </AgencyDetails>
    </div>

  </div>
}



export default Page
