import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TripApp } from "@/components/TripApp";

export default async function TripPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  return <TripApp userName={session.user?.name ?? ""} />;
}
