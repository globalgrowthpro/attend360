import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Globe, Phone } from "lucide-react";

import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Attend360 Attendance" },
      {
        name: "description",
        content: "Sign in to Attend360 to check in, review attendance or manage your organization.",
      },
      { property: "og:title", content: "Sign in — Attend360 Attendance" },
      { property: "og:description", content: "Access the Attend360 admin and employee panels." },
    ],
  }),
  component: LoginPage,
});

const slides = [
  {
    image: "/attend360.png",
    title: "Attendance that reflects how your teams work",
    description:
      "Shift rules, grace periods, device validation, corrections and reporting — one connected attendance record.",
  },
  {
    image: "/attend360-1.png",
    title: "Real-time Attendance Tracking",
    description:
      "Instant visibility into present, late, absent and on-leave employees across all branches and locations.",
  },
  {
    image: "/attend360-2.png",
    title: "Streamlined Correction Requests",
    description:
      "Empower employees to request adjustments and give managers instant approval workflows.",
  },
  {
    image: "/attend360-3.png",
    title: "Comprehensive Analytics & Reports",
    description:
      "Export payroll-ready attendance data and visualize monthly trends at a glance.",
  },
];

function LoginPage() {
  const { t } = useI18n();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const timer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [api]);

  return (
    <div className="relative h-screen max-h-screen w-full overflow-hidden bg-background lg:grid lg:grid-cols-12">
      {/* Top right language switcher */}
      <div className="absolute end-4 top-4 z-30">
        <LanguageSwitcher />
      </div>

      {/* Left Column: Full-Bleed Image Slider Showcase (Image covered to show full display) */}
      <div className="relative hidden h-screen max-h-screen overflow-hidden text-white lg:col-span-7 lg:flex xl:col-span-7 2xl:col-span-8">
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
          className="size-full h-screen"
        >
          <CarouselContent className="ml-0 size-full h-screen">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="relative size-full h-screen basis-full pl-0">
                {/* Full display cover image */}
                <img
                  src={slide.image}
                  alt={t(slide.title)}
                  className="size-full object-cover object-center"
                  loading={index === 0 ? "eager" : "lazy"}
                />

                {/* Dark gradient overlay for text readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-slate-950/70" />

                {/* Bottom content overlay */}
                <div className="absolute inset-x-0 bottom-0 z-10 space-y-4 p-8 xl:p-12">
                  <div className="max-w-xl space-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                      {t("Attendance Suite")}
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-white xl:text-3xl">
                      {t(slide.title)}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-200/90 xl:text-base">
                      {t(slide.description)}
                    </p>
                  </div>

                  {/* Controls & Pagination */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {slides.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => api?.scrollTo(dotIdx)}
                          className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            current === dotIdx
                              ? "w-8 bg-white"
                              : "w-2 bg-white/40 hover:bg-white/70",
                          )}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => api?.scrollPrev()}
                        className="size-9 rounded-full border-white/20 bg-black/40 text-white backdrop-blur hover:bg-black/60 hover:text-white"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => api?.scrollNext()}
                        className="size-9 rounded-full border-white/20 bg-black/40 text-white backdrop-blur hover:bg-black/60 hover:text-white"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Sticky Developer Credit Footer (Fixed, does not move with slides) */}
        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/15 bg-slate-950/80 px-8 py-3.5 backdrop-blur-md xl:px-12">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/80">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-medium text-white/90">
                {t("Developer")}: <span className="font-semibold text-white">Mr. Hafez Rahim</span>
              </span>
              <span className="hidden text-white/30 sm:inline">•</span>
              <a
                href="https://odooteams.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 font-medium text-white transition-colors hover:bg-white/20 hover:text-white"
              >
                <Globe className="size-3.5 text-primary-soft" />
                <span>Odooteams.com</span>
                <ExternalLink className="size-3 opacity-60" />
              </a>
              <span className="hidden text-white/30 sm:inline">•</span>
              <a
                href="tel:+201007419344"
                className="inline-flex items-center gap-1 text-white/90 transition-colors hover:text-white hover:underline"
                title="Contact +201007419344"
              >
                <Phone className="size-3 text-emerald-400" />
                <span dir="ltr" className="font-medium">+201007419344</span>
              </a>
            </div>
            <span className="font-mono text-[11px] opacity-60">v1.0</span>
          </div>
        </div>
      </div>

      {/* Right Column: Sign-in Form (Centered in fixed viewport height, no scrollbar) */}
      <div className="flex h-screen max-h-screen items-center justify-center overflow-y-auto p-6 lg:col-span-5 xl:col-span-5 2xl:col-span-4">
        <Card className="w-full max-w-sm border-border shadow-card">
          <CardContent className="space-y-5 p-6 sm:p-7">
            {/* Centered Brand Logo & Sign In Header */}
            <div className="flex flex-col items-center text-center space-y-2">
              <BrandLogo mode="web" className="h-14 sm:h-16 w-auto max-w-[250px] object-contain" />
              <div className="pt-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("Sign in")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("Use your work account to continue.")}
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t("Email")}
                </Label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  defaultValue="admin@attend360.com"
                  maxLength={255}
                />
              </div>

              <div>
                <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t("Password")}
                </Label>
                <Input type="password" defaultValue="••••••••" maxLength={72} />
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <Checkbox defaultChecked />
                <span>{t("Remember this device")}</span>
              </label>
            </div>

            <div className="space-y-2.5 pt-1">
              <Button asChild className="h-10 w-full text-sm font-semibold shadow-xs">
                <Link to="/">{t("Sign in as Admin")}</Link>
              </Button>
              <Button asChild variant="outline" className="h-10 w-full text-sm font-semibold">
                <Link to="/employee">{t("Sign in as Employee")}</Link>
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              {t("Demo preview — no credentials required.")}
            </p>

            {/* Mobile Developer Credits */}
            <div className="flex flex-col items-center gap-1.5 border-t border-border pt-3 text-center text-xs text-muted-foreground lg:hidden">
              <span className="font-medium">
                {t("Developer")}: <strong className="text-foreground">Mr. Hafez Rahim</strong>
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://odooteams.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <Globe className="size-3" />
                  <span>Odooteams.com</span>
                </a>
                <span>•</span>
                <a
                  href="tel:+201007419344"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                  dir="ltr"
                >
                  <Phone className="size-3 text-emerald-500" />
                  <span>+201007419344</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
