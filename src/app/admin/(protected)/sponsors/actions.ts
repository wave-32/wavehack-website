"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateSponsorStatus(id: string, status: string) {
  await prisma.sponsorInquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/sponsors");
}

export async function deleteSponsor(id: string) {
  await prisma.sponsorInquiry.delete({ where: { id } });
  revalidatePath("/admin/sponsors");
}
