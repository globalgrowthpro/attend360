import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import logoAsset from "@/assets/attend360-logo.png.asset.json";
import markAsset from "@/assets/attend360-mark.png.asset.json";
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
    <div className="relative min-h-screen bg-background lg:grid lg:grid-cols-2">
      {/* Top right language switcher */}
      <div className="absolute end-4 top-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Left Column: Image Slider Showcase */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary/90 p-8 text-white lg:flex xl:p-12">
        {/* Subtle background glow effect */}
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-violet/20 blur-3xl" />

        {/* Header Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="rounded-xl bg-white/95 p-2 shadow-lg backdrop-blur">
            <img src={logoAsset.url} alt="Attend360" className="h-9 w-auto" />
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
            {t("Attendance Suite")}
          </span>
        </div>

        {/* Carousel Slider */}
        <div className="relative z-10 my-auto py-6">
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="space-y-5">
                    {/* Image Mockup Card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/60 p-2 shadow-2xl backdrop-blur">
                      <div className="overflow-hidden rounded-xl bg-slate-950">
                        <img
                          src={slide.image}
                          alt={t(slide.title)}
                          className="h-[330px] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                    </div>

                    {/* Slide Text Content */}
                    <div className="space-y-2 px-1">
                      <h2 className="text-2xl font-bold tracking-tight text-white xl:text-3xl">
                        {t(slide.title)}
                      </h2>
                      <p className="text-sm leading-relaxed text-slate-300 xl:text-base">
                        {t(slide.description)}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Controls: Dots and Nav Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    current === index
                      ? "w-8 bg-white"
                      : "w-2 bg-white/35 hover:bg-white/60",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => api?.scrollPrev()}
                className="size-8 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => api?.scrollNext()}
                className="size-8 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                aria-label="Next slide"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/70">
          <p>{t("248 employees · 3 locations · 4 shifts")}</p>
          <span className="font-mono text-[11px] opacity-60">v1.0</span>
        </div>
      </div>

      {/* Right Column: Sign-in Form */}
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-md border-border shadow-card">
          <CardContent className="space-y-6 p-6 sm:p-8">
            {/* Mobile Header Logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <img src={markAsset.url} alt="Attend360" className="size-9 rounded-lg" />
              <div>
                <p className="text-base font-bold">Attend360</p>
                <p className="text-xs text-muted-foreground">{t("Attendance Suite")}</p>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("Sign in")}</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t("Use your work account to continue.")}
              </p>
            </div>

            <div className="space-y-4">
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

            <div className="space-y-2.5 pt-2">
              <Button asChild className="w-full h-11 text-sm font-semibold shadow-xs">
                <Link to="/">{t("Sign in as Admin")}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11 text-sm font-semibold">
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
