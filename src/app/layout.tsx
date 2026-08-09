import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Платформа Сквозной Продуктовой Аналитики & Управления Релизами",
  description: "Система сквозной продуктовой аналитики и автоматического планирования",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className="antialiased bg-[#0d1117] text-[#c9d1d9] min-h-screen">
        {children}
      </body>
    </html>
  );
}
