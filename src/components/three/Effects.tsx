"use client";

import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";

// TWEAK sinematik: bokehScale 1.5-3 lembut, 4+ dramatis. intensity 0.2-0.5 aman.
// threshold 0.6-0.8: hanya aksen emissive HDR (ring amber, wire teal) yang pendar.
export default function Effects() {
  return (
    <EffectComposer multisampling={4}>
      {/* Fokus terkunci di inti (origin), panel latar blur lembut. */}
      <DepthOfField
        target={[0, 0, 0]}
        focalLength={0.02}
        bokehScale={2.4}
        height={480}
      />
      {/* Bloom ambang tinggi: kaca dan panel putih tetap bersih. */}
      <Bloom
        mipmapBlur
        intensity={0.4}
        luminanceThreshold={0.75}
        luminanceSmoothing={0.15}
      />
    </EffectComposer>
  );
}
