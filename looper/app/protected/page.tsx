import Sidebar from "@/components/dashboard/sidebar";
import Uploads from "@/components/dashboard/uploads";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { BriefcaseBusiness, InfoIcon, Plus, UploadCloud } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full h-screen bg-gray-100 grid grid-cols-12 gap-6 p-6">
      <div className="col-span-2">
        <Sidebar username={user.email} />
      </div>
      <main className="col-span-10 flex justify-center items-center">
        <Uploads />
      </main>
    </div>
  );
}
