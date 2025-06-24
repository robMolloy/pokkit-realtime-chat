import PocketBase from "pocketbase";
import { z } from "zod";

const textMessageRecordSchema = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  id: z.string(),
  text: z.string(),
  userId: z.string(),
  created: z.string(),
  updated: z.string(),
});
export type TTextMessageRecord = z.infer<typeof textMessageRecordSchema>;

export const createTextMessageRecord = async (p: {
  pb: PocketBase;
  data: Omit<TTextMessageRecord, "collectionId" | "collectionName" | "id" | "created" | "updated">;
}) => {
  try {
    const resp = await p.pb.collection("textMessages").create(p.data);

    return textMessageRecordSchema.safeParse(resp);
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
};

export const listTextMessageRecords = async (p: { pb: PocketBase }) => {
  try {
    const initData = await p.pb.collection("textMessages").getFullList();

    const data = initData
      .map((x) => textMessageRecordSchema.safeParse(x))
      .filter((x) => x.success)
      .map((x) => x.data);
    return { success: true, data } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const smartSubscribeToTextMessageRecords = async (p: {
  pb: PocketBase;
  onChange: (x: TTextMessageRecord[]) => void;
}) => {
  const listDocsResp = await listTextMessageRecords(p);
  if (!listDocsResp.success) return listDocsResp;

  let allDocs = listDocsResp.data;
  p.onChange(allDocs);

  const unsub = p.pb.collection("textMessages").subscribe("*", (e) => {
    if (e.action === "create") {
      const parseResp = textMessageRecordSchema.safeParse(e.record);
      if (parseResp.success) allDocs.push(parseResp.data);
    }
    if (e.action === "update") {
      const parseResp = textMessageRecordSchema.safeParse(e.record);
      if (!parseResp.success) return;

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
      allDocs.push(parseResp.data);
    }
    if (e.action === "delete") {
      const parseResp = textMessageRecordSchema.safeParse(e.record);
      if (!parseResp.success) return;

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
    }
    p.onChange(allDocs);
  });

  return { success: true, data: unsub } as const;
};
