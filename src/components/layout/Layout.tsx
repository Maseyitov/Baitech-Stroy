import { Outlet, ScrollRestoration, useLocation, useMatches } from "react-router-dom";
import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import PageScope from "@/components/motion/PageScope";
import Header from "./Header";
import Footer from "./Footer";
import FloatingChat from "./FloatingChat";

export default function Layout() {
  const { pathname } = useLocation();
  // Маршрут может попросить скрыть футер: { handle: { hideFooter: true } }
  const hideFooter = useMatches().some(
    (m) => (m.handle as { hideFooter?: boolean } | undefined)?.hideFooter,
  );

  return (
    <>
      <Header />
      {/* Плавный переход между страницами */}
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="pt-[60px]"
      >
        <PageScope path={pathname}>
          <Outlet />
        </PageScope>
      </motion.main>
      {!hideFooter && <Footer />}
      <FloatingChat />
      <ScrollRestoration />
    </>
  );
}
