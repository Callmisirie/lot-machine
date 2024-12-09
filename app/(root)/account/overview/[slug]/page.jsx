"use client"

import AccountPill from '@/components/account/AccountPill'
import Button from '@/components/account/Button'
import CardFrame from '@/components/account/CardFrame'
import DownloadQrCode from '@/components/account/DownloadQrCode'
import DualButton from '@/components/account/DualButton'
import Header from '@/components/account/Header'
import Input from '@/components/account/Input'
import TabButtons from '@/components/account/TabButtons'
import { clipboardBlack, dropArrowBlack } from '@/public/icons/black'
import { backArrowWhite, cancelWhite, homeWhite } from '@/public/icons/white'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { usePathname, useRouter } from "next/navigation";
import { SelectFrame } from '@/components/account/SelectFrame'
import { ComboboxInput } from '@/components/account/Combobox'
import useResizeObserver from "use-resize-observer";
import { ScrollAreaFrame } from '@/components/account/ScrollArea'
import { Skeleton } from '@/components/ui/skeleton'
import Pusher from 'pusher-js'
import Link from 'next/link'
import crypto from "crypto";
import ComfirmationPopoverButton from '@/components/account/ComfirmationPopoverButton'
import { cautionAccentGreen, cautionAccentRed } from '@/public/icons/accent'
import { TooltipFrame } from '@/components/TooltipFrame'

const addBeneficiary = async (beneficiaryDetails) => {
  const res = await fetch(`/api/addBeneficiary?beneficiaryDetails=${encodeURIComponent(beneficiaryDetails)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to add beneficiary");
  const response = await res.json();
  return { status: response.status, message: response.message, data: response.data };
};

const deleteBeneficiary = async (beneficiaryDetails) => {
  const res = await fetch(`/api/deleteBeneficiary?beneficiaryDetails=${encodeURIComponent(beneficiaryDetails)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to delete user beneficiary");
  const { success, data } = await res.json();
  return {success, data};
};

const makeWithdrawal = async (beneficiaryDetails) => {
  const res = await fetch(`/api/makeWithdrawal?beneficiaryDetails=${encodeURIComponent(beneficiaryDetails)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to make withdrawal");
  const response = await res.json();
  return { status: response.status, message: response.message, data: response.data };
};

const fetchUserEarnings = async (email) => {
  const res = await fetch(`/api/getUserEarnings?email=${encodeURIComponent(email)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user earnings");
  const { success, userEarnings } = await res.json();
  return {success, userEarnings};
};

const fetchReferralsCount = async (email) => {
  const res = await fetch(`/api/getReferralsCount?email=${encodeURIComponent(email)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch referral count");
  const { success, userPlan, referredUsers, totalReferrals, totalActiveReferrals, users, totalUsers, totalActiveUsers } = await res.json();
  return {success, userPlan, referredUsers, totalReferrals, totalActiveReferrals, users, totalUsers, totalActiveUsers};
};

const fetchGetBanks = async (country) => {
  const res = await fetch(`/api/getBanks?country=${encodeURIComponent(country)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch banks");
  const { status, data } = await res.json();
  return { status, data };
};

const fetchBeneficiary = async (email) => {
  const res = await fetch(`/api/getBeneficiary?email=${encodeURIComponent(email)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch beneficiary");
  const { success, userBeneficiary } = await res.json();
  return { success, userBeneficiary }
};

const fetchTransfers = async (email) => {
  const res = await fetch(`/api/getTransfers?email=${encodeURIComponent(email)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user transfers");
  const { success, transfers } = await res.json();  
  return {success, transfers};
};

const page = () => {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const secretHash = crypto.createHash("sha256").update(secretKey).digest("hex");
  const pathname = usePathname(); // Get the current pathname
  const {isAuthenticated, user} = useKindeBrowserClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: userEarnings,
    isLoading: userEarningsLoading,
  } = useQuery({
    queryKey: ["userEarnings", user?.email],
    queryFn: async () => await fetchUserEarnings(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  const {
    data: referralCount,
    isLoading: referralCountLoading,
  } = useQuery({
    queryKey: ["referralCount", user?.email],
    queryFn: async () => await fetchReferralsCount(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  const {
    data: userBeneficiary,
    isLoading: userBeneficiaryLoading,
  } = useQuery({
    queryKey: ["beneficiary", user?.email],
    queryFn: async () => await fetchBeneficiary(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  const {
    data: userTransfers,
    isLoading: userTransfersLoading,
    refetch: userTransfersRefetch
  } = useQuery({
    queryKey: ["transfers", user?.email],
    queryFn: async () => await fetchTransfers(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  
  const userInfo = queryClient.getQueryData(["userInfo", user?.email]);
  const [tabButtonState, setTabButtonState] = useState("Statistics")
  const [isReferralList, setIsReferralList] = useState(false)
  const [isWithdrawalHistory, setIsWithdrawalHistory] = useState(false)
  const [isWithdrawalDetails, setIsWithdrawalDetails] = useState(false)
  const [selectedBank, setSelectedBank] = useState("")
  const formatter = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short"
  });
  const [countryBanks, setCountryBanks] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const { ref, height } = useResizeObserver();  
  const [comfirmationPopoverOpen, setComfirmationPopoverOpen] = useState(false);
  const [message, setMessage] = useState({
    success: false,
    messageContent: ""
  })

  const currentYear = new Date().getFullYear(); // Get current year
  const currentMonth = new Date().getMonth() + 1; // Get current month (0-indexed)

  const getAbbreviatedMonth = (monthNumber) => {
    // Create a placeholder date (day and year don't matter for month formatting)
    const date = new Date(2024, monthNumber - 1); // Subtract 1 since months are 0-based
    return format(date, 'MMM'); // Returns abbreviated month (e.g., "Nov")
  };

  const currentYearInEarningsEntry = userEarnings?.userEarnings?.in?.filter(
    (entry) => entry.year === currentYear
  );
  
  const currentYearOutEarningsEntry = userEarnings?.userEarnings?.out?.filter(
    (entry) => entry.year === currentYear
  );

  const currentMonthEarningsEntry = userEarnings?.userEarnings?.in?.filter(
    (entry) => entry.year === currentYear && entry.month === currentMonth
  );
  
  const currentYearInEarnings = currentYearInEarningsEntry?.reduce((sum, entry) => sum + entry.amount, 0) || 0;

  const currentYearOutEarnings = currentYearOutEarningsEntry?.reduce((sum, entry) => sum + entry.amount, 0) || 0;

  const currentMonthEarnings = currentMonthEarningsEntry?.reduce((sum, entry) => sum + entry.amount, 0) || 0;

  const referralSplitPercentage = () => {
    if (referralCount.success) {
      if (!referralCount?.totalActiveReferrals || referralCount?.totalActiveReferrals >= 0 && referralCount?.totalActiveReferrals < 100) {
        return 20;
      } else if (referralCount?.totalActiveReferrals >= 100 && referralCount?.totalActiveReferrals < 1000) {
        return 30;
      } else if (referralCount?.totalActiveReferrals >= 1000) {
        return 40;
      }
    }
  }

  const countryDetails = {
    placeholder: "Select a country",
    values:
    [
      {value: "NG"},
      {value: "GH"}
    ]
  }

  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(pusherKey, {
      cluster: 'mt1',
      encrypted: true,
    });

    // Subscribe to the channel and bind to the event
    const channel = pusher.subscribe('transfer-channel');
    channel.bind('transfer-event', async (data) => {
      console.log('Received data:', data);
      if (data.data.transfer.status === "SUCCESSFUL") {
        
      }
    });

    return () => {
      pusher.unsubscribe('transfer-channel');
    };
  }, []);
  

  useEffect(() => {
    if (selectedCountry) {
      const fetchBanks = async () => {
        try {
          console.log("Selected Country:", selectedCountry);
          const {status, data} = await fetchGetBanks(selectedCountry);
          if (status === "success") {
            setSelectedBank("");
            setAccountNumber("");
            setCountryBanks(data);
            console.log("Fetched Banks:", data);
          }
        } catch (error) {
          console.error("Error fetching banks:", error);
        }
      };
  
      fetchBanks(); // Call the asynchronous function
    }
  }, [selectedCountry]);

  const handleCancelAction = () => {
    setSelectedBank("");
    setAccountNumber("");
  }
  
  const handleAddBankAction = async () => {
    if (!selectedCountry || !selectedBank || !accountNumber || !userInfo) return;

      const selectedBankCode = countryBanks.find((bank) => bank.name === selectedBank)?.code;
      const beneficiaryDetails = JSON.stringify({
        email: userInfo?.email,
        accountNumber,
        accountBank: selectedBankCode,
        beneficiaryName: userInfo?.name,
        currency: selectedCountry === "NG" ? "NGN" : "GHS"
      });
      
      const {status, message} = await addBeneficiary(beneficiaryDetails);
      if (status === "success") {
        setSelectedBank("");
        setAccountNumber("");
        await queryClient.invalidateQueries("beneficiary");
      }

      setMessage({
        success: status === "success" ? true : false,
        messageContent: message
      });
  
      setTimeout(() => {
        setMessage({
          success: false,
          messageContent: ""
        })
      }, 5000);
  };
  
  const handleMakeWithdrawal = async () => {
    if (!userBeneficiary?.userBeneficiary?.beneficiaryId || !userInfo || !userBeneficiary) return;

    const beneficiaryDetails = JSON.stringify({
      email: userInfo?.email,
      currency: userBeneficiary?.userBeneficiary?.currency,
      beneficiaryId: userBeneficiary?.userBeneficiary?.beneficiaryId,
      account_number: userBeneficiary?.userBeneficiary?.accountNumber, 
      account_bank: userBeneficiary?.userBeneficiary?.bankCode
    });
    
    const {status, message} = await makeWithdrawal(beneficiaryDetails);
    if (status === "success") {
      await queryClient.invalidateQueries("userEarnings");
      await queryClient.invalidateQueries("transfers");
    }

    setMessage({
      success: status === "success" ? true : false,
      messageContent: message
    });

    setTimeout(() => {
      setMessage({
        success: false,
        messageContent: ""
      })
    }, 5000);
  };

  const referralContent = () => {
    if (tabButtonState === "Statistics") {
      if (!isReferralList) {
        return (
          <div className='w-full h-full 
          flex flex-col justify-between 
          items-center'>
            <div className='flex w-full h-[72px] 
            items-start justify-start flex-col
            gap-2 '>
              <div className='w-fit flex 
              items-center justify-start gap-4 
              border-b border-n-300'>
                <h6 className='h6 text-n-700'>Balance</h6>
                <p className='p2b text-n-500'>&#8358;
                  {userEarnings?.userEarnings?.balance 
                  ? formatter.format(userEarnings?.userEarnings?.balance) 
                  : 0}
                </p>
              </div>
              <p className='p3b text-n-900 cursor-pointer'
              onClick={() => {
                setIsReferralList(true)
              }}>
                Show {userInfo.plan === "Master" ? "user" : "referral"} list
              </p>
            </div>
            <div className='flex w-full h-fit justify-between items-start'>
              <div className='flex flex-col 
              w-fit pr-2 items-start
              border-n-300 border-r'>
                <h5 className='h5 text-n-700'>{userInfo.plan === "Master" ? "Users" : "Referrals"}</h5>
                <div className='flex flex-col w-fit h-fit'>
                  <div className='flex w-fit h-fit gap-1 items-center'>
                    <h4 className='h4 text-n-500'>Total</h4>
                    <h3 className='h3 text-n-300'>
                      {userInfo.plan === "Master" 
                      ? referralCount?.totalUsers 
                        ? formatter.format(referralCount?.totalUsers)
                        : 0
                      :referralCount?.totalReferrals 
                        ? formatter.format(referralCount?.totalReferrals)
                        : 0 
                      }
                    </h3>
                  </div>
                  <div className='flex w-fit h-fit gap-1 items-center'>
                    <h6 className='h6 text-n-500'>Active</h6>
                    <h5 className='h5 text-n-300'>
                    {userInfo.plan === "Master" 
                    ? referralCount?.totalActiveUsers 
                      ? formatter.format(referralCount?.totalActiveUsers)
                      : 0
                    :referralCount?.totalActiveReferrals 
                      ? formatter.format(referralCount?.totalActiveReferrals)
                      : 0 
                    }
                    </h5>
                  </div>
                </div>
              </div>
              <div className='flex flex-col 
              w-fit h-fit items-start justify-start'>
                <h6 className='h6 text-n-700'>{getAbbreviatedMonth(currentMonth)} earnings</h6>
                <h3 className='h3 text-n-500'>
                &#8358;
                  {currentMonthEarnings
                  ? formatter.format(currentMonthEarnings) 
                  : 0}
                </h3>
              </div>
            </div>
            <div className='flex flex-col w-full h-fit'>
              <div className={`flex w-fit h-fit 
              justify-start items-center gap-1 ${userInfo.plan === "Master" && "invisible"}`}>
                <h2 className='h2 text-n-300'>{referralSplitPercentage()}%</h2>
                <div className='w-fit h-fit flex items-center gap-1'>
                  <p className='p2b text-n-500'>
                    Referral split -
                  </p>
                  <p className='p2b text-n-700'>
                    {referralCount?.userPlan === "Pro" 
                    ? "Active" 
                    : "Inactive"}
                  </p>
                </div>
              </div>
              {/* <DownloadQrCode 
              userInfo={userInfo}/> */}
              <div className='flex justify-between items-end'>
                <div className='flex w-fit h-fit 
                flex-col items-start'>
                  <h4 className='h4 text-n-900'>Referral link</h4>
                  <p className='p3r text-n-500'>
                    lotmachine.com/xxxxxxxxxxxxxxxxxxxx
                  </p>
                </div>
                <div 
                className='cursor-pointer'
                onClick={() => {
                  if (userInfo?.referrerId) {
                    navigator.clipboard.writeText(
                      `http://localhost:3000/?referral=${userInfo?.referrerId}`
                    );
                  }
                }}
                >
                  <TooltipFrame
                  label={"Copy"}>
                    <Image 
                    src={clipboardBlack} 
                    width={24} 
                    height={24} 
                    alt="clipboard icon" 
                    className="" 
                    priority
                    /> 
                  </TooltipFrame>
                </div>
              </div>
            </div>
          </div>
        )
      }
      if (isReferralList) {
        const usersCount = () => {
          if (userInfo.plan === "Master") {
            return referralCount.users;
          } else {
            return referralCount.referredUsers;
          }
        }

        return (
          <div className='w-full h-full 
          flex flex-col justify-start gap-2 
          items-center'>
            <div  className='flex flex-col w-full h-fit items-center'>
              <h6 className='h6 text-n-700 w-fit'>{userInfo.plan === "Master" ? "User" : "Referral"} list</h6>
              <div className='w-full flex justify-end'>
                <div className='w-[27px] h-[27px] 
                rounded-full flex items-center 
                justify-center bg-n-900
                cursor-pointer'
                onClick={() => {
                  setIsReferralList(false)
                }}>
                  <Image
                    src={cancelWhite}
                    width={24}
                    height={24}
                    alt='delete icon'
                    priority
                  />
                </div>
              </div>
            </div>
            <div className='w-full h-full gap-[32px] flex flex-col'>
              <div className='w-full h-fit 
              flex justify-between items-center'>
                <div className='w-fit h-fit gap-2 flex items-center'>
                  <h4 className='h4 text-n-700'>Total</h4>
                  <p className='p1b text-n-700'>
                  {userInfo.plan === "Master" 
                  ? referralCount?.totalUsers 
                    ? formatter.format(referralCount?.totalUsers)
                    : 0
                  :referralCount?.totalReferrals 
                    ? formatter.format(referralCount?.totalReferrals)
                    : 0 
                  }
                  </p>
                </div>
                <div className='w-fit h-fit gap-2 flex items-center'>
                  <h6 className='h6 text-n-700'>Active</h6>
                  <p className='p3r text-n-700'>
                  {userInfo.plan === "Master" 
                  ? referralCount?.totalActiveUsers 
                    ? formatter.format(referralCount?.totalActiveUsers)
                    : 0
                  :referralCount?.totalActiveReferrals 
                    ? formatter.format(referralCount?.totalActiveReferrals)
                    : 0 
                  }
                  </p>
                </div>
              </div>
              <ScrollAreaFrame
                mainClass={`w-full h-[259px]`}
                innerClass={`w-full h-full flex flex-col gap-4`}>
                {usersCount()?.map((user) => {
                  return (
                    <div className='w-full h-fit flex 
                    justify-between pb-2 items-start 
                    border-b border-n-300'>
                      <p className='p2r text-n-700'>
                        {user.username}
                      </p>
                      <p className={`p3r  
                        ${user?.plan === "Pro" 
                        ? "text-accent-green-300" 
                        : "text-accent-red-300"}`}>
                        {user?.plan === "Pro" 
                        ? "Active"
                        : "Inactive"}
                      </p>
                    </div>
                  )
                })}       
              </ScrollAreaFrame>
            </div>
          </div>
        )
      }
    }
    if (tabButtonState === "Withdrawal") {
      if (userBeneficiaryLoading) {
        return (
          <div className="w-full h-full flex justify-center items-center relative">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-10 h-10 animate-spin text-primary" />
              <h3 className="text-xl font-bold">Loading...</h3>
              <p>Please wait...</p>
            </div>
          </div>
        );
      } else {
        if (!userBeneficiary?.success && !isWithdrawalHistory) {
          return (
            <div className='w-full h-full 
            flex flex-col justify-between 
            items-center'>
              <div className='flex w-full h-[72px] 
              items-start justify-start flex-col
              gap-2 '>
                <div className='w-fit flex 
                items-center justify-start gap-4 
                border-b border-n-300'>
                  <h6 className='h6 text-n-700'>Balance</h6>
                  <p className='p2b text-n-500'>&#8358;
                    {userEarnings?.userEarnings?.balance 
                    ? formatter.format(userEarnings?.userEarnings?.balance)
                    : 0}
                  </p>
                </div>
                <p className='p3b text-n-900 cursor-pointer'
                onClick={() => {
                  setIsWithdrawalHistory(true)
                }}>
                  Withdrawal history
                </p>
              </div>
              <div className='flex flex-col gap-2 w-fit h-fit'>
                <SelectFrame 
                 label={"Country"}
                 details={countryDetails}
                 selectedCountry={selectedCountry}
                 setSelectedCountry={setSelectedCountry}
                />
                <ComboboxInput 
                  countryBanks={countryBanks}
                  selectedBank={selectedBank}
                  setSelectedBank={setSelectedBank}
                />
                <Input 
                label={"Account number"}
                type={"number"}
                name={"Account number"}
                value={accountNumber}
                handleChange={setAccountNumber}
                />
              </div>
              <div className="flex flex-col justify-center items-center w-full">
                <div className={`flex w-fit 
                min-h-[24px] items-center 
                justify-center mb-1 
                ${!message?.messageContent && "invisible"}`}>
                  <Image 
                    src={message?.success ? cautionAccentGreen : cautionAccentRed} 
                    width={24} 
                    height={24} 
                    alt="cation icon" 
                    className="" 
                    priority
                    />   
                  <p className={`l3r ${message?.success 
                    ? "text-accent-green-300" 
                    : "text-accent-red-300"}`}>
                      {message?.messageContent}
                  </p>
                </div>             
                <div className='w-full'>
                  <DualButton 
                  addBankAction={handleAddBankAction}
                  cancelAction={handleCancelAction}/>
                </div>         
              </div>
            </div>
          )
        }
        if (userBeneficiary?.success && !isWithdrawalHistory) {
          return (
            <div className='w-full h-full 
            flex flex-col justify-between 
            items-center'>
              <div className='flex w-full h-[95px] 
              items-start flex-col gap-2'>
                <div className='w-fit flex flex-col items-start 
                border-b border-n-300'>
                  <h6 className='h6 text-n-700'>Balance</h6>
                  <h2 className='h3 text-n-500'>&#8358;
                    {userEarnings?.userEarnings?.balance 
                    ? formatter.format(userEarnings?.userEarnings?.balance)
                    : 0}
                  </h2>
                </div>
                <p className='p3b text-n-900 cursor-pointer'
                onClick={() => {
                  setIsWithdrawalHistory(true)
                }}>
                  Withdrawal history
                </p>
              </div>
              <AccountPill 
              bankName={userBeneficiary?.userBeneficiary?.bankName}
              accountNumber={userBeneficiary?.userBeneficiary?.accountNumber}
              setComfirmationPopoverOpen={setComfirmationPopoverOpen}
              beneficiaryId={userBeneficiary?.userBeneficiary?.beneficiaryId}
              />
              <div className="flex flex-col justify-center items-center w-full">
                <div className={`flex w-fit 
                min-h-[24px] items-center 
                justify-center mb-1 
                ${!message?.messageContent && "invisible"}`}>
                  <Image 
                    src={message?.success ? cautionAccentGreen : cautionAccentRed} 
                    width={24} 
                    height={24} 
                    alt="cation icon" 
                    className="" 
                    priority
                    />   
                  <p className={`l3r ${message?.success 
                    ? "text-accent-green-300" 
                    : "text-accent-red-300"}`}>
                      {message?.messageContent}
                  </p>
                </div>             
                <Button 
                makeWithdrawalAction={handleMakeWithdrawal}
                label={"Request withdrawal"}
                />           
              </div>
            </div>
          )
        }
        if (isWithdrawalHistory && !isWithdrawalDetails) {
          return (
            <div className='w-full h-full 
            flex flex-col justify-start gap-2 
            items-center'>
              <div  className='flex flex-col w-full h-fit items-center'>
                <h6 className='h6 text-n-700 w-fit'>Withdrawal history</h6>
                <div className='w-full flex justify-end'>
                  <div className='w-[27px] h-[27px] 
                  rounded-full flex items-center 
                  justify-center bg-n-900
                  cursor-pointer'
                  onClick={() => {
                    setIsWithdrawalHistory(false)
                    setIsWithdrawalDetails(false)
                  }}>
                    <Image
                      src={cancelWhite}
                      width={24}
                      height={24}
                      alt='delete icon'
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className='w-full h-full gap-[32px] flex flex-col'>
                <div className='w-full h-fit 
                flex flex-col items-start'>
                  <div className='w-fit h-fit flex items-center'>
                    <h4 className='h4 text-n-700'>{currentYear}</h4>
                    <Image
                      src={dropArrowBlack}
                      width={24}
                      height={24}
                      alt='drop arrow icon'
                      priority
                    />
                  </div>
                  <div className='w-fit h-fit gap-[32px] flex'>
                    <div className='w-fit h-fit gap-2 flex items-center'>
                      <p className='p3r text-n-500'>in:</p>
                      <p className='p2r text-n-700'>
                        &#8358;{currentYearInEarnings
                        ? formatter.format(currentYearInEarnings) 
                        : 0}
                      </p>
                    </div>
                    <div className='w-fit h-fit gap-2 flex items-center'>
                      <p className='p3r text-n-500'>out:</p>
                      <p className='p2r text-n-700'>
                        &#8358;{currentYearOutEarnings
                        ? formatter.format(currentYearOutEarnings) 
                        : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <ScrollAreaFrame
                mainClass={`w-full h-[242px]`}
                innerClass={`w-full h-full flex flex-col gap-4`}>
                  {userTransfers?.transfers?.map((transfer) => {
                    const isoString = transfer?.created_at;
                    const formattedDate = format(new Date(isoString), 'MMM d, HH:mm:ss');
                    return (
                      <div className='w-full h-fit flex flex-col
                      justify-between pb-2 items-start gap-2
                      border-b border-n-300 cursor-pointer'
                      onClick={() => {
                        setIsWithdrawalDetails(true)
                      }}>
                        <div className='w-full h-fit items-center flex justify-between'>
                          <p className='p2r text-n-700 w-fit'>
                            Withdrawal
                          </p>
                          <p className='p2b text-n-700 w-fit'>-&#8358;
                            {transfer?.amount
                            ? formatter.format(transfer?.amount) 
                            : 0}
                          </p>
                        </div>
                        <div className='w-full h-fit items-center flex justify-between'>
                          <p className='p3r text-n-500 w-fit'>
                            {formattedDate}
                          </p>
                          <p className={`p3r 
                            ${transfer?.status === "SUCCESSFUL" 
                            ? "text-accent-green-300" 
                            : "text-accent-red-300"} w-fit`}>
                            {transfer?.complete_message}
                          </p>
                        </div>
                      </div>                  
                    )
                  })}
                </ScrollAreaFrame>
              </div>
            </div>
          )
        }
        if (isWithdrawalDetails) {
          return (
            <div className='w-full h-full 
            flex flex-col justify-start gap-2 
            items-center'>
              <div  className='flex flex-col w-full h-fit items-center'>
                <h6 className='h6 text-n-700 w-fit'>Withdrawal details</h6>
                <div className='w-full flex justify-between'>
                <div className='w-[27px] h-[27px] 
                  rounded-full flex items-center 
                  justify-center bg-n-900
                  cursor-pointer'
                  onClick={() => {
                    setIsWithdrawalHistory(true)
                    setIsWithdrawalDetails(false)
                  }}>
                    <Image
                      src={backArrowWhite}
                      width={24}
                      height={24}
                      alt='back icon'
                      priority
                    />
                  </div>
                  <div className='w-[27px] h-[27px] 
                  rounded-full flex items-center 
                  justify-center bg-n-900
                  cursor-pointer'
                  onClick={() => {
                    setIsWithdrawalHistory(false)
                    setIsWithdrawalDetails(false)
                  }}>
                    <Image
                      src={cancelWhite}
                      width={24}
                      height={24}
                      alt='delete icon'
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className='w-full h-fit gap-[32px] flex flex-col'>
                  <div className='w-full h-fit flex flex-col gap-2 items-center justify-center'>
                    <p className='p1b text-n-700'>Withdrawal</p>
                    <h5 className='h5 text-n-700'>-$34.00</h5>
                    <p className='p3r text-accent-green-300'>Successful</p>
                  </div>
                  <div className='flex flex-col gap-4 items-start'>
                    <div className='w-full h-fit pb-2'>
                      <p className='p2b text-n-700'>Withdrawal details</p>
                    </div>
                    <div className='w-full h-fit flex flex-col gap-2'>
                      <div className='w-full h-fit flex justify-between items-center'>
                        <p className='p3r text-n-500'>Recipient details</p>
                        <p  className='p3r text-n-700'>
                          Opay | 8108166172
                        </p>
                      </div>
                      <div className='w-full h-fit flex justify-between items-center'>
                        <p className='p3r text-n-500'>Transaction type</p>
                        <p  className='p3r text-n-700'>
                          Bank account
                        </p>
                      </div>
                      <div className='w-full h-fit flex justify-between items-center'>
                        <p className='p3r text-n-500'>Amount paid</p>
                        <p  className='p3r text-n-700'>
                          $34.00
                        </p>
                      </div>
                      <div className='w-full h-fit flex justify-between items-center'>
                        <p className='p3r text-n-500'>Transaction ref</p>
                        <div className='flex items-center gap-1'>
                          {/* add copy function */}
                          <p  className='p3r text-n-700'>
                            swdfw289489w00
                          </p>
                          <TooltipFrame 
                          label={"Copy"}>
                            <Image
                              src={clipboardBlack}
                              width={14}
                              height={14}
                              alt='clipboard icon'
                              priority
                              className='cursor-pointer'
                            />
                          </TooltipFrame>
                        </div>
                      </div>
                      <div className='w-full h-fit flex justify-between items-center'>
                        <p className='p3r text-n-500'>Transaction date</p>
                        <p  className='p3r text-n-700'>
                          Jul 1, 22:40:14
                        </p>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          )
        }
      }
    }
  }

  if (userInfo && userInfo?.plan === "Master" && userInfo?.adminKey !== secretHash) {
    router.push("/account/profile");
  }  

  if (pathname !== "/account/overview/referral"  && pathname !== "/account/overview/manager") {
    router.push("/account/profile");
  } 
  
  if (userInfo?.plan === "Master"  && pathname !== "/account/overview/manager") {
    router.push("/account/profile");
  } 
  
  if (userInfo?.plan === "Pro"  && pathname !== "/account/overview/referral" || userInfo?.plan === "Free"  && pathname !== "/account/overview/referral") {
    router.push("/account/profile");
  }

  if (!userInfo || userEarningsLoading || !userEarnings?.success  || referralCountLoading || !referralCount?.success || userBeneficiaryLoading ) {
    return (
      <div className='w-full h-full 
      flex flex-col justify-center 
      items-center gap-[32px]'
      ref={ref}>
        {height > 560 && (
          <div className='w-fit h-fit 
          flex flex-col 
          justify-center items-center 
          gap-[20px]'>
            <Skeleton
            className="w-[153px] h-[52px]
            bg-n-300/25 rounded-[8px] relative" />
            <Skeleton
            className="w-[278px] h-[20px]
            bg-n-300/25 rounded-[4px] " />
          </div>
        )}
        <Skeleton
        className="w-[325px] h-[420px]
        bg-n-300/25 rounded-[32px]" />
      </div>
    );
  }

  if (userInfo && !userEarningsLoading && userEarnings?.success && !referralCountLoading && referralCount?.success && !userBeneficiaryLoading) { 
    return (
      <div className='w-full h-full flex flex-col justify-center items-center gap-[32px] relative'
      ref={ref}>
        {comfirmationPopoverOpen && (
          <ComfirmationPopoverButton 
          setComfirmationPopoverOpen={setComfirmationPopoverOpen}
          deleteBeneficiary={deleteBeneficiary}
          beneficiaryId={userBeneficiary?.userBeneficiary?.beneficiaryId}
          email={userInfo?.email}/>
        )}
        <div className='w-[48px] h-[48px] 
        bg-n-900 cursor-pointer rounded-full
        flex justify-center items-center absolute 
        left-8 top-8 max-md:left-4 max-md:top-2 
        transition-all duration-300'>
          <Link href={"/"}>
            <Image
              src={homeWhite}
              width={24}
              height={24}
              alt='cancel icon'
              priority
            />
          </Link>
        </div> 
        {height > 560 && (
          <Header 
          title={userInfo.plan === "Master" ? "Manager" : "Referral"}
          text={"Simple, transparent and enjoyable"}
          />
        )}
        <CardFrame
        wide
        >
          {tabButtonState === "Statistics" && !isReferralList 
          || tabButtonState === "Withdrawal" && !isWithdrawalHistory 
          ||tabButtonState === "Withdrawal" && !isWithdrawalHistory && !isWithdrawalDetails
          ? (
            <TabButtons 
            topLabel={"Statistics"}
            bottomLabel={"Withdrawal"}
            tabButtonState={tabButtonState}
            setTabButtonState={setTabButtonState}
            referral
            />
          ) : null}
          {referralContent()}
        </CardFrame>
      </div>
    )
  }
}

export default page