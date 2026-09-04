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
      <div className="absolute end-4 top-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Left Column: Image Slider Showcase (fixed height, responsive to viewport, no scrollbar) */}
      <div className="relative hidden h-full max-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary/95 p-6 text-white lg:col-span-7 lg:flex xl:col-span-7 xl:px-10 xl:py-7 2xl:col-span-8 2xl:px-14 2xl:py-8">
        {/* Subtle background glow effect */}
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-violet/20 blur-3xl" />

        {/* Header Logo */}
        <div className="relative z-10 flex shrink-0 items-center justify-between">
          <BrandLogo variant="dark" size="lg" />
          <span className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur sm:inline-flex">
            {t("Attendance Suite")}
          </span>
        </div>

        {/* Carousel Slider: centered and scaled to remaining viewport height */}
        <div className="relative z-10 my-auto flex w-full flex-1 flex-col justify-center min-h-0 py-2">
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
                <CarouselItem key={index} className="w-full basis-full">
                  <div className="flex flex-col space-y-3">
                    {/* Responsive Full-width Image Card capped at viewport height fraction */}
                    <div className="group relative w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-950/80 shadow-2xl backdrop-blur">
                      <div className="relative w-full aspect-[3/2] max-h-[50vh] xl:max-h-[53vh] 2xl:max-h-[58vh]">
                        <img
                          src={slide.image}
                          alt={t(slide.title)}
                          className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                    </div>

                    {/* Slide Text Content */}
                    <div className="space-y-1 px-1">
                      <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl xl:text-2xl">
                        {t(slide.title)}
                      </h2>
                      <p className="text-xs leading-relaxed text-slate-300 xl:text-sm line-clamp-2">
                        {t(slide.description)}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Controls: Dots and Nav Buttons */}
          <div className="mt-3 flex shrink-0 items-center justify-between">
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
        <div className="relative z-10 flex shrink-0 items-center justify-between text-xs text-white/70 pt-1">
          <p>{t("248 employees · 3 locations · 4 shifts")}</p>
          <span className="font-mono text-[11px] opacity-60">v1.0</span>
        </div>
      </div>

      {/* Right Column: Sign-in Form (Centered in fixed viewport height, no scrollbar) */}
      <div className="flex h-full max-h-screen items-center justify-center p-6 lg:col-span-5 xl:col-span-5 2xl:col-span-4 overflow-y-auto">
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
              <Button asChild className="w-full h-10 text-sm font-semibold shadow-xs">
                <Link to="/">{t("Sign in as Admin")}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-10 text-sm font-semibold">
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
