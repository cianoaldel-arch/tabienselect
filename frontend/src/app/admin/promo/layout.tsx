import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminGuard } from '@/components/AdminGuard';

export default function AdminPromoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
      <AdminSidebar />
      <section>
        <AdminGuard>{children}</AdminGuard>
      </section>
    </div>
  );
}
