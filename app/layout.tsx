// app/layout.tsx
import './globals.css'; // only import CSS here, in a server component

export const metadata = {
  title: 'Barbershop Booking',
  description: 'Book your barber appointment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
