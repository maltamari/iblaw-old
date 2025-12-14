import { cn } from "@/lib/utils";

interface Props{
  className?:string
}

const CheckIcon = ({className}:Props) => (
    <div className={cn("w-6 h-6 rounded-full bg-main flex items-center justify-center shrink-0 mt-0.5",className)}>
      <svg className={cn("w-3.5 h-3.5 text-white",className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
export default CheckIcon