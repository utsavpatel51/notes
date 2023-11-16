import React from "react";
import Navbar from "@/app/(marketing)/_components/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <Navbar />
      <main className="min-h-full pt-40 bg-background dark:bg-[#1f1f1f]">
        {children}
      </main>
    </div>
  );
}
