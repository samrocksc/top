import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frontend Admin',
  description: 'Admin panel for the application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
