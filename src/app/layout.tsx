import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "雾中风景 — Digital Garden",
  description: "A personal academic homepage and interlinked note garden.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased selection:bg-indigo-100 selection:text-indigo-700">
        {children}
      </body>
    </html>
  );
}
