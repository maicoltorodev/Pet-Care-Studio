"use client"
import { useBreakpoints } from "@/hooks/use-breakpoints"
import { BeforeAfterMobile } from "./results/results-mobile"
import { BeforeAfterTablet } from "./results/results-tablet"
import { BeforeAfterDesktop } from "./results/results-desktop"

interface ContentItem {
  key: string
  value: string
}

interface Transformation {
  id: string
  name: string
  breed: string
  before_image_url?: string
  after_image_url?: string
  is_visible: boolean
}

export function BeforeAfter({ content, transformations }: { content: ContentItem[], transformations: Transformation[] }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoints()

  return (
    <>
      {isMobile && <BeforeAfterMobile content={content} transformations={transformations} />}
      {isTablet && <BeforeAfterTablet content={content} transformations={transformations} />}
      {isDesktop && <BeforeAfterDesktop content={content} transformations={transformations} />}
    </>
  )
}

