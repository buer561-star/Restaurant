import type { ReactNode } from "react";
import "./globals.css";

// The locale layout renders <html> and <body>; this root layout only passes children through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
