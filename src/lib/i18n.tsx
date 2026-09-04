import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ar";

const STORAGE_KEY = "attend360.lang";

/**
 * Arabic dictionary keyed by the English source text.
 * Any string not listed here falls back to English, so translation
 * can grow page by page without touching call sites.
 */
const ar: Record<string, string> = {
  // Brand / shells
  "Attendance Suite": "منظومة الحضور",
  "Self service": "الخدمة الذاتية",
  Dashboard: "لوحة التحكم",
  Employees: "الموظفون",
  Attendance: "الحضور",
  Corrections: "التصحيحات",
  Reports: "التقارير",
  Settings: "الإعدادات",
  Notifications: "الإشعارات",
  "My Profile": "ملفي الشخصي",
  Logout: "تسجيل الخروج",
  Home: "الرئيسية",
  History: "السجل",
  Profile: "الملف الشخصي",
  Admin: "المسؤول",
  "Open menu": "فتح القائمة",
  "My profile": "ملفي الشخصي",
  Language: "اللغة",
  "Switch language": "تغيير اللغة",
  "248 employees": "٢٤٨ موظفًا",
  "3 locations · 4 shifts": "٣ مواقع · ٤ ورديات",

  // Dashboard
  "Good Morning, Admin": "صباح الخير، أيها المسؤول",
  "Thursday, September 3, 2026": "الخميس ٣ سبتمبر ٢٠٢٦",
  "All Locations": "كل المواقع",
  "Cairo HQ": "المقر الرئيسي - القاهرة",
  "Giza Office": "مكتب الجيزة",
  "Alexandria Office": "مكتب الإسكندرية",
  Today: "اليوم",
  "This week": "هذا الأسبوع",
  "This month": "هذا الشهر",
  "Total Employees": "إجمالي الموظفين",
  Present: "حاضر",
  Absent: "غائب",
  Late: "متأخر",
  "On Leave": "في إجازة",
  Leave: "إجازة",
  "Working Now": "يعمل الآن",
  "Today's Attendance": "حضور اليوم",
  "248 scheduled employees": "٢٤٨ موظفًا مجدولًا",
  "Today's Activity": "نشاط اليوم",
  Live: "مباشر",
  "Quick Actions": "إجراءات سريعة",
  "Add Employee": "إضافة موظف",
  "Record Attendance": "تسجيل الحضور",
  "Attendance Correction": "تصحيح الحضور",
  "Generate Report": "إنشاء تقرير",

  // Common UI
  Save: "حفظ",
  "Save changes": "حفظ التغييرات",
  Cancel: "إلغاء",
  Search: "بحث",
  Filter: "تصفية",
  Export: "تصدير",
  Status: "الحالة",
  Name: "الاسم",
  Date: "التاريخ",
  Department: "القسم",
  Location: "الموقع",
  Actions: "الإجراءات",
  "Check In": "تسجيل الدخول",
  "Check Out": "تسجيل الخروج",
  Approved: "مقبول",
  Pending: "قيد الانتظار",
  Rejected: "مرفوض",
  Blocked: "محجوب",
  Expired: "منتهي",
  Overtime: "وقت إضافي",
  "Early Leave": "خروج مبكر",
  Holiday: "عطلة",
  Weekend: "نهاية الأسبوع",
  Settings_save_toast: "تم حفظ الإعدادات",
  "Settings saved": "تم حفظ الإعدادات",
  "Company, attendance rules, shifts, devices and permissions":
    "الشركة وقواعد الحضور والورديات والأجهزة والصلاحيات",
};

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (text: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(
    () => setLangState((prev) => (prev === "en" ? "ar" : "en")),
    [],
  );
  const t = useCallback(
    (text: string) => (lang === "ar" ? (ar[text] ?? text) : text),
    [lang],
  );

  const value = useMemo(
    () => ({ lang, dir: (lang === "ar" ? "rtl" : "ltr") as "rtl" | "ltr", setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;
  // Safe fallback if a component renders outside the provider.
  return {
    lang: "en",
    dir: "ltr",
    setLang: () => {},
    toggleLang: () => {},
    t: (text: string) => text,
  };
}
