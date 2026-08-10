import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 transition-colors outline-none",
        "placeholder:text-slate-500",
        "hover:border-slate-700",
        "focus-visible:border-[#00f0ff]/60 focus-visible:ring-2 focus-visible:ring-[#00f0ff]/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[#ff3333]/60 aria-invalid:ring-2 aria-invalid:ring-[#ff3333]/30",
        className
      )}
      {...props}
    />
  );
}

export { Input };
