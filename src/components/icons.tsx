import { cn } from "@/lib/utils";

export const Icons = {
  InternSparkLogo: ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      src="/logo.png"
      alt="InternSpark Logo"
      className={cn("h-10 w-auto", className)}
      {...props}
    />
  ),
  InternAISVG: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="currentColor"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8.49 152H106v-40h-4a24 24 0 0 1 0-48h4V48h24v40h4a24 24 0 0 1 0 48h-4v40Zm88.49 0h-24v-40h-4a24 24 0 0 1 0-48h4V48h24v40h4a24 24 0 0 1 0 48h-4v40Z"
      />
    </svg>
  ),
};
