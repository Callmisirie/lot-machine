"use client"

import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import QRCode from 'qrcode';
import Image from "next/image";
import { referralCard, xReferralCard } from "@/public";


const DownloadQrCode = ({userInfo}) => {
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
      <div className="w-fit h-fit absolute">     
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
        <button className="p2b text-n-500 hover:text-n-700 text-center w-full"
        onClick={handleDownload}>
          Download referral card
        </button>
      </div>
    )
  }
}

export default DownloadQrCode