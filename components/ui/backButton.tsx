import Link from "next/link"
import { Button } from "./button"

function BackButton({ text = "dashboard" }: { text?: string }) {
  return (
    <>
      {/* Back Button */}
      <Link href={`/dashboard${text !== "dashboard" ? `/${text}` : ""}`}>
        <Button className="flex items-center gap-2 bg-[#195889] hover:bg-[#4c7da3] px-6 py-3 rounded-full transition-all duration-300 hover:-translate-x-1">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium capitalize">Back to {text}</span>
        </Button>
      </Link>
    </>
  )
}

export default BackButton