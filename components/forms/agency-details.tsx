'use client'

import * as z from "zod";
import { agencies } from "@/db/schema"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import Loading from "../global/loading";
import { useForm } from "react-hook-form";
import { NumberInput } from "@tremor/react"
import FileUpload from "../global/file-upload";
import { zodResolver } from "@hookform/resolvers/zod"
import { deleteAgency, initUser, saveActivityLog, updateAgencyDetails, upsertAgency } from "@/lib/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { v4 } from "uuid";

// agency typedef
type Agency = typeof agencies.$inferSelect

type Props = {
  data?: Partial<Agency>
}

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Agency must be atleast 2 chars long' }),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  agencyLogo: z.string().min(1)
});

const AgencyDetails = ({ data }: Props) => {
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // ✅ FIX: Ensure no undefined values to prevent uncontrolled input errors
      name: data?.name || "",
      companyEmail: data?.companyEmail || "",
      companyPhone: data?.companyPhone || "",
      whiteLabel: data?.whiteLabel || false,
      address: data?.address || "",
      city: data?.city || "",
      zipCode: data?.zipCode || "",
      state: data?.state || "",
      country: data?.country || "",
      agencyLogo: data?.agencyLogo || ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let newUserData;
      let customerId;
      // Note: Removed the unused 'bodyData' block for cleanliness

      newUserData = await initUser({ role: 'AGENCY_OWNER' } as any)

      if (!data?.id) {
        const response = await upsertAgency({
          id: data?.id ? data.id : v4(),
          address: values.address,
          agencyLogo: values.agencyLogo,
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          createdAt: new Date(),
          updatedAt: new Date(),
          companyEmail: values.companyEmail,
          connectAccountId: "",
          goal: 5,
        });

        // ✅ FIX: Only show success and redirect if response exists
        if (response) {
          toast.success("Agency created, congrats");
          return router.push(`/agency/${response.id}`);
        } else {
          toast.error("Oops! Something went wrong. Check the console.");
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Agency creation failed")
    }
  };

  const handleDeleteAgency = async () => {
    if (!data?.id) return

    setDeletingAgency(true)
    try {
      await deleteAgency(data.id);
      toast.success("Agency Deleted");
      router.refresh();
    } catch (error) {
      console.log(`Error: ${error}`)
      toast.error("Failed to delete agency");
      setDeletingAgency(false);
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Info</CardTitle>
          <CardDescription>
            Let's create an agency for your business. You can edit settings later.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

              {/* Agency Logo */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Agency Name + Email */}
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your agency name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input placeholder="agency@email.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Agency Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Whitelabel toggle */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="whiteLabel"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                    <div>
                      <FormLabel>WhiteLabel Agency</FormLabel>
                      <FormDescription>
                        Turning this on will show your agency branding to all sub-accounts.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Street..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* City + State */}
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Zip and Country */}
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Zip Code" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {data?.id && (<div className="flex flex-col gap-2">
                <FormLabel>Create a goal</FormLabel>
                <FormDescription>
                  {' '} Create a goal for you agency.As your business grows your goals too
                  so don't forget to set the bar higher!
                </FormDescription>
                <NumberInput defaultValue={(data?.goal)} onValueChange={async (val) => {
                  if (!data?.id) return
                  await updateAgencyDetails(data.id, { goal: val })
                  await saveActivityLog({
                    agencyId: data.id, description: `Updated the agency goal to | ${val} Sub Account`,
                    subaccountId: undefined
                  })
                  router.refresh()
                }}
                  min={1} className="bg-background !border !border-input"
                  placeholder="Sub account goal"
                />
              </div>)}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save Agency info"}
              </Button>
            </form>
          </Form>
          {data?.id && (
            <div className="flex flex-row items-center justify-center rounded-lg
              border-destructive gap-4 mt-4">
              <div>
                <div>Danger zone</div>
                <div className="text-muted-foreground">
                  Deleting your agency cannpt be undone.
                  This will also delete all sub accounts and all data related to your sub accounts.
                  Sub accounts will no longer have access to funnels, contacts etc.
                </div>
              </div>
              <AlertDialogTrigger disabled={isLoading || deletingAgency}
                className="text-red-500 p-3 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap">
                {deletingAgency ? "Deleting..." : "Delete Agency"}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-left">This action cannot be undone. This will permanently delete the Agency account and all related sub accounts.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={deletingAgency} className="bg-destructive hover:bg-destructive" onClick={handleDeleteAgency}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default AgencyDetails
