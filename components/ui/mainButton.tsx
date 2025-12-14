import React from "react";
import { Button } from "./button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  left?: LucideIcon|React.FC<React.SVGProps<SVGSVGElement>>;
  right?: LucideIcon |React.FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
  spanClass?:string
}

function MainButton({
  text = "Schedule A Meeting",
  left: Left,
  right: Right,
  className,
  spanClass,
  children,
  ...props
}: Props) {
  return (
    <Button
      {...props}
      className={cn(
        "h-15 flex items-center justify-center bg-main text-white px-6 py-3 rounded-full transition-transform duration-300 hover:text-main hover:bg-gray-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-400/20",
        className
      )}
    >
      <div className="flex items-center space-x-2">

        {Left && <Left />}

        <span className={cn("font-medium capitalize text-center",spanClass)}>
          {children ? children : text}
        </span>

        {Right && <Right  />}
      </div>
    </Button>
  );
}

export default MainButton;
