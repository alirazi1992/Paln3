import { useRef, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

type UploadStatus = 'Approved' | 'Pending review' | 'Needs action';

interface UploadRecord {
  id: string;
  name: string;
  size: string;
  status: UploadStatus;
  uploadedAt: string;
}

interface WorkflowStep {
  id: string;
  title: string;
  status: 'done' | 'active' | 'waiting';
  detail: string;
  updated: string;
}

interface DownloadPackage {
  id: string;
  title: string;
  description: string;
  size: string;
  link: string;
  requiresPayment: boolean;
}

const workflowSteps: WorkflowStep[] = [{
  id: 'intake',
  title: 'دریافت و کنترل مدارک',
  status: 'done',
  detail: 'تمام فایل‌های ارسالی صحت‌سنجی شده‌اند',
  updated: '۲ ساعت پیش'
}, {
  id: 'compliance',
  title: 'بازبینی انطباق',
  status: 'active',
  detail: 'معماران دریایی در حال بررسی یادداشت‌های باز هستند',
  updated: 'پایان تخمینی ۲۱ آبان'
}, {
  id: 'quality',
  title: 'کنترل کیفیت',
  status: 'waiting',
  detail: 'بلافاصله بعد از تایید انطباق آغاز می‌شود',
  updated: 'در صف انتظار'
}, {
  id: 'handover',
  title: 'تحویل نهایی',
  status: 'waiting',
  detail: 'پس از تایید پرداخت، لینک‌ها فعال می‌شوند',
  updated: 'وابسته به پرداخت'
}];

const downloadPackages: DownloadPackage[] = [{
  id: 'pkg-1',
  title: 'گزارش اولیه و ریسک‌ها',
  description: 'جمع‌بندی مدیریتی همراه با نقاط توقف فعلی',
  size: '۸.۴ مگابایت',
  link: '#',
  requiresPayment: false
}, {
  id: 'pkg-2',
  title: 'بسته گواهی نهایی',
  description: 'محاسبات امضا شده، تاییدیه‌ها و ردگیری تغییرات',
  size: '۲۴.۱ مگابایت',
  link: '#',
  requiresPayment: true
}];

const helpfulShortcuts = [{
  id: 'chat',
  title: 'گفت‌وگو با مهندس نوبت',
  detail: 'میانگین پاسخ‌گویی ۶ دقیقه'
}, {
  id: 'calendar',
  title: 'رزرو جلسه طراحی',
  detail: 'انتخاب بازه ۳۰ دقیقه‌ای'
}, {
  id: 'shield',
  title: 'اتاق داده ایمن',
  detail: 'ذخیره‌سازی رمزگذاری‌شده AES-256'
}];

const initialUploads: UploadRecord[] = [{
  id: 'upl-1',
  name: 'Stability_Calc_v3.xlsx',
  size: '۲.۴ مگابایت',
  status: 'Approved',
  uploadedAt: '2025-11-07T09:15:00Z'
}, {
  id: 'upl-2',
  name: 'Machinery_Layout.pdf',
  size: '۵.۸ مگابایت',
  status: 'Pending review',
  uploadedAt: '2025-11-08T13:42:00Z'
}, {
  id: 'upl-3',
  name: 'Electrical_SingleLine.dwg',
  size: '۱۱.۶ مگابایت',
  status: 'Needs action',
  uploadedAt: '2025-11-08T15:10:00Z'
}];

const statusStyles: Record<UploadStatus, { badge: string; label: string }> = {
  Approved: {
    badge: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    label: 'تایید شده'
  },
  'Pending review': {
    badge: 'text-blue-700 bg-blue-50 border-blue-100',
    label: 'در انتظار بررسی'
  },
  'Needs action': {
    badge: 'text-amber-700 bg-amber-50 border-amber-100',
    label: 'نیازمند اصلاح'
  }
};

const currencyFormatter = new Intl.NumberFormat('fa-IR', {
  style: 'currency',
  currency: 'IRR',
  maximumFractionDigits: 0
});

const formatDate = (value: string) => new Date(value).toLocaleDateString('fa-IR', {
  month: 'short',
  day: 'numeric'
});

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes)) return '۰ بایت';
  const units = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, index);
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[index]}`;
};

export function ClientDashboard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadRecord[]>(initialUploads);
  const [uploading, setUploading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const completedSteps = workflowSteps.filter(step => step.status === 'done').length;
  const progress = Math.round((completedSteps / workflowSteps.length) * 100);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);
    if (!incoming.length) return;
    setUploading(true);
    setTimeout(() => {
      const newItems = incoming.map<UploadRecord>((file, index) => ({
        id: `upl-${Date.now()}-${index}`,
        name: file.name,
        size: formatBytes(file.size),
        status: 'Pending review',
        uploadedAt: new Date().toISOString()
      }));
      setUploadedFiles(prev => [...newItems, ...prev]);
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 650);
  };

  const handleMarkPaid = () => {
    setPaymentComplete(true);
  };

  return <AppShell>
      <div className="max-w-7xl mx-auto space-y-6 text-right">
        <header className="flex flex-wrap items-start justify-between gap-4 flex-row">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">درگاه مشتری</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">داشبورد تحویل پروژه</h1>
            <p className="text-gray-600 mt-1">
              بارگذاری نقشه‌ها، پیگیری گام‌های بررسی و دریافت خروجی‌های امضا شده را یک‌جا انجام دهید.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-row">
            <Button variant="ghost" className="px-4 py-2 text-sm text-gray-700">
              <Icon name="share" size={16} className="ml-2" />
              اشتراک‌گذاری دسترسی
            </Button>
            <Button variant="primary" className="px-5 py-2 text-sm">
              <Icon name="calendar" size={16} className="ml-2" />
              رزرو جلسه هماهنگی
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5 text-right">
            <p className="text-sm text-gray-500">پیشرفت کلی</p>
            <div className="mt-3 flex items-end justify-end gap-2">
              <span className="text-3xl font-semibold text-gray-900">{progress}%</span>
              <span className="text-sm text-gray-500">({completedSteps} از {workflowSteps.length} گام)</span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-gray-900 transition-all" style={{
              width: `${progress}%`
            }} />
            </div>
          </Card>

          <Card className="p-5 text-right">
            <p className="text-sm text-gray-500">مانده پرداخت</p>
            <div className="mt-3 flex items-end justify-end gap-2">
              <span className="text-3xl font-semibold text-gray-900">
                {paymentComplete ? currencyFormatter.format(0) : currencyFormatter.format(850000000)}
              </span>
              <span className={paymentComplete ? 'text-sm text-emerald-600 font-medium' : 'text-sm text-amber-600 font-medium'}>
                {paymentComplete ? 'تسویه شد' : 'سررسید ۲۵ آبان'}
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              شناسه فاکتور · INV-2045 · انتقال بانکی
            </p>
          </Card>

          <Card className="p-5 text-right">
            <p className="text-sm text-gray-500">فایل‌های منتظر بررسی</p>
            <div className="mt-3 flex items-end justify-end gap-2">
              <span className="text-3xl font-semibold text-gray-900">
                {uploadedFiles.filter(file => file.status !== 'Approved').length}
              </span>
              <span className="text-sm text-gray-500">از {uploadedFiles.length}</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              میانگین زمان پاسخ کمتر از ۲۴ ساعت است.
            </p>
          </Card>

          <Card className="p-5 text-right">
            <p className="text-sm text-gray-500">نزدیک‌ترین موعد</p>
            <h3 className="mt-3 text-2xl font-semibold text-gray-900">۲۱ آبان</h3>
            <p className="text-sm text-gray-500">موعد اتمام بازبینی انطباق</p>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              افزودن به تقویم
            </Button>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="p-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="text-right">
                <h2 className="text-xl font-semibold text-gray-900">مرکز بارگذاری</h2>
                <p className="text-gray-500 text-sm mt-1">
                  فایل‌ها را بکشید و رها کنید یا از رایانه انتخاب کنید. قالب‌های PDF، DWG، XLSX و DXF تا ۲۵۰ مگابایت پشتیبانی می‌شوند.
                </p>
              </div>
              <input ref={fileInputRef} id="client-file-upload" type="file" multiple className="hidden" onChange={handleFileUpload} />
              <Button variant="primary" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Icon name="plus" size={16} className="ml-2" />
                آپلود فایل
              </Button>
            </div>

            <label htmlFor="client-file-upload" className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition-all hover:border-gray-300 hover:bg-white">
              <Icon name="layers" size={36} className="text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium">پوشه‌ها را اینجا رها کنید</p>
              <p className="text-sm text-gray-500">یا برای انتخاب کلیک کنید</p>
              {uploading && <span className="mt-3 text-sm text-gray-500">در حال بارگذاری...</span>}
            </label>

            <div className="space-y-3">
              {uploadedFiles.map(file => <div key={file.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">بارگذاری شده در {formatDate(file.uploadedAt)} · {file.size}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[file.status].badge}`}>
                    {statusStyles[file.status].label}
                  </span>
                </div>)}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">وضعیت پرداخت</p>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {paymentComplete ? 'تسویه تایید شد' : 'در انتظار تایید مالی'}
                  </h3>
                </div>
                <Icon name="shield" size={28} className={paymentComplete ? 'text-emerald-500' : 'text-amber-500'} />
              </div>
              <p className="text-sm text-gray-600">
                {paymentComplete ? 'لینک‌های دانلود فعال و رسید برای حسابداری ارسال شد.' : 'با ثبت پرداخت، لینک‌های دانلود نهایی به‌صورت خودکار فعال می‌شوند.'}
              </p>
              {!paymentComplete && <Button variant="primary" className="w-full" onClick={handleMarkPaid}>
                  تایید پرداخت انجام شد
                </Button>}
            </Card>

            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">خروجی‌ها</p>
                  <h3 className="text-xl font-semibold text-gray-900">مرکز دانلود</h3>
                </div>
                <Icon name="share" size={20} className="text-gray-400" />
              </div>
              <div className="space-y-4">
                {downloadPackages.map(pkg => {
            const unlocked = !pkg.requiresPayment || paymentComplete;
            return <div key={pkg.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-right space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{pkg.title}</p>
                          <p className="text-sm text-gray-500">{pkg.description}</p>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{pkg.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        {unlocked ? <a href={pkg.link} className="text-blue-600 hover:text-blue-800 font-medium" download>
                            دانلود فایل
                          </a> : <span className="text-amber-600 font-medium">
                            پس از تایید پرداخت فعال می‌شود
                          </span>}
                        {pkg.requiresPayment && !paymentComplete && <span className="text-xs text-gray-400">به‌محض تایید پرداخت بروزرسانی می‌شود</span>}
                      </div>
                    </div>;
          })}
              </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">پیگیری مرحله‌ای</h3>
                <p className="text-sm text-gray-500">تمام گام‌های داخلی را به‌صورت شفاف دنبال کنید.</p>
              </div>
              <span className="text-sm font-medium text-gray-500">{completedSteps} مرحله کامل شده</span>
            </div>
            <div className="mt-6 space-y-5">
              {workflowSteps.map(step => <div key={step.id} className="flex items-start gap-4">
                  <span className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 ${step.status === 'done' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : step.status === 'active' ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
                    <Icon name={step.status === 'done' ? 'check' : step.status === 'active' ? 'spark' : 'menu'} size={18} />
                  </span>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{step.title}</p>
                    <p className="text-sm text-gray-500">{step.detail}</p>
                    <p className="text-xs text-gray-400 mt-1">{step.updated}</p>
                  </div>
                </div>)}
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">پشتیبانی و منابع</h3>
                <p className="text-sm text-gray-500">تیم موفقیت مشتری همیشه در دسترس است.</p>
              </div>
              <Button variant="secondary" size="sm">
                ثبت تیکت
              </Button>
            </div>
            <div className="grid gap-4">
              {helpfulShortcuts.map(item => <div key={item.id} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.detail}</p>
                  </div>
                  <Icon name="chevronDown" size={18} className="-rotate-90 text-gray-300" />
                </div>)}
            </div>
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 text-right">
              نکته: پس از تایید پرداخت، لینک‌های دانلود به همه مخاطبان مجاز ارسال ایمیل می‌شود.
            </div>
          </Card>
        </div>
      </div>
    </AppShell>;
}
