import type { Metadata } from "next";
import { Poppins } from "next/font/google"
import "./globals.css";
import StoreProvider from "@/components/storeProvider"; 
import AuthInitializer from "@/components/shared/AuthInitializer";




const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})


export const metadata: Metadata = {
  title: "Bheema Infotech",
  description: "Advanced Human Resource Management System for Bheema Infotech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
     <body className="h-screen overflow-hidden flex flex-col bg-[#F8FAFC]">
      
        <StoreProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </StoreProvider>
      </body>
    </html>
  );
}