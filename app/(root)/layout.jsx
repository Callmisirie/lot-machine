"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Navbar from "@/components/Navbar";

const fetchUserInfo = async (email) => {
  const res = await fetch(`/api/getUserInfo?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
};

const fetchSubscriptions = async (email) => {
  const res = await fetch(`/api/getSubscriptions?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch subscriptions");
  const { success, paymentPlanId, subscriptions } = await res.json();
  return {success, paymentPlanId, subscriptions}
};

export default function RootLayout({ children }) {
  const {isAuthenticated, user} = useKindeBrowserClient();
  const {
    data: userInfo,
    isLoading: userInfoLoading,
  } = useQuery({
    queryKey: ["userInfo", user?.email],
    queryFn: async () => await fetchUserInfo(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  const {
    data: subscriptions,
    isLoading: subscriptionsLoading,
  } = useQuery({
    queryKey: ["subscriptions", user?.email],
    queryFn: async () => await fetchSubscriptions(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  if (userInfoLoading || !userInfo || subscriptionsLoading || !subscriptions.success) {
    return (
      <main className="h-screen w-full flex flex-col">
        <Navbar />
        <div className="w-full h-full flex justify-center items-center relative">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-10 h-10 animate-spin text-primary" />
            <h3 className="text-xl font-bold">Loading...</h3>
            <p>Please wait...</p>
          </div>
        </div>
      </main>
    );
  } 

  if (!userInfoLoading && userInfo && !subscriptionsLoading && subscriptions.success) {
    return (
      <main className="h-screen w-full flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          {children}
        </div>
      </main>
    );
  }
}
