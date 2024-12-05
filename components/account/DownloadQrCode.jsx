"use client"

import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import QRCode from 'qrcode';
import Image from "next/image";
import { lmImage, lmLogo } from "@/public";


const DownloadQrCode = ({userInfo, userInfoLoading}) => {
  const cardRef = useRef(null);
  const [qrCodeSrc, setQrCodeSrc] = useState("");;
  
  const url = `http://localhost:3000?referral=${userInfo?.referrerId}`;
  
  // Generate a QR code as a data URL
  useEffect(() => {   
    if (userInfo && !userInfoLoading) {
      QRCode.toDataURL(url, (err, src) => {
        if (err) {
          console.error('Error generating QR Code', err);
        } else {
          setQrCodeSrc(src)
          console.log('QR Code Data URL:', src); // Use this in an <img> tag
        }
      });
    }
  }, [userInfoLoading, userInfo])


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


  if (userInfo && !userInfoLoading && qrCodeSrc) {
    return (
      <div className="w-fit h-fit">     
        <div ref={cardRef} 
        className='w-[504px] h-[319px] bg-white'>
          <div className='w-full h-full relative overflow-clip
          bg-custom-opacity-25 flex p-[32px]
          justify-between z-20'>
          <div className='absolute -left-[185px] top-[0px] z-10'>
            <Image 
              src={lmImage} 
              width="auto" 
              height="auto" 
              alt='lm bg image'
              className="w-[370px] h-[264px]"
              priority
              />         
          </div>
            <div className='flex flex-col 
            justify-between items-start w-fit h-full'>
              <div className='flex flex-col w-fit h-fit'>
                <div className='flex items-end'>
                  <Image 
                    src={lmLogo} 
                    width={48} 
                    height={48} 
                    alt='logo'
                    priority
                    />
                    <h3 className='h6 text-n-700'>Lot machine</h3>     
                </div>
                <div className='w-[273px] h-[73px]'>
                  <h6 className='h6 text-n-700'>Enjoy the full 
                    <span className='h4'>{" "}benefits{" "}</span>
                    of your trading 
                    <span className='h4'>{" "}positions.</span></h6>
                </div>
              </div>
              <p className='p1b text-n-900'>lotmachine.com</p>
            </div>
              <div className='flex flex-col items-end justify-end'>
                <p className='p3b text-n-500 w-[150px] h-[30px]'>
                  Scan Qr code for 50% off on first monthly plan payment.
                </p>     
                <Image 
                  src={qrCodeSrc} 
                  width={150} 
                  height={150} 
                  alt='QR code'
                  priority
                  />
              </div>
            </div>
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