import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "./globals.css";
import FloatingContactDock from "../components/FloatingContactDock";

export const metadata = {
  title: "VELPAW MOUNTS | Marine Mounting Systems",
  description:
    "Marine-grade mounting systems for fish finders, sonar transducers, tablets and cameras, with OEM and ODM support.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingContactDock />
      </body>
    </html>
  );
}
