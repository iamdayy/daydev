"use client";

import dynamic from "next/dynamic";

// Loader client untuk dynamic ssr:false. Alasan: next/dynamic ssr:false tidak boleh di Server Component (layout).
const GlobalBackground = dynamic(() => import("./GlobalBackground"), {
  ssr: false,
});

export default function GlobalBackgroundLoader() {
  return <GlobalBackground />;
}
