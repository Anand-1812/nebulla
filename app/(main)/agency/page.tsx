import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import AgencyDetails from "@/components/forms/agency-details";
import { getAuthUserDetails, verifyAndAcceptInvite } from "@/lib/queries";
import { subscriptions } from "@/db/schema";

type Plan = typeof subscriptions.plan

const Page = async ({
  searchParams
}: {
  searchParams: Promise<{ plan: Plan; state: string; code: string }>
}) => {

  const agencyId = await verifyAndAcceptInvite();

  const params = await searchParams;

  const user = await getAuthUserDetails();

  if (agencyId) {
    if (user?.user?.role === "SUBACCOUNT_GUEST" || user?.user?.role === "SUBACCOUNT_USER") {
      return redirect('/subaccount');
    } else if (user?.user?.role === "AGENCY_ADMIN" || user?.user?.role === "AGENCY_OWNER") {
      if (params.plan) {
        return redirect(`/agency/${agencyId}/billing?plan=${params.plan}`)
      }

      if (params.state) {
        const statePath = params.state.split('_')[0];
        const stateAgencyId = params.state.split('___')[1];

        if (!stateAgencyId) return <div>Not authorized</div>
        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${params.code}`)
      } else return redirect(`/agency/${agencyId}`);
    } else return <div>Not authorized</div>
  }

  const authUser = await currentUser();

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border p-4 rounded-xl">
        <h1 className="text-4xl mb-4">Create An Agency</h1>
        <AgencyDetails
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  )
}

export default Page
