import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EstateVision — CCTV footage into structured intelligence",
  description:
    "Turn property CCTV footage into structured, exportable event data. Save hours, export proof, run your property smarter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `dark` is fixed: EstateVision has no light theme, and pinning the class
      // keeps every shadcn `dark:` variant resolved on the first paint.
      className={`dark ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#0A0A0A] text-slate-50">
        <AuthProvider>
          {children}
          <ConfirmationModal />
          <Toaster
            theme="dark"
            position="top-right"
            duration={5000}
            closeButton
            toastOptions={{
              classNames: {
                toast:
                  "!rounded-2xl !border !border-slate-800 !bg-slate-900/90 !text-slate-50 !backdrop-blur-md",
                description: "!text-slate-400",
                error: "!border-[#ff3333]/40",
                success: "!border-[#00f0ff]/40",
                warning: "!border-[#f59e0b]/40",
                closeButton:
                  "!border-slate-700 !bg-slate-800 !text-slate-300 hover:!text-slate-50",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
