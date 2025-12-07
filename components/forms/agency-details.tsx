'use client'

import { agencies } from "@/db/schema"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Toaster } from "../ui/sonner";
import { AlertDialog } from "../ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";

// type for inserting, drizzle is weird
type Agency = typeof agencies.$inferSelect

type Props = {
  data?: Partial<Agency>
}

const FormSchema = z.object({
  name: z.string().min(2, {message: 'Agency must be atleast 2 chars long'}),
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
  const form = useForm<z.infer<typeof FormSchema>>()
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>Agency Info
          <CardDescription>
            Let's create and agency for your business. You can edit agency setting later from the
            agency settings tab
          </CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default AgencyDetails
