import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, X } from "lucide-react";
import type { DigitalSignature, BankAccount, CredentialInfo } from "@/types/clientForm";

interface Props {
  form: Record<string, any>;
  setField: (key: string, value: any) => void;
}

export function RelatedInfoSection({ form, setField }: Props) {
  const [subTab, setSubTab] = useState("digital_sig");

  return (
    <Tabs value={subTab} onValueChange={setSubTab}>
      <TabsList className="bg-muted/50 h-auto flex-wrap gap-1 p-1">
        <TabsTrigger value="digital_sig" className="text-xs px-2 py-1.5">Chữ ký số</TabsTrigger>
        <TabsTrigger value="bank" className="text-xs px-2 py-1.5">Ngân hàng</TabsTrigger>
        <TabsTrigger value="etax" className="text-xs px-2 py-1.5">Thuế điện tử</TabsTrigger>
        <TabsTrigger value="insurance" className="text-xs px-2 py-1.5">BHXH</TabsTrigger>
        <TabsTrigger value="einvoice" className="text-xs px-2 py-1.5">Cổng HĐĐT</TabsTrigger>
        <TabsTrigger value="recv_email" className="text-xs px-2 py-1.5">Email nhận HĐ</TabsTrigger>
        <TabsTrigger value="send_email" className="text-xs px-2 py-1.5">Email gửi HĐ</TabsTrigger>
      </TabsList>

      <TabsContent value="digital_sig" className="mt-3">
        <DigitalSignatureTab
          items={form.digitalSignatures || []}
          onChange={(v) => setField("digitalSignatures", v)}
        />
      </TabsContent>
      <TabsContent value="bank" className="mt-3">
        <BankTab
          items={form.bankAccounts || []}
          onChange={(v) => setField("bankAccounts", v)}
        />
      </TabsContent>
      <TabsContent value="etax" className="mt-3">
        <CredentialTab
          data={form.eTax || { taxCode: "", username: "", password: "" }}
          onChange={(v) => setField("eTax", v)}
          fields={[{ key: "taxCode", label: "MST điện tử" }, { key: "username", label: "Tài khoản" }, { key: "password", label: "Mật khẩu", type: "password" }]}
        />
      </TabsContent>
      <TabsContent value="insurance" className="mt-3">
        <CredentialTab
          data={form.socialInsurance || { unitCode: "", username: "", password: "" }}
          onChange={(v) => setField("socialInsurance", v)}
          fields={[{ key: "unitCode", label: "Mã đơn vị BHXH" }, { key: "username", label: "Tài khoản" }, { key: "password", label: "Mật khẩu", type: "password" }]}
        />
      </TabsContent>
      <TabsContent value="einvoice" className="mt-3">
        <CredentialTab
          data={form.eInvoicePortal || { provider: "", username: "", password: "" }}
          onChange={(v) => setField("eInvoicePortal", v)}
          fields={[{ key: "provider", label: "Nhà cung cấp" }, { key: "username", label: "Tài khoản" }, { key: "password", label: "Mật khẩu", type: "password" }]}
        />
      </TabsContent>
      <TabsContent value="recv_email" className="mt-3">
        <MultiEmailTab
          emails={form.invoiceReceivingEmails || []}
          onChange={(v) => setField("invoiceReceivingEmails", v)}
          label="Email nhận hóa đơn"
        />
      </TabsContent>
      <TabsContent value="send_email" className="mt-3">
        <MultiEmailTab
          emails={form.invoiceSendingEmails || []}
          onChange={(v) => setField("invoiceSendingEmails", v)}
          label="Email gửi hóa đơn"
        />
      </TabsContent>
    </Tabs>
  );
}

function DigitalSignatureTab({ items, onChange }: { items: DigitalSignature[]; onChange: (v: DigitalSignature[]) => void }) {
  const add = () => onChange([...items, { name: "", provider: "", expiryDate: "", status: "active" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof DigitalSignature, val: string) => {
    const copy = [...items];
    (copy[i] as any)[key] = val;
    onChange(copy);
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs">Tên chữ ký</TableHead>
              <TableHead className="text-xs">Nhà cung cấp</TableHead>
              <TableHead className="text-xs">Ngày hết hạn</TableHead>
              <TableHead className="text-xs">Trạng thái</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground text-sm py-4">Chưa có chữ ký số</TableCell></TableRow>
            ) : items.map((item, i) => (
              <TableRow key={i}>
                <TableCell><Input className="h-8 text-xs" value={item.name} onChange={(e) => update(i, "name", e.target.value)} /></TableCell>
                <TableCell><Input className="h-8 text-xs" value={item.provider} onChange={(e) => update(i, "provider", e.target.value)} /></TableCell>
                <TableCell><Input className="h-8 text-xs" type="date" value={item.expiryDate} onChange={(e) => update(i, "expiryDate", e.target.value)} /></TableCell>
                <TableCell><Input className="h-8 text-xs" value={item.status} onChange={(e) => update(i, "status", e.target.value as any)} /></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(i)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button variant="outline" size="sm" onClick={add}><Plus className="h-3.5 w-3.5 mr-1" />Thêm mới chữ ký số</Button>
    </div>
  );
}

function BankTab({ items, onChange }: { items: BankAccount[]; onChange: (v: BankAccount[]) => void }) {
  const add = () => onChange([...items, { bankName: "", accountNumber: "", branch: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof BankAccount, val: string) => {
    const copy = [...items];
    copy[i][key] = val;
    onChange(copy);
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs">Tên ngân hàng</TableHead>
              <TableHead className="text-xs">Số tài khoản</TableHead>
              <TableHead className="text-xs">Chi nhánh</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-4">Chưa có tài khoản</TableCell></TableRow>
            ) : items.map((item, i) => (
              <TableRow key={i}>
                <TableCell><Input className="h-8 text-xs" value={item.bankName} onChange={(e) => update(i, "bankName", e.target.value)} /></TableCell>
                <TableCell><Input className="h-8 text-xs" value={item.accountNumber} onChange={(e) => update(i, "accountNumber", e.target.value)} /></TableCell>
                <TableCell><Input className="h-8 text-xs" value={item.branch} onChange={(e) => update(i, "branch", e.target.value)} /></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(i)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button variant="outline" size="sm" onClick={add}><Plus className="h-3.5 w-3.5 mr-1" />Thêm mới</Button>
    </div>
  );
}

function CredentialTab({ data, onChange, fields }: {
  data: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
  fields: { key: string; label: string; type?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {fields.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <Label className="text-xs">{f.label}</Label>
          <Input
            type={f.type || "text"}
            className="h-9"
            value={data[f.key] || ""}
            onChange={(e) => onChange({ ...data, [f.key]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

function MultiEmailTab({ emails, onChange, label }: { emails: string[]; onChange: (v: string[]) => void; label: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !emails.includes(trimmed)) {
      onChange([...emails, trimmed]);
      setInput("");
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2">
        <Input
          className="h-9 flex-1"
          type="email"
          placeholder="email@domain.com"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <Button variant="outline" size="sm" className="h-9" onClick={add}>Thêm</Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {emails.map((email) => (
          <span key={email} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
            {email}
            <button onClick={() => onChange(emails.filter((e) => e !== email))}>
              <X className="h-3 w-3 hover:text-destructive" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
