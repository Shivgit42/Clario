import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Shantell_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});
const shantellSans = Shantell_Sans({
  subsets: ["latin"],
  variable: "--font-shantell-sans",
});

export const metadata: Metadata = {
  title: "Clario",
  description:
    "Clario is a modern bookmark manager that lets you save, organize, and discover your favorite links with ease and style.",
  keywords: ["bookmark manager", "save links", "organize bookmarks", "Clario"],
  authors: [{ name: "Shivam Rana" }],
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: "#ffffff",
  openGraph: {
    title: "Clario",
    description:
      "Clario is a modern bookmark manager that lets you save, organize, and discover your favorite links with ease and style.",
    url: "https://clario.shivamte.me",
    siteName: "Clario",
    images: [
      {
        url: "https://clario.shivamte.me/og-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Clario Thumbnail",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clario",
    description:
      "Clario is a modern bookmark manager that lets you save, organize, and discover your favorite links with ease and style.",
    images: ["https://clario.shivamte.me/og-thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#F5F5F4] min-h-screen">
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <Toaster richColors={true} position="top-right" />
          <div
            className={`${plusJakartaSans.className} ${shantellSans.variable} overflow-hidden bg-[#F5F5F4] text-[#1F1F1F] dark:bg-[#202020] dark:text-white min-h-screen`}
          >
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
