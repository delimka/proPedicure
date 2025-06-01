"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Footer,
  FooterColumn,
  FooterBottom,
  FooterContent,
} from "@/components/ui/footer";
import logo from "@/assets/logo-Photoroom2.png";
import { FaFacebook } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function FooterSection() {
  const { t } = useTranslation();

  return (
    <footer className="w-full px-4 relative bottom-0 bg-green-bg text-white">
      <div className="mx-auto max-w-container">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="w-10 h-10" />
                <h3 className="text-xl font-bold">Pro Pedicure</h3>
              </div>
              <p className="text-sm mt-2">{t("footer-description")}</p>
              <div className="flex gap-2 mt-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-white transition"
                >
                  <FaFacebook size={20} />
                </a>
              </div>
            </FooterColumn>

            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">
                {t("footer-general")}
              </h3>
              <a
                href="/services"
                className="text-sm text-muted-foreground hover:text-white transition"
              >
                {t("footer-medical-pedicure")}
              </a>
              <a
                href="/booking"
                className="text-sm text-muted-foreground hover:text-white transition"
              >
                {t("footer-booking")}
              </a>
              <a
                href="/aftercare"
                className="text-sm text-muted-foreground hover:text-white transition"
              >
                {t("footer-aftercare")}
              </a>
            </FooterColumn>

            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">
                {t("footer-resources")}
              </h3>
              <a
                href="/blog"
                className="text-sm text-muted-foreground hover:text-white transition"
              >
                {t("footer-blog")}
              </a>
              <a
                href="/guides"
                className="text-sm text-muted-foreground hover:text-white transition"
              >
                {t("footer-guides")}
              </a>
              <a
                href="/faq"
                className="text-sm text-muted-foreground hover:text-white transition"
              >
                FAQ
              </a>
            </FooterColumn>

            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">
                {t("footer-contact")}
              </h3>
              <a
                href="mailto:irina@info.com"
                className="text-sm text-muted-foreground hover:text-white transition"
              >
                irina@info.com
              </a>
              <a
                href="tel:+37258503977"
                className="text-sm text-muted-foreground hover:text-white transition"
              >
                +372 58503977
              </a>
            </FooterColumn>
          </FooterContent>

          <FooterBottom>
            <div>© 2025 Pro Pedicure</div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/delimka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                {t("made-by")} <span className="font-semibold">@delimka</span>
              </a>

              <ModeToggle />
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
