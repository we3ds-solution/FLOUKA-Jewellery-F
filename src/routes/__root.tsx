import { DirectionProvider } from "@radix-ui/react-direction";
import { useDir } from "@/lib/i18n";
import { LANG_BOOT_SCRIPT } from "@/lib/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { NotFoundPage, RouteErrorPage } from "@/components/store/failure-page";
import { SiteShell } from "@/components/store/site-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from '@/components/ui/sonner';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Floukaa — فلوكة للإكسسوارات والهدايا" },
      { name: "description", content: "إكسسوارات وهدايا مختارة بذوق من بورسعيد لكل مصر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "oklch(0.336675 0.077948 253.269)" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap" },
      
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: RouteErrorPage,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.theme==='dark'||(!localStorage.theme&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}" }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const dir = useDir();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <DirectionProvider dir={dir}>
        <TooltipProvider>
          <SiteShell>
            <Outlet />
          </SiteShell>
          <Toaster />
        </TooltipProvider>
      </DirectionProvider>
    </QueryClientProvider>
  );
}
