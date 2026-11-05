import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { ReportView } from "@/components/ReportView";
import { deleteReport, getReport } from "@/lib/db";

export const dynamic = "force-dynamic";

const idSchema = z.string().uuid();

async function remove(formData: FormData) {
  "use server";
  const { userId } = await auth();
  const id = idSchema.safeParse(formData.get("id"));
  if (!userId || !id.success) return;
  await deleteReport(userId, id.data);
  redirect("/reports");
}

export default async function ReportPage({ params }: { params: { id: string } }) {
  const id = idSchema.safeParse(params.id);
  if (!id.success) notFound();
  const [report, { userId }] = await Promise.all([getReport(id.data), auth()]);
  if (!report) notFound();
  const isOwner = userId === report.userId;

  return (
    <ReportView
      report={report}
      banner={
        isOwner ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className="text-slate-600">Anyone with this link can view the report.</span>
            <form action={remove}>
              <input type="hidden" name="id" value={report.id} />
              <button className="btn-secondary text-rose-700">Delete report</button>
            </form>
          </div>
        ) : undefined
      }
    />
  );
}
