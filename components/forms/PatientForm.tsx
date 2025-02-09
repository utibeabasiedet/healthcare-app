"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true); // Set loading state
    router.push(`/patients/${newUser.$id}/register`);
  
    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      console.log(user)
  
      // Call createUser function
      const newUser = await createUser(user);
  
      // Check if newUser is defined and has a $id property
      if (newUser || newUser.$id || ) {
        console.log("New user created:", newUser);
  
        // Redirect to patient registration page
        router.push(`/patients/${newUser.$id}/register`);
      } else {
        router.push(`/patients/${newUser.$id}/register`);
        console.error("Failed to create user or invalid response:", newUser);
        // Handle case where newUser is undefined or doesn't have $id
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error("An error occurred while creating user:", error);
      // Handle error, optionally display an error message to the user
    }
  
    setIsLoading(false); // Reset loading state
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(090) 123-4567"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
