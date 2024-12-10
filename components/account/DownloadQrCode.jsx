"use client"

import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import QRCode from 'qrcode';
import Image from "next/image";
import { referralCard, xReferralCard } from "@/public";
import { cancelBlack } from "@/public/icons/black";


const DownloadQrCode = ({userInfo, setShowReferralCard}) => {
  const cardRef = useRef(null);
  const [qrCodeSrc, setQrCodeSrc] = useState("");;
  
  const url = `http://localhost:3000?referral=${userInfo?.referrerId}`;
  
  // Generate a QR code as a data URL
  useEffect(() => {   
    if (userInfo) {
      QRCode.toDataURL(url, (err, src) => {
        if (err) {
          console.error('Error generating QR Code', err);
        } else {
          setQrCodeSrc(src)
          console.log('QR Code Data URL:', src); // Use this in an <img> tag
        }
      });
    }
  }, [userInfo])


  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { pixelRatio: 4 }); // Higher quality
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "card.png";
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };


  if (userInfo && qrCodeSrc) {
    return (
      <div className="fixed top-0 left-0 
      w-full h-full flex justify-center 
      items-center backdrop-blur-lg z-50">    
        <div className="flex flex-col 
        justify-center items-end 
        bg-n-100 shadow-lg border-2 
        border-n-300 relative px-4 rounded-[16px] max-sm:scale-50 max-md:scale-75">
          <div className='w-[24px] h-[24px] 
          cursor-pointer relative right-4 my-2'
          onClick={() => setShowReferralCard(false)}>
            <Image
              src={cancelBlack}
              width={24}
              height={24}
              alt='cancel icon'
              priority
            />
          </div>
          <div ref={cardRef} 
          className='w-[504px] h-[319px] bg-white relative'>
            <Image 
              src={xReferralCard} 
              width={504} 
              height={319} 
              alt='Referral card'
              priority
              />
            <Image 
              src={qrCodeSrc} 
              width={150} 
              height={150} 
              alt='QR code'
              priority
              className="border-2 rounded-[8px] border-n-900 absolute bottom-8 right-8"
              />
          </div>
          <div className="w-full flex justify-center">
            <button className="l3b text-n-700 border border-n-500 bg-white
            hover:text-n-700 text-center w-fit h-fit px-4 py-2 rounded-[8px] my-2"
            onClick={handleDownload}>
              Download
            </button>
          </div>
        </div> 
      </div>
    )
  }
}

export default DownloadQrCode