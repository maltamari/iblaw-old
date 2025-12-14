import { cn } from "@/lib/utils"
type Props={
className?:string
}
function RightArrow({className}:Props) {
  return (
        <svg className={cn("w-5 h-5",className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
  )
}

export default RightArrow