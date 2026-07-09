"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateVolunteerStatus(id: string, status: string) {
  await prisma.volunteerApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/volunteers");
}

export async function deleteVolunteer(id: string) {
  await prisma.volunteerApplication.delete({ where: { id } });
  revalidatePath("/admin/volunteers");
}
