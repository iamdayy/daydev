import data from "@/data/testimonial.json";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  segment: string;
  segmentColor: string;
  avatar: string;
  avatarBg: string;
  stars: number;
  text: string;
}

export const testimonials: Testimonial[] = data as Testimonial[];
