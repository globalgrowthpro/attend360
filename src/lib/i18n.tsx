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
  "248 employees · 3 locations · 4 shifts": "٢٤٨ موظفًا · ٣ مواقع · ٤ ورديات",

  // Login & Slider
  "Sign in": "تسجيل الدخول",
  "Use your work account to continue.": "استخدم حساب العمل الخاص بك للمتابعة.",
  Email: "البريد الإلكتروني",
  Password: "كلمة المرور",
  "Remember this device": "تذكر هذا الجهاز",
  "Sign in as Admin": "تسجيل الدخول كمسؤول",
  "Sign in as Employee": "تسجيل الدخول كموظف",
  "Demo preview — no credentials required.": "معاينة تجريبية — لا يتطلب كلمة مرور.",
  "Attendance that reflects how your teams work": "نظام حضور يعكس أسلوب عمل فرقك بدقة",
  "Shift rules, grace periods, device validation, corrections and reporting — one connected attendance record.":
    "قواعد الورديات، فترات السماح، التحقق من الأجهزة، التصحيحات والتقارير — سجل حضور موحد ومتصل.",
  "Real-time Attendance Tracking": "متابعة الحضور في الوقت الفعلي",
  "Instant visibility into present, late, absent and on-leave employees across all branches and locations.":
    "رؤية فورية للموظفين الحاضرين، المتأخرين، الغائبين والمجازين في جميع الفروع والمواقع.",
  "Streamlined Correction Requests": "إدارة مبسطة لطلبات تصحيح الحضور",
  "Empower employees to request adjustments and give managers instant approval workflows.":
    "تمكين الموظفين من تقديم طلبات التعديل ومنح المديرين سير موافقة فوري.",
  "Comprehensive Analytics & Reports": "تحليلات وتقارير حضور شاملة",
  "Export payroll-ready attendance data and visualize monthly trends at a glance.":
    "تصدير بيانات حضور جاهزة لمسيرات الرواتب واستعراض مؤشرات الحضور الشهرية بلمحة.",

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

  // Activity feed
  "Checked in": "سجّل الدخول",
  "Checked out": "سجّل الخروج",
  "Late arrival": "وصول متأخر",
  "Marked absent": "تم تسجيله غائبًا",
  "Left early": "خرج مبكرًا",

  // Employee home
  "Good Morning, Ahmed 👋": "صباح الخير، أحمد 👋",
  "Thursday, 03 September 2026": "الخميس ٣ سبتمبر ٢٠٢٦",
  "Current time": "الوقت الحالي",
  "Cairo HQ · Device PC-001 approved": "المقر الرئيسي - القاهرة · الجهاز PC-001 معتمد",
  Scheduled: "المجدول",
  Working: "قيد العمل",
  Total: "الإجمالي",
  "✓ Attendance Completed": "✓ تم اكتمال الحضور",
  "CHECK IN": "تسجيل الدخول",
  "CHECK OUT": "تسجيل الخروج",
  "Grace period 10 min": "فترة سماح ١٠ دقائق",
  "Validation checks": "التحققات",
  "Device PC-001": "الجهاز PC-001",
  "Location Cairo HQ": "الموقع: المقر الرئيسي - القاهرة",
  "Morning Shift": "الوردية الصباحية",
  "Inside geofence": "داخل النطاق الجغرافي",
  "Working day": "يوم عمل",
  "Something wrong with a record?": "هل هناك خطأ في أحد السجلات؟",
  "Send a correction request to HR.": "أرسل طلب تصحيح إلى الموارد البشرية.",
  Request: "طلب",
  "Employee home": "الصفحة الرئيسية للموظف",

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
