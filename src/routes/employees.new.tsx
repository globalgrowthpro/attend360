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

export const Route = createFileRoute("/employees/new")({
  head: () => ({
    meta: [
      { title: "Add Employee — TimeTrack Attendance" },
      {
        name: "description",
        content:
          "Create an employee record with personal details, employment data, shift and attendance rules, and account access.",
      },
      { property: "og:title", content: "Add Employee — TimeTrack Attendance" },
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
  error?: string;
  full?: boolean;
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    toast.success(`${parsed.data.name} saved`, { description: "Employee record created." });
    navigate({ to: "/employees" });
  }

  return (
    <AdminShell title="Add Employee" description="Create a new employee record and attendance profile">
      <form onSubmit={onSubmit} className="space-y-4 pb-24">
        <Section title="Personal Information" description="Identity and contact details.">
          <Field label="Employee ID" error={errors["code"]}>
            <Input name="code" defaultValue="EMP009" />
          </Field>
          <Field label="Full Name" error={errors["name"]}>
            <Input name="name" placeholder="e.g. Ahmed Rahim" />
          </Field>
          <Field label="Profile Photo">
            <Button type="button" variant="outline" className="w-full justify-start gap-2">
              <Upload className="size-4" /> Upload photo
            </Button>
          </Field>
          <Field label="Gender">
            <Select defaultValue="male">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Date of Birth">
            <Input type="date" name="dob" />
          </Field>
          <Field label="Phone" error={errors["phone"]}>
            <Input name="phone" placeholder="+20 100 000 0000" />
          </Field>
          <Field label="Email" error={errors["email"]}>
            <Input name="email" type="email" placeholder="name@company.com" />
          </Field>
          <Field label="Address" full error={errors["address"]}>
            <Textarea name="address" rows={2} maxLength={300} />
          </Field>
        </Section>

        <Section title="Employment Information" description="Where this employee sits in the org.">
          <Field label="Department">
            <Select defaultValue="IT">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["IT", "HR", "Finance", "Operations", "Marketing"].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Position"><Input name="position" placeholder="Software Developer" /></Field>
          <Field label="Manager">
            <Select defaultValue="khaled">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="khaled">Khaled Nabil</SelectItem>
                <SelectItem value="mona">Mona Adel</SelectItem>
                <SelectItem value="hany">Hany Samir</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Employment Type">
            <Select defaultValue="full">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full-time</SelectItem>
                <SelectItem value="part">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Joining Date"><Input type="date" name="joining" /></Field>
          <Field label="Location">
            <Select defaultValue="cairo">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cairo">Cairo HQ</SelectItem>
                <SelectItem value="giza">Giza Office</SelectItem>
                <SelectItem value="alex">Alexandria Office</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Employee Status">
            <Select defaultValue="active">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="probation">Probation</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Section>

        <Section title="Attendance Configuration" description="Shift, expected hours and tolerances.">
          <Field label="Shift">
            <Select defaultValue="morning">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning Shift (09:00 – 17:00)</SelectItem>
                <SelectItem value="evening">Evening Shift (14:00 – 22:00)</SelectItem>
                <SelectItem value="night">Night Shift (22:00 – 06:00)</SelectItem>
                <SelectItem value="flex">Flexible Shift</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Working Days">
            <Input defaultValue="Sun, Mon, Tue, Wed, Thu" />
          </Field>
          <Field label="Expected Check-in"><Input type="time" defaultValue="09:00" /></Field>
          <Field label="Expected Check-out"><Input type="time" defaultValue="17:00" /></Field>
          <Field label="Grace Period (minutes)"><Input type="number" defaultValue={10} min={0} max={120} /></Field>
          <Field label="Break Duration (minutes)"><Input type="number" defaultValue={60} min={0} max={240} /></Field>
          <div className="flex items-center justify-between rounded-xl border border-border p-3 sm:col-span-2">
            <div>
              <p className="text-sm font-medium">Overtime Eligibility</p>
              <p className="text-xs text-muted-foreground">Count approved hours beyond shift end as overtime.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </Section>

        <Section title="Account" description="Portal access for self-service check-in.">
          <Field label="Username / Email"><Input name="username" placeholder="name@company.com" /></Field>
          <Field label="Role">
            <Select defaultValue="employee">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="super">Super Admin</SelectItem>
                <SelectItem value="hr">HR Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Access">
            <Select defaultValue="invite">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="invite">Send invitation email</SelectItem>
                <SelectItem value="password">Set temporary password</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-medium">Account Active</p>
              <p className="text-xs text-muted-foreground">Allow sign-in immediately.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </Section>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur lg:pl-64">
          <div className="flex justify-end gap-2">
            <Button asChild type="button" variant="outline">
              <Link to="/employees">Cancel</Link>
            </Button>
            <Button type="submit">Save Employee</Button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
