"use client"
import { useBreakpoints } from "@/hooks/use-breakpoints"
import { TestimonialsMobile } from "./testimonials/testimonials-mobile"
import { TestimonialsTablet } from "./testimonials/testimonials-tablet"
import { TestimonialsDesktop } from "./testimonials/testimonials-desktop"

interface ContentItem {
  key: string
  value: string
}

interface Testimonial {
  id?: string
  client_name: string
  pet_name: string
  pet_breed: string
  rating: number
  content: string
  image_url?: string
}

export function Testimonials({ content, testimonials }: { content: ContentItem[], testimonials: Testimonial[] }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoints()

  return (
    <>
      {isMobile && <TestimonialsMobile content={content} testimonials={testimonials} />}
      {isTablet && <TestimonialsTablet content={content} testimonials={testimonials} />}
      {isDesktop && <TestimonialsDesktop content={content} testimonials={testimonials} />}
    </>
  )
}

