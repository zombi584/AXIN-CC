import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AXIN.CC — Luau Protection Workbench",
  description: "A Luau source protection and build workbench.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
