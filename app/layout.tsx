import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nivaran AI — The Review-to-Recovery OS",
  description: "An explainable AI recovery system that turns public reviews into safe decisions, operational action, human-approved responses and verifiable outcomes.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
