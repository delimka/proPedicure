"use client";

import * as React from "react";
import { scrollToSection } from "@/helpers/utils.js";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import logo from "@/assets/logo.jpg";
import { useAuth } from "@/contexts/AuthContext";

// const components: { title: string; href: string; description: string }[] = [
//   {
//     title: "Alert Dialog",
//     href: "/docs/primitives/alert-dialog",
//     description:
//       "A modal dialog that interrupts the user with important content and expects a response.",
//   },
//   {
//     title: "Hover Card",
//     href: "/docs/primitives/hover-card",
//     description:
//       "For sighted users to preview content available behind a link.",
//   },
//   {
//     title: "Progress",
//     href: "/docs/primitives/progress",
//     description:
//       "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
//   },
//   {
//     title: "Scroll-area",
//     href: "/docs/primitives/scroll-area",
//     description: "Visually or semantically separates content.",
//   },
//   {
//     title: "Tabs",
//     href: "/docs/primitives/tabs",
//     description:
//       "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
//   },
//   {
//     title: "Tooltip",
//     href: "/docs/primitives/tooltip",
//     description:
//       "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
//   },
// ];

export default function NavMenu() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const adminComponents = [
    {
      title: t("admin-bookings-title"),
      href: "/admin/bookings",
      description: t("admin-bookings-description"),
    },
    {
      title: t("admin-services-title"),
      href: "/admin/services",
      description: t("admin-services-description"),
    },
    {
      title: t("admin-gallery-title"),
      href: "/admin/gallery",
      description: t("admin-gallery-description"),
    },
    {
      title: t("admin-users-title"),
      href: "/admin/users",
      description: t("admin-users-description"),
    },
  ];

  return (
    <div className="flex justify-between items-center px-4 py-2 lg:px-20 bg-green-green_bg/50">
      <NavigationMenu className="z-20">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="pl-0">
              {t("footer-general")}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white">
              <img
                src={logo}
                alt="Logo"
                className="absolute right-4 bottom-4 w-28 h-28 block lg:hidden"
              />
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-3 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <img src={logo} className="hidden lg:block" />
                      {/* <div className="mb-2 mt-4 text-lg font-medium">
                        {t("home")}
                      </div> */}
                      {/* <p className="text-sm leading-tight text-muted-foreground">
                        {t("footer-description")}
                      </p> */}
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem
                  as="button"
                  onClick={() => scrollToSection("about")}
                  title={t("footer-medical-pedicure")}
                >
                  {t("about-description")}
                </ListItem>
                <ListItem href="/gallery" title={t("gallery")}>
                  {t("admin-gallery-description")}
                </ListItem>
                <ListItem
                  as="button"
                  onClick={() => scrollToSection("services")}
                  title={t("footer-booking")}
                >
                  {t("services-description")}
                </ListItem>
                <ListItem title={t("footer-aftercare")}>
                  {t("aftercare-description")}
                </ListItem>

                <ListItem
                  as="button"
                  onClick={() => scrollToSection("pricelist")}
                  title={t("price-list-title")}
                >
                  {t("pricelist-description")}
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* <NavigationMenuItem>
            <NavigationMenuTrigger className="pl-0">
              Components
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 bg-white md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem> */}

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/booking"
              className={navigationMenuTriggerStyle()}
            >
              {t("booking")}
            </NavigationMenuLink>
          </NavigationMenuItem>

          {user?.app_metadata?.role === "super-admin" && (
            <NavigationMenuItem className="border-l-black">
              <NavigationMenuTrigger className="pl-0">
                {t("admin-panel")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 bg-white md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {adminComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex flex-row align-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width="24"
          height="24"
          fill="green"
        >
          <path d="..." />
        </svg>
        <a
          href="tel:+37258503977"
          className="mr-2 text-sm text-green-800 hover:underline"
        >
          +372 5850 3977
        </a>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
