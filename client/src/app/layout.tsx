import "./globals.css";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Top Ten Lists!",
  description: "Client application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <ThemeToggle />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
