'use server';

import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { users } from "@/db/schema/users";
import { invitations } from "@/db/schema";
import { redirect } from "next/navigation";
import { notifications } from "@/db/schema";
import { agencies } from "@/db/schema/agency";
import { clerkClient } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { permissions } from "@/db/schema/permission";
import { subAccounts } from "@/db/schema/subaccount";
import { agencySidebarOptions } from "@/db/schema/agencySidebarOption";

export const getAuthUserDetails = async () => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const email = authUser.emailAddresses[0].emailAddress;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) return null;

  const [agency] = await db
    .select()
    .from(agencies)
    .where(eq(agencies.id, user.agencyId ?? ""));

  const sidebarOptions = await db
    .select()
    .from(agencySidebarOptions)
    .where(eq(agencySidebarOptions.agencyId, user.agencyId ?? ""));

  const subAccountsList = await db
    .select()
    .from(subAccounts)
    .where(eq(subAccounts.agencyId, user.agencyId ?? ""));

  const permissionsList = await db
    .select()
    .from(permissions)
    .where(eq(permissions.email, user.email));

  return {
    user,
    agency,
    sidebarOptions,
    subAccounts: subAccountsList,
    permissions: permissionsList,
  };
};

export const saveActivityLog = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string;
  description: string;
  subaccountId?: string;
}) => {

  let userRecord = null;
  const authUser = await currentUser();

  if (authUser) {
    const email = authUser.emailAddresses[0].emailAddress;

    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    userRecord = dbUser;
  }
  else {
    if (!subaccountId) {
      throw new Error("Missing both auth user and subaccountId.");
    }

    const [dbUser] = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .innerJoin(agencies, eq(users.agencyId, agencies.id))
      .innerJoin(subAccounts, eq(subAccounts.agencyId, agencies.id))
      .where(eq(subAccounts.id, subaccountId))
      .limit(1);

    userRecord = dbUser;
  }

  if (!userRecord) {
    console.log("Could not find a user for activity logging");
    return;
  }

  let finalAgencyId = agencyId;

  if (!finalAgencyId) {
    if (!subaccountId) {
      throw new Error("Provide at least agencyId or subaccountId");
    }

    const [sub] = await db
      .select()
      .from(subAccounts)
      .where(eq(subAccounts.id, subaccountId))
      .limit(1);

    finalAgencyId = sub?.agencyId;
  }


  await db.insert(notifications).values({
    notification: `${userRecord.name} | ${description}`,
    userId: userRecord.id,
    agencyId: finalAgencyId!,
    subAccountId: subaccountId ?? null,
  });

  return "ok";
};

export const createTeamUser = async (
  agencyId: string,
  payload: {
    email: string;
    agencyId: string;
    avatarUrl: string;
    id: string;
    name: string;
    role: string;
  }
) => {
  if (payload.role === "AGENCY_OWNER") return null;

  const [created] = await db
    .insert(users)
    .values({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      avatarUrl: payload.avatarUrl,
      role: payload.role,
      agencyId: payload.agencyId,
    } as any)
    .returning();

  return created;
};

export const verifyAndAcceptInvite = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const email = user.emailAddresses[0].emailAddress;

  const [invitation] = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.email, email),
        eq(invitations.status, "PENDING")
      )
    )
    .limit(1);

  if (!invitation) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return existingUser[0]?.agencyId ?? null;
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    await db
      .update(invitations)
      .set({ status: "ACCEPTED" })
      .where(eq(invitations.id, invitation.id));

    return existingUser.agencyId;
  }

  const userObj = {
    email: invitation.email,
    agencyId: invitation.agencyId,
    avatarUrl: user.imageUrl,
    id: user.id, // Clerk user id
    name: `${user.firstName} ${user.lastName}`,
    role: invitation.role,
  };

  const createdUser = await createTeamUser(invitation.agencyId!, userObj);

  await saveActivityLog({
    agencyId: invitation.agencyId!,
    description: "Joined",
  });

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(user.id, {
    privateMetadata: { role: invitation.role },
  });


  await db
    .delete(invitations)
    .where(eq(invitations.id, invitation.id));

  return invitation.agencyId;
};


