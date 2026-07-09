"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateParticipantStatus(id: string, status: string) {
  await prisma.participant.update({ where: { id }, data: { status } });
  revalidatePath("/admin/participants");
}

export async function deleteParticipant(id: string) {
  await prisma.participant.delete({ where: { id } });
  revalidatePath("/admin/participants");
}
