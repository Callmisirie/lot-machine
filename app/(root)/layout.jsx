"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import paths from "@/common/paths";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

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

const fetchPartials = async (email) => {
  const res = await fetch(`/api/getPartials?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch partials");
  return res.json();
};

const fetchInstruments = async (email) => {
  const res = await fetch(`/api/getInstruments?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch instruments");
  return res.json();
};

const fetchUserCustomTemplate = async (email) => {
  const res = await fetch(`/api/getCustomTemplate?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user custom template");
  return res.json();
};

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current pathname
  const {isLoading, isAuthenticated, user} = useKindeBrowserClient();
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

  const {
    isLoading: partialsLoading,
  } = useQuery({
    queryKey: ["partials", user?.email],
    queryFn: async () => await fetchPartials(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  const {
    isLoading: userCustomTemplateLoading,
  } = useQuery({
    queryKey: ["userCustomTemplate", user?.email],
    queryFn: async () => await fetchUserCustomTemplate(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  }); 

  const {
    isLoading: instrumentsLoading,
  } = useQuery({
    queryKey: ["instruments", user?.email],
    queryFn: async () => await fetchInstruments(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const referral = queryParams.get("referral");
    if (referral) {
      localStorage.setItem("referralId", referral);
    }
  }, []);

  if (!isLoading && !isAuthenticated && pathname !== "/auth") {
    redirect(paths.auth());
  }
  
  if (isLoading || !isAuthenticated || userInfoLoading || 
    !userInfo || subscriptionsLoading || !subscriptions.success ||
    partialsLoading || userCustomTemplateLoading || instrumentsLoading
  ) {
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
  
  if (!isLoading && !userInfoLoading && 
    userInfo && !subscriptionsLoading && 
    subscriptions.success && !partialsLoading && 
    !userCustomTemplateLoading && !instrumentsLoading
  ) {
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
