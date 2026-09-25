"use client";

import dynamic from "next/dynamic";

// Chunk terpisah tanpa ssr:false: HeroComputer punya guard `mounted` sehingga
// R3F/Canvas hanya dirender setelah hidrasi; server mendapat fallback loading
// dengan tinggi sama (tanpa layout shift). ssr enabled agar SSR tetap merender
// rangka fallback.
const HeroComputer = dynamic(() => import("./HeroComputer"));

export default function HeroComputerLoader() {
  return <HeroComputer />;
}