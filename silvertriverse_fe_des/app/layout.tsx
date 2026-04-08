import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import NavigationShell from "./components/NavigationShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SilverTriverse | Royal Edition",
  description: "Experience the luxury of the digital vanguard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-gold selection:text-black bg-royal-blue overflow-hidden`}>
        <div className="flex h-screen w-screen relative">
          <NavigationShell />
          {/* Main Content Area */}
          <main className="flex-1 h-full overflow-y-auto overflow-x-hidden min-w-0 pb-32 md:pb-0 relative scroll-smooth">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
