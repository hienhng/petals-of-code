import type { Metadata } from "next";
import "./globals.css";
import "./homepage.css";
import "./decoration-animations.css";
import "./letter-scenery.css";
import "./maker.css";
import "./garden-size.css";
import '@fontsource/press-start-2p/latin-400.css';
import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/latin-600.css';
import '@fontsource/be-vietnam-pro/vietnamese-600.css';

export const metadata: Metadata = {
  title: "Petals of Code — Một lời chúc, một bông hoa",
  description: "Gửi một chút yêu thương bằng những bông hoa pixel. Chào mừng ngày Phụ nữ Việt Nam 20/10 cùng LTPC.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
