"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

const footerLinks = {
  product: [
    { href: "/#features", labelKey: "link_features" },
    { href: "/#difference", labelKey: "link_examples" },
    { href: "/#cta", labelKey: "link_pricing" },
  ],
  company: [
    { href: "#", labelKey: "link_about" },
    { href: "#", labelKey: "link_blog" },
    { href: "#", labelKey: "link_contact" },
  ],
  legal: [
    { href: "/terms", labelKey: "link_terms" },
    { href: "/privacy", labelKey: "link_privacy" },
  ],
};

const socialLinks = [
  { href: "#", icon: <Twitter className="w-5 h-5" /> },
  { href: "#", icon: <Github className="w-5 h-5" /> },
  { href: "#", icon: <Linkedin className="w-5 h-5" /> },
];

export const Footer = () => {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-screen-xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h3 className="text-xl font-bold">Ectro</h3>
            <p className="mt-2 text-muted-foreground max-w-xs text-sm">
              {t("slogan")}
            </p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold">{t("productColumn")}</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-primary"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">{t("companyColumn")}</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-primary"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">{t("legalColumn")}</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-primary"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 py-8  border-t">
        <div className="flex flex-col sm:flex-row justify-between items-center  max-w-screen-xl mx-auto px-6">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Ectro. {t("copyright")}
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary"
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
