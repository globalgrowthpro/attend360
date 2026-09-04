import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between border-t border-white/15 pt-3 text-xs text-white/70">
                    <p>{t("248 employees · 3 locations · 4 shifts")}</p>
                    <span className="font-mono text-[11px] opacity-60">v1.0</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Floating Brand Logo at Top Left over the slider */}
        <div className="pointer-events-none absolute start-8 top-8 z-20 xl:start-12 xl:top-10">
          <div className="pointer-events-auto rounded-2xl border border-white/15 bg-black/40 px-4 py-2.5 shadow-lg backdrop-blur-md">
            <BrandLogo variant="dark" size="md" />
          </div>
        </div>
      </div>

      {/* Right Column: Sign-in Form (Centered in fixed viewport height, no scrollbar) */}
      <div className="flex h-screen max-h-screen items-center justify-center overflow-y-auto p-6 lg:col-span-5 xl:col-span-5 2xl:col-span-4">
        <Card className="w-full max-w-sm border-border shadow-card">
          <CardContent className="space-y-5 p-6 sm:p-7">
            {/* Mobile Header Logo */}
            <div className="lg:hidden">
              <BrandLogo variant="light" size="md" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("Sign in")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("Use your work account to continue.")}
              </p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
