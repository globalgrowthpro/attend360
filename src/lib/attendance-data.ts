export type AttendanceStatus =
  | "present"
  | "late"
  | "absent"
  | "leave"
  | "early-leave"
  | "missing-checkout"
  | "pending-correction";

export const statusMeta: Record<
  AttendanceStatus,
  { label: string; dot: string; badge: string }
> = {
  present: {
    label: "Present",
    dot: "bg-success",
    badge: "bg-success-soft text-success",
  },
  late: { label: "Late", dot: "bg-warning", badge: "bg-warning-soft text-warning" },
  absent: { label: "Absent", dot: "bg-danger", badge: "bg-danger-soft text-danger" },
  leave: { label: "On Leave", dot: "bg-info", badge: "bg-info-soft text-info" },
  "early-leave": {
    label: "Early Leave",
    dot: "bg-violet",
    badge: "bg-violet-soft text-violet",
  },
  "missing-checkout": {
    label: "Missing Check-out",
    dot: "bg-neutral-strong",
    badge: "bg-secondary text-secondary-foreground",
  },
  "pending-correction": {
    label: "Pending Correction",
    dot: "bg-warning",
    badge: "bg-warning-soft text-warning",
  },
};

export type Employee = {
  id: string;
  code: string;
  name: string;
  department: string;
  position: string;
  location: string;
  active: boolean;
  today: AttendanceStatus;
  email: string;
  phone: string;
  shift: string;
  joined: string;
  manager: string;
  type: string;
  nationalId?: string;
  nationalIdExpiry?: string;
};

export const employees: Employee[] = [
  {
    id: "1",
    code: "EMP001",
    name: "Ahmed Ali",
    department: "IT",
    position: "Software Developer",
    location: "Cairo HQ",
    active: true,
    today: "present",
    email: "ahmed.ali@company.com",
    phone: "+20 100 111 2233",
    shift: "Morning Shift",
    joined: "12 Jan 2023",
    manager: "Khaled Nabil",
    type: "Full-time",
    nationalId: "29408150102345",
    nationalIdExpiry: "14 Aug 2031",
  },
  {
    id: "2",
    code: "EMP002",
    name: "Sara Hassan",
    department: "HR",
    position: "HR Officer",
    location: "Cairo HQ",
    active: true,
    today: "late",
    email: "sara.hassan@company.com",
    phone: "+20 100 222 3344",
    shift: "Morning Shift",
    joined: "03 Mar 2022",
    manager: "Mona Adel",
    type: "Full-time",
    nationalId: "29605120109876",
    nationalIdExpiry: "22 May 2030",
  },
  {
    id: "3",
    code: "EMP003",
    name: "Omar Khaled",
    department: "Finance",
    position: "Accountant",
    location: "Giza Office",
    active: true,
    today: "absent",
    email: "omar.khaled@company.com",
    phone: "+20 100 333 4455",
    shift: "Morning Shift",
    joined: "21 Sep 2021",
    manager: "Hany Samir",
    type: "Full-time",
  },
  {
    id: "4",
    code: "EMP004",
    name: "Mona Adel",
    department: "HR",
    position: "HR Manager",
    location: "Cairo HQ",
    active: true,
    today: "present",
    email: "mona.adel@company.com",
    phone: "+20 100 741 9344",
    shift: "Morning Shift",
    joined: "08 Feb 2020",
    manager: "—",
    type: "Full-time",
  },
  {
    id: "5",
    code: "EMP005",
    name: "Youssef Ibrahim",
    department: "Operations",
    position: "Shift Supervisor",
    location: "Alexandria Office",
    active: true,
    today: "leave",
    email: "youssef.ibrahim@company.com",
    phone: "+20 100 555 6677",
    shift: "Evening Shift",
    joined: "15 Jun 2023",
    manager: "Hany Samir",
    type: "Full-time",
  },
  {
    id: "6",
    code: "EMP006",
    name: "Nour Mostafa",
    department: "Marketing",
    position: "Content Specialist",
    location: "Cairo HQ",
    active: true,
    today: "early-leave",
    email: "nour.mostafa@company.com",
    phone: "+20 100 666 7788",
    shift: "Flexible Shift",
    joined: "02 Nov 2024",
    manager: "Mona Adel",
    type: "Part-time",
  },
  {
    id: "7",
    code: "EMP007",
    name: "Mohamed Hassan",
    department: "IT",
    position: "QA Engineer",
    location: "Giza Office",
    active: true,
    today: "missing-checkout",
    email: "mohamed.hassan@company.com",
    phone: "+20 100 777 8899",
    shift: "Night Shift",
    joined: "19 Apr 2024",
    manager: "Khaled Nabil",
    type: "Full-time",
  },
  {
    id: "8",
    code: "EMP008",
    name: "Laila Fouad",
    department: "Finance",
    position: "Payroll Officer",
    location: "Cairo HQ",
    active: false,
    today: "absent",
    email: "laila.fouad@company.com",
    phone: "+20 100 888 9900",
    shift: "Morning Shift",
    joined: "27 Jul 2019",
    manager: "Hany Samir",
    type: "Contract",
  },
];

export type AttendanceRecord = {
  id: string;
  employee: string;
  code: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hours: string;
  status: AttendanceStatus;
  location: string;
  device: string;
  scheduled: string;
  source: string;
};

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "a1",
    employee: "Ahmed Ali",
    code: "EMP001",
    date: "03 Sep 2026",
    checkIn: "08:55 AM",
    checkOut: "05:05 PM",
    hours: "8h 10m",
    status: "present",
    location: "Cairo HQ",
    device: "PC-001",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Web",
  },
  {
    id: "a2",
    employee: "Sara Hassan",
    code: "EMP002",
    date: "03 Sep 2026",
    checkIn: "09:27 AM",
    checkOut: null,
    hours: "7h 33m",
    status: "late",
    location: "Cairo HQ",
    device: "Mobile-114",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Mobile",
  },
  {
    id: "a3",
    employee: "Omar Khaled",
    code: "EMP003",
    date: "03 Sep 2026",
    checkIn: null,
    checkOut: null,
    hours: "—",
    status: "absent",
    location: "Giza Office",
    device: "—",
    scheduled: "09:00 AM – 05:00 PM",
    source: "—",
  },
  {
    id: "a4",
    employee: "Mona Adel",
    code: "EMP004",
    date: "03 Sep 2026",
    checkIn: "08:41 AM",
    checkOut: "05:22 PM",
    hours: "8h 41m",
    status: "present",
    location: "Cairo HQ",
    device: "PC-014",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Device",
  },
  {
    id: "a5",
    employee: "Nour Mostafa",
    code: "EMP006",
    date: "03 Sep 2026",
    checkIn: "09:02 AM",
    checkOut: "03:40 PM",
    hours: "6h 38m",
    status: "early-leave",
    location: "Cairo HQ",
    device: "Mobile-207",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Mobile",
  },
  {
    id: "a6",
    employee: "Mohamed Hassan",
    code: "EMP007",
    date: "03 Sep 2026",
    checkIn: "09:37 PM",
    checkOut: null,
    hours: "—",
    status: "missing-checkout",
    location: "Giza Office",
    device: "PC-052",
    scheduled: "10:00 PM – 06:00 AM",
    source: "Device",
  },
  {
    id: "a7",
    employee: "Youssef Ibrahim",
    code: "EMP005",
    date: "03 Sep 2026",
    checkIn: null,
    checkOut: null,
    hours: "—",
    status: "leave",
    location: "Alexandria Office",
    device: "—",
    scheduled: "02:00 PM – 10:00 PM",
    source: "—",
  },
];

export const activityFeed = [
  {
    name: "Ahmed Mohamed",
    action: "Checked in",
    time: "08:54 AM",
    office: "Cairo HQ",
    status: "present" as AttendanceStatus,
  },
  {
    name: "Sara Ali",
    action: "Checked out",
    time: "05:12 PM",
    office: "Cairo HQ",
    status: "present" as AttendanceStatus,
  },
  {
    name: "Mohamed Hassan",
    action: "Late arrival",
    time: "09:37 AM",
    office: "Giza Office",
    status: "late" as AttendanceStatus,
  },
  {
    name: "Omar Khaled",
    action: "Marked absent",
    time: "10:00 AM",
    office: "Giza Office",
    status: "absent" as AttendanceStatus,
  },
  {
    name: "Nour Mostafa",
    action: "Left early",
    time: "03:40 PM",
    office: "Cairo HQ",
    status: "early-leave" as AttendanceStatus,
  },
];

export type CorrectionRequest = {
  id: string;
  employee: string;
  code: string;
  date: string;
  field: string;
  current: string;
  requested: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submitted: string;
};

export const corrections: CorrectionRequest[] = [
  {
    id: "c1",
    employee: "Sara Hassan",
    code: "EMP002",
    date: "03 Sep 2026",
    field: "Check In",
    current: "09:32 AM",
    requested: "09:00 AM",
    reason: "Forgot to check in, was in a client meeting.",
    status: "pending",
    submitted: "09:45 AM",
  },
  {
    id: "c2",
    employee: "Mohamed Hassan",
    code: "EMP007",
    date: "02 Sep 2026",
    field: "Check Out",
    current: "—",
    requested: "06:05 AM",
    reason: "Device offline at end of night shift.",
    status: "pending",
    submitted: "08:12 AM",
  },
  {
    id: "c3",
    employee: "Ahmed Ali",
    code: "EMP001",
    date: "28 Aug 2026",
    field: "Check In",
    current: "09:21 AM",
    requested: "08:58 AM",
    reason: "Badge reader failure at Cairo HQ entrance.",
    status: "approved",
    submitted: "10:02 AM",
  },
  {
    id: "c4",
    employee: "Nour Mostafa",
    code: "EMP006",
    date: "25 Aug 2026",
    field: "Check Out",
    current: "03:40 PM",
    requested: "05:10 PM",
    reason: "Worked from meeting room without device.",
    status: "rejected",
    submitted: "04:31 PM",
  },
];

export const notifications = [
  {
    group: "Today",
    items: [
      { icon: "late", title: "Ahmed arrived late", meta: "09:32 AM · Cairo HQ", type: "late" },
      {
        icon: "correction",
        title: "Sara requested attendance correction",
        meta: "09:45 AM · Check-in 09:32 → 09:00",
        type: "pending-correction",
      },
      { icon: "absent", title: "Omar is absent", meta: "10:00 AM · Giza Office", type: "absent" },
      {
        icon: "device",
        title: "New device registration pending",
        meta: "11:20 AM · Mobile-311 · Nour Mostafa",
        type: "missing-checkout",
      },
    ],
  },
  {
    group: "Yesterday",
    items: [
      {
        icon: "correction",
        title: "Correction approved for Ahmed Ali",
        meta: "Check-in updated to 08:58 AM",
        type: "present",
      },
      {
        icon: "missing",
        title: "Missing check-out — Mohamed Hassan",
        meta: "Night shift 02 Sep",
        type: "missing-checkout",
      },
      { icon: "new", title: "New employee added: Nour Mostafa", meta: "Marketing · Cairo HQ", type: "leave" },
    ],
  },
];

export const devices = [
  {
    id: "PC-001",
    type: "Desktop",
    employee: "Ahmed Ali",
    location: "Cairo HQ",
    registered: "12 Jan 2023",
    lastUsed: "03 Sep 2026 08:55",
    status: "Approved",
  },
  {
    id: "Mobile-114",
    type: "Mobile",
    employee: "Sara Hassan",
    location: "Cairo HQ",
    registered: "04 Mar 2024",
    lastUsed: "03 Sep 2026 09:27",
    status: "Approved",
  },
  {
    id: "Mobile-311",
    type: "Mobile",
    employee: "Nour Mostafa",
    location: "Cairo HQ",
    registered: "03 Sep 2026",
    lastUsed: "—",
    status: "Pending",
  },
  {
    id: "PC-052",
    type: "Kiosk",
    employee: "Shared — Night shift",
    location: "Giza Office",
    registered: "19 Apr 2024",
    lastUsed: "03 Sep 2026 21:37",
    status: "Approved",
  },
  {
    id: "Tablet-007",
    type: "Tablet",
    employee: "Reception",
    location: "Alexandria Office",
    registered: "11 Nov 2022",
    lastUsed: "18 Aug 2026 07:02",
    status: "Blocked",
  },
];

export const locations = [
  { name: "Cairo HQ", address: "12 Nile St, Downtown, Cairo", employees: 164, radius: "150 m" },
  { name: "Giza Office", address: "44 Pyramids Rd, Giza", employees: 58, radius: "120 m" },
  { name: "Alexandria Office", address: "9 Corniche, Alexandria", employees: 26, radius: "100 m" },
];

export const shifts = [
  { name: "Morning Shift", window: "09:00 AM – 05:00 PM", grace: "10 min", employees: 182 },
  { name: "Evening Shift", window: "02:00 PM – 10:00 PM", grace: "10 min", employees: 34 },
  { name: "Night Shift", window: "10:00 PM – 06:00 AM", grace: "15 min", employees: 22 },
  { name: "Flexible Shift", window: "Any 8h between 07:00 – 21:00", grace: "—", employees: 10 },
];

export const permissionMatrix = [
  { permission: "View Employees", admin: "✓", manager: "Team", employee: "Own" },
  { permission: "Add Employee", admin: "✓", manager: "—", employee: "—" },
  { permission: "View Attendance", admin: "✓", manager: "Team", employee: "Own" },
  { permission: "Edit Attendance", admin: "✓", manager: "✓", employee: "—" },
  { permission: "Approve Correction", admin: "✓", manager: "✓", employee: "—" },
  { permission: "Reports", admin: "✓", manager: "Team", employee: "Own" },
  { permission: "Settings", admin: "✓", manager: "—", employee: "—" },
];

export const workSchedule = [
  { day: "Monday", hours: "09:00 – 17:00", weekend: false },
  { day: "Tuesday", hours: "09:00 – 17:00", weekend: false },
  { day: "Wednesday", hours: "09:00 – 17:00", weekend: false },
  { day: "Thursday", hours: "09:00 – 17:00", weekend: false },
  { day: "Friday", hours: "Weekend", weekend: true },
  { day: "Saturday", hours: "Weekend", weekend: true },
  { day: "Sunday", hours: "09:00 – 17:00", weekend: false },
];

/** Day-by-day status map for the employee history calendar (September 2026). */
export const septemberDays: { day: number; status: AttendanceStatus | "weekend" | "future" }[] =
  Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // 4 Sep 2026 is a Friday → Fri/Sat weekends.
    const isWeekend = [4, 5, 11, 12, 18, 19, 25, 26].includes(day);
    if (isWeekend) return { day, status: "weekend" as const };
    if (day > 3) return { day, status: "future" as const };
    if (day === 1) return { day, status: "late" as const };
    if (day === 2) return { day, status: "present" as const };
    return { day, status: "present" as const };
  });

export const lateReport = [
  { employee: "Ahmed Ali", date: "Sep 2", scheduled: "09:00", actual: "09:18", lateBy: "18m" },
  { employee: "Sara Hassan", date: "Sep 3", scheduled: "09:00", actual: "09:32", lateBy: "32m" },
  { employee: "Mohamed Hassan", date: "Sep 3", scheduled: "22:00", actual: "22:37", lateBy: "37m" },
  { employee: "Nour Mostafa", date: "Sep 1", scheduled: "09:00", actual: "09:11", lateBy: "11m" },
];

export const absenceReport = [
  {
    employee: "Omar Khaled",
    date: "Sep 3",
    department: "Finance",
    shift: "Morning",
    type: "Unpaid",
    reason: "No record",
    approved: false,
  },
  {
    employee: "Laila Fouad",
    date: "Sep 2",
    department: "Finance",
    shift: "Morning",
    type: "Sick leave",
    reason: "Medical certificate",
    approved: true,
  },
  {
    employee: "Youssef Ibrahim",
    date: "Sep 3",
    department: "Operations",
    shift: "Evening",
    type: "Annual leave",
    reason: "Planned vacation",
    approved: true,
  },
];

export const attendanceTrend = [
  { day: "Aug 28", present: 205, late: 14, absent: 21 },
  { day: "Aug 31", present: 218, late: 9, absent: 16 },
  { day: "Sep 1", present: 224, late: 11, absent: 13 },
  { day: "Sep 2", present: 210, late: 16, absent: 22 },
  { day: "Sep 3", present: 213, late: 12, absent: 18 },
];
