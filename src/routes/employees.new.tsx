import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/employees/new")({
  head: () => ({
    meta: [
      { title: "Add Employee — Attend360 Attendance" },
      {
        name: "description",
        content:
          "Create an employee record with personal details, employment data, shift and attendance rules, and account access.",
      },
      { property: "og:title", content: "Add Employee — Attend360 Attendance" },
      { property: "og:description", content: "Onboard a new employee into the attendance system." },
    ],
  }),
  component: AddEmployeePage,
});

const schema = z.object({
  code: z.string().trim().min(1, "Employee ID is required").max(20),
  name: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(300).optional(),
});

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
  error,
  full,
}: {
  label: string;
  children: React.ReactNode;
  error?: string | undefined;
  full?: boolean | undefined;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </div>
  );
}

function AddEmployeePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error(t("Please fix the highlighted fields"));
      return;
    }
    setErrors({});
    toast.success(`${parsed.data.name} saved`, { description: t("Employee record created.") });
    navigate({ to: "/employees" });
  }

  return (
    <AdminShell
      title={t("Add Employee")}
      description={t("Create a new employee record and attendance profile")}
    >
      <form onSubmit={onSubmit} className="space-y-4 pb-24">
        <Section
          title={t("Personal Information")}
          description={t("Identity and contact details.")}
        >
          <Field label={t("Employee ID")} error={errors["code"]}>
            <Input name="code" defaultValue="EMP009" />
          </Field>
          <Field label={t("Full Name")} error={errors["name"]}>
            <Input name="name" placeholder="e.g. Ahmed Rahim" />
          </Field>
          <Field label={t("Profile Photo")}>
            <Button type="button" variant="outline" className="w-full justify-start gap-2">
              <Upload className="size-4" /> {t("Upload photo")}
            </Button>
          </Field>
          <Field label={t("Gender")}>
            <Select defaultValue="male">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t("Male")}</SelectItem>
                <SelectItem value="female">{t("Female")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("Date of Birth")}>
            <Input type="date" name="dob" />
          </Field>
          <Field label={t("Phone")} error={errors["phone"]}>
            <Input name="phone" placeholder="+20 100 000 0000" dir="ltr" className="text-start" />
          </Field>
          <Field label={t("Email")} error={errors["email"]}>
            <Input name="email" type="email" placeholder="name@company.com" dir="ltr" className="text-start" />
          </Field>
          <Field label={t("Address")} full error={errors["address"]}>
            <Textarea name="address" rows={2} maxLength={300} />
          </Field>
        </Section>

        <Section
          title={t("Employment Information")}
          description={t("Where this employee sits in the org.")}
        >
          <Field label={t("Department")}>
            <Select defaultValue="IT">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["IT", "HR", "Finance", "Operations", "Marketing"].map((d) => (
                  <SelectItem key={d} value={d}>{t(d)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("Position")}><Input name="position" placeholder="Software Developer" /></Field>
          <Field label={t("Manager")}>
            <Select defaultValue="khaled">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="khaled">Khaled Nabil</SelectItem>
                <SelectItem value="mona">Mona Adel</SelectItem>
                <SelectItem value="hany">Hany Samir</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("Employment Type")}>
            <Select defaultValue="full">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="full">{t("Full-time")}</SelectItem>
                <SelectItem value="part">{t("Part-time")}</SelectItem>
                <SelectItem value="contract">{t("Contract")}</SelectItem>
                <SelectItem value="intern">{t("Intern")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("Joining Date")}><Input type="date" name="joining" /></Field>
          <Field label={t("Location")}>
            <Select defaultValue="cairo">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cairo">{t("Cairo HQ")}</SelectItem>
                <SelectItem value="giza">{t("Giza Office")}</SelectItem>
                <SelectItem value="alex">{t("Alexandria Office")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("Employee Status")}>
            <Select defaultValue="active">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t("Active")}</SelectItem>
                <SelectItem value="probation">{t("Probation")}</SelectItem>
                <SelectItem value="inactive">{t("Inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Section>

        <Section
          title={t("Attendance Configuration")}
          description={t("Shift, expected hours and tolerances.")}
        >
          <Field label={t("Shift")}>
            <Select defaultValue="morning">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">{t("Morning Shift (09:00 – 17:00)")}</SelectItem>
                <SelectItem value="evening">{t("Evening Shift (14:00 – 22:00)")}</SelectItem>
                <SelectItem value="night">{t("Night Shift (22:00 – 06:00)")}</SelectItem>
                <SelectItem value="flex">{t("Flexible Shift")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("Working Days")}>
            <Input defaultValue="Sun, Mon, Tue, Wed, Thu" />
          </Field>
          <Field label={t("Expected Check-in")}><Input type="time" defaultValue="09:00" /></Field>
          <Field label={t("Expected Check-out")}><Input type="time" defaultValue="17:00" /></Field>
          <Field label={t("Grace Period (minutes)")}><Input type="number" defaultValue={10} min={0} max={120} /></Field>
          <Field label={t("Break Duration (minutes)")}><Input type="number" defaultValue={60} min={0} max={240} /></Field>
          <div className="flex items-center justify-between rounded-xl border border-border p-3 sm:col-span-2">
            <div>
              <p className="text-sm font-medium">{t("Overtime Eligibility")}</p>
              <p className="text-xs text-muted-foreground">{t("Count approved hours beyond shift end as overtime.")}</p>
            </div>
            <Switch defaultChecked />
          </div>
        </Section>

        <Section
          title={t("Account")}
          description={t("Portal access for self-service check-in.")}
        >
          <Field label={t("Username / Email")}>
            <Input name="username" placeholder="name@company.com" dir="ltr" className="text-start" />
          </Field>
          <Field label={t("Role")}>
            <Select defaultValue="employee">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="super">{t("Super Admin")}</SelectItem>
                <SelectItem value="hr">{t("HR Admin")}</SelectItem>
                <SelectItem value="manager">{t("Manager")}</SelectItem>
                <SelectItem value="employee">{t("Employee")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("Access")}>
            <Select defaultValue="invite">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="invite">{t("Send invitation email")}</SelectItem>
                <SelectItem value="password">{t("Set temporary password")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-medium">{t("Account Active")}</p>
              <p className="text-xs text-muted-foreground">{t("Allow sign-in immediately.")}</p>
            </div>
            <Switch defaultChecked />
          </div>
        </Section>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur lg:ps-64">
          <div className="flex justify-end gap-2">
            <Button asChild type="button" variant="outline">
              <Link to="/employees">{t("Cancel")}</Link>
            </Button>
            <Button type="submit">{t("Save Employee")}</Button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
