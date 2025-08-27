"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import {
  IoIosHome,
  IoIosInformationCircle,
  IoIosPricetags,
  IoIosLogIn,
  IoIosArrowDown,
} from "react-icons/io";
import { BsCalendar2Event } from "react-icons/bs";
import { FaSpa } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";
import { Menu } from "lucide-react";
import logo from "@/assets/logo-Photoroom2.png";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState } from "react";
import { HashLink } from "react-router-hash-link";
import { useTranslation } from "react-i18next";

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const handleLinkClick = () => setIsOpen(false);
  const { t } = useTranslation();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }
  const adminComponents = [
    {
      title: t("admin-bookings-title"),
      href: "/admin/bookings",
    },
    {
      title: t("admin-services-title"),
      href: "/admin/services",
    },
    {
      title: t("admin-gallery-title"),
      href: "/admin/gallery",
    },
    {
      title: t("admin-users-title"),
      href: "/admin/users",
    },
  ];

  return (
    <div className="bg-green-bg text-white text-sm px-4 py-2 flex justify-between items-center lg:px-20">
      <Link to="/">
        <img src={logo} alt="Logo" className="w-14 h-14" />
      </Link>

      <div className="hidden md:flex items-center gap-4">
        <a href="#">
          <FaFacebook size={15} />
        </a>
        <a
          href="https://wa.me/37258503977"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:underline"
        >
          <FaWhatsapp size={15} />
        </a>
        <LanguageSwitcher />
        {user ? (
          <>
            <span>{user.user_metadata?.full_name || user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-black py-1 flex flex-row gap-1 items-center justify-between px-2 rounded"
            >
              {t("logout")} <GrLogout />
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="flex flex-row gap-2 items-center bg-white py-1 px-2 rounded text-black">
              {t("login")} <IoIosLogIn size={20} />
            </button>
          </Link>
        )}
      </div>

      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 rounded-md bg-white text-black"
        >
          <Menu size={28} />
        </button>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar Panel */}
            <div className="fixed top-0 right-0 h-full w-72 bg-emerald-800 text-white shadow-xl rounded-l-xl p-6 flex flex-col z-50 transition-all duration-300 ease-in-out">
              {/* Header */}
              <div className="">
                {/* Language & Auth Button Group */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <LanguageSwitcher />

                  {user ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        handleLinkClick();
                      }}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      <GrLogout size={16} />
                      {t("logout")}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      <IoIosLogIn size={18} />
                      {t("login")}
                    </Link>
                  )}
                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white text-2xl hover:text-gray-200 transition"
                    aria-label="Close menu"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-2 flex-grow">
                <HashLink
                  smooth
                  to="/#hero"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-emerald-700 transition text-base"
                >
                  <IoIosHome size={20} />
                  {t("home")}
                </HashLink>

                <a
                  href="/booking"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-emerald-700 transition text-base"
                >
                  <BsCalendar2Event size={20} />
                  {t("booking")}
                </a>

                <HashLink
                  smooth
                  to="/#about"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-emerald-700 transition text-base"
                >
                  <IoIosInformationCircle size={20} />
                  {t("about")}
                </HashLink>

                <HashLink
                  smooth
                  to="/#services"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-emerald-700 transition text-base"
                >
                  <FaSpa size={20} />
                  {t("services-title")}
                </HashLink>

                <HashLink
                  smooth
                  to="/#pricelist"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-emerald-700 transition text-base"
                >
                  <IoIosPricetags size={20} />
                  {t("price-list-title")}
                </HashLink>

                {/* Admin Panel */}
                <SidebarProvider>
                  <SidebarMenu>
                    <Collapsible defaultOpen={false}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="flex items-center gap-3 p-3 rounded-md hover:bg-emerald-700 transition text-base">
                            <IoIosArrowDown size={20} />
                            {t("admin-panel")}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-5 mt-1 space-y-1 text-sm">
                          <ul>
                            {adminComponents.map((item) => (
                              <li key={item.href}>
                                <a
                                  href={item.href}
                                  className="block py-1 hover:underline"
                                >
                                  {item.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  </SidebarMenu>
                </SidebarProvider>
              </nav>

              {/* Footer Buttons */}
              <div className="pt-6">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-base transition"
                  >
                    <GrLogout size={20} />
                    {t("logout")}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-base transition"
                  >
                    <IoIosLogIn size={20} />
                    {t("login")}
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopNav;
