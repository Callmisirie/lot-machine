"use client"

import AccountPill from '@/components/account/AccountPill'
import Button from '@/components/account/Button'
import CardFrame from '@/components/account/CardFrame'
import DualButton from '@/components/account/DualButton'
import Header from '@/components/account/Header'
import Input from '@/components/account/Input'
import TabButtons from '@/components/account/TabButtons'
import { clipboardBlack, dropArrowBlack } from '@/public/icons/black'
import { backArrowWhite, cancelWhite, dropArrowWhite } from '@/public/icons/white'
import Image from 'next/image'
import React, { useState } from 'react'

const page = () => {
  const [tabButtonState, setTabButtonState] = useState("Statistics")
  const [isAddedBank, setIsAddedBank] = useState(true)
  const [isReferralList, setIsReferralList] = useState(false)
  const [isWithdrawalHistory, setIsWithdrawalHistory] = useState(false)
  const [isWithdrawalDetails, setIsWithdrawalDetails] = useState(false)

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
                <p className='p2b text-n-500'>$124.00</p>
              </div>
              <p className='p3b text-n-900 cursor-pointer'
              onClick={() => {
                setIsReferralList(true)
              }}>
                Show referral list
              </p>
            </div>
            <div className='flex w-full h-fit justify-between items-start'>
              <div className='flex flex-col 
              w-fit pr-2 items-start
              border-n-300 border-r'>
                <h5 className='h5 text-n-700'>Referral</h5>
                <div className='flex flex-col w-fit h-fit'>
                  <div className='flex w-fit h-fit gap-1 items-center'>
                    <h4 className='h4 text-n-500'>Total</h4>
                    <h3 className='h3 text-n-300'>18</h3>
                  </div>
                  <div className='flex w-fit h-fit gap-1 items-center'>
                    <h6 className='h6 text-n-500'>Active</h6>
                    <h5 className='h5 text-n-300'>9</h5>
                  </div>
                </div>
              </div>
              <div className='flex flex-col 
              w-fit h-fit items-start justify-start'>
                <h6 className='h6 text-n-700'>Nov earning</h6>
                <h3 className='h3 text-n-500'>$62.00</h3>
              </div>
            </div>
            <div className='flex flex-col w-full h-fit'>
              <div className='flex w-fit h-fit 
              justify-start items-center gap-1'>
                <h2 className='h2 text-n-300'>20%</h2>
                <div className='w-fit h-fit flex items-center gap-1'>
                  <p className='p2b text-n-500'>
                    Referral split -
                  </p>
                  <p className='p2b text-n-700'>
                    Active
                  </p>

                </div>
              </div>
              <div className='flex justify-between items-end'>
                <div className='flex w-fit h-fit 
                flex-col items-start'>
                  <h4 className='h4 text-n-900'>Referral link</h4>
                  <p className='p3r text-n-500'>
                    lotmachine.com/?xxxxxxxxxxxxxxxxxxx
                  </p>
                </div>
                <Image 
                src={clipboardBlack} 
                width={24} 
                height={24} 
                alt="clipboard icon" 
                className="" 
                priority
                /> 
              </div>
            </div>
          </div>
        )
      }
      if (isReferralList) {
        return (
          <div className='w-full h-full 
          flex flex-col justify-start gap-2 
          items-center'>
            <div  className='flex flex-col w-full h-fit items-center'>
              <h6 className='h6 text-n-700 w-fit'>Referral list</h6>
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
                  <p className='p1b text-n-700'>18</p>
                </div>
                <div className='w-fit h-fit gap-2 flex items-center'>
                  <h6 className='h6 text-n-700'>Active</h6>
                  <p className='p3r text-n-700'>9</p>
                </div>
              </div>
              <div className='w-full h-full flex flex-col gap-4'>
                <div className='w-full h-fit flex 
                justify-between pb-2 items-start 
                border-b border-n-300'>
                  <p className='p2r text-n-700'>
                    kensirie8296
                  </p>
                  <p className='p3r text-accent-green-300'>Active</p>
                </div>
                <div className='w-full h-fit flex 
                justify-between pb-2 items-start 
                border-b border-n-300'>
                  <p className='p2r text-n-700'>
                    lohymn9286
                  </p>
                  <p className='p3r text-n-500'>Inactive</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
    if (tabButtonState === "Withdrawal") {
      if (!isAddedBank && !isWithdrawalHistory) {
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
                <p className='p2b text-n-500'>$124.00</p>
              </div>
              <p className='p3b text-n-900 cursor-pointer'
              onClick={() => {
                setIsWithdrawalHistory(true)
              }}>
                Withdrawal history
              </p>
            </div>
            <div className='flex flex-col gap-2 w-fit h-fit'>
              <Input 
              label={"Country"}
              value={"NG"}
              />
              <Input 
              label={"Bank"}
              value={"Opay"}
              />
              <Input 
              label={"Account number"}
              type={"number"}
              />
            </div>
            <div 
            className='w-full'
            onClick={() => {
              setIsAddedBank(true)
            }}>
              <DualButton />
            </div>
          </div>
        )
      }
      if (isAddedBank && !isWithdrawalHistory) {
        return (
          <div className='w-full h-full 
          flex flex-col justify-between 
          items-center'>
            <div className='flex w-full h-[95px] 
            items-start flex-col gap-2'>
              <div className='w-fit flex flex-col items-start 
              border-b border-n-300'>
                <h6 className='h6 text-n-700'>Balance</h6>
                <h2 className='h3 text-n-500'>$124.00</h2>
              </div>
              <p className='p3b text-n-900 cursor-pointer'
              onClick={() => {
                setIsWithdrawalHistory(true)
              }}>
                Withdrawal history
              </p>
            </div>
            <div 
            className='cursor-pointer'
            onClick={() => {
              setIsAddedBank(false)
            }}>
              <AccountPill 
              bankName={"Opay"}
              accountNumber={"8108166172"}
              />
            </div>
            <Button 
            label={"Withdraw"}
            />
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
                  <h4 className='h4 text-n-700'>2024</h4>
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
                    <p className='p2r text-n-700'>$142.00</p>
                  </div>
                  <div className='w-fit h-fit gap-2 flex items-center'>
                    <p className='p3r text-n-500'>out:</p>
                    <p className='p2r text-n-700'>$62.00</p>
                  </div>
                </div>
              </div>
              <div className='w-full h-full flex flex-col gap-4'>
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
                    <p className='p2b text-n-700 w-fit'>
                      -$34.00
                    </p>
                  </div>
                  <div className='w-full h-fit items-center flex justify-between'>
                    <p className='p3r text-n-500 w-fit'>
                      Jul 1, 22:40:14
                    </p>
                    <p className='p3r text-accent-green-300 w-fit'>
                      Successful
                    </p>
                  </div>
                </div>
                <div className='w-full h-fit flex flex-col
                justify-between pb-2 items-start gap-2
                border-b border-n-300'>
                  <div className='w-full h-fit items-center flex justify-between'>
                    <p className='p2r text-n-700 w-fit'>
                      Withdrawal
                    </p>
                    <p className='p2b text-n-700 w-fit'>
                      -$30.00
                    </p>
                  </div>
                  <div className='w-full h-fit items-center flex justify-between'>
                    <p className='p3r text-n-500 w-fit'>
                      Sep 1, 13:44:54
                    </p>
                    <p className='p3r text-accent-green-300 w-fit'>
                      Successful
                    </p>
                  </div>
                </div>
              </div>
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
                  setIsWithdrawalHistory(false)
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
                        <p  className='p3r text-n-700'>
                          swdfw289489w00
                        </p>
                        <Image
                          src={clipboardBlack}
                          width={14}
                          height={14}
                          alt='clipboard icon'
                          priority
                        />
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

  return (
    <div className='w-full h-fit flex flex-col justify-center items-center gap-[32px]'>
      <Header 
      title={"Referral"}
      text={"Simple, transparent and enjoyable"}
      />
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

export default page