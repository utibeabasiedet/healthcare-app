'use client'
import Image from "next/image";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import { useEffect, useState } from "react";

// Define the type for the patient object
interface Patient {
  $id: string;
  // Add other properties of the patient object if needed
}

const Appointment = ({ params: { userId } }: { params: { userId: string } }) => {
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const patientData = await getPatient(userId);
      setPatient(patientData);
      console.log("Patient details:", patientData);
    };

    fetchPatient();
  }, [userId]);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          {patient && (
            <AppointmentForm
              patientId={patient.$id}
              userId={userId}
              type="create"
            />
          )}

          <p className="copyright mt-10 py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment;
