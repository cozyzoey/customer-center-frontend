import React from "react";
import Image from "next/image";

export default function ResponsiveLogoImg() {
  return (
    <Image
      src="/icons/logo.png"
      layout="responsive"
      width={578}
      height={413}
      priority={true}
    />
  );
}
