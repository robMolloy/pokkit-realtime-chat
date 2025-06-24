import PocketBase from "pocketbase";
import { z } from "zod";

const imageMessageRecordSchema = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  id: z.string(),
  image: z.string(),
  userId: z.string(),
  textMessageId: z.string(),
  created: z.string(),
  updated: z.string(),
});
export type TImageMessageRecord = z.infer<typeof imageMessageRecordSchema>;
export type TImageFileMessageRecord = Omit<TImageMessageRecord, "image"> & { image: File };

export const createImageMessageRecord = async (p: {
  pb: PocketBase;
  data: Omit<
    TImageFileMessageRecord,
    "collectionId" | "collectionName" | "id" | "created" | "updated"
  >;
}) => {
  try {
    const resp = await p.pb.collection("imageMessages").create(p.data);

    return imageMessageRecordSchema.safeParse(resp);
  } catch (error) {
    console.error(error);
    return { success: false, error } as const;
  }
};

export const listImageMessageRecords = async (p: { pb: PocketBase }) => {
  try {
    const initData = await p.pb.collection("imageMessages").getFullList();

    const data = initData
      .map((x) => imageMessageRecordSchema.safeParse(x))
      .filter((x) => x.success)
      .map((x) => x.data);
    return { success: true, data } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const smartSubscribeToImageMessageRecords = async (p: {
  pb: PocketBase;
  onChange: (x: TImageMessageRecord[]) => void;
}) => {
  const listDocsResp = await listImageMessageRecords(p);
  if (!listDocsResp.success) return listDocsResp;

  let allDocs = listDocsResp.data;
  p.onChange(allDocs);

  const unsub = p.pb.collection("imageMessages").subscribe("*", (e) => {
    if (e.action === "create") {
      const parseResp = imageMessageRecordSchema.safeParse(e.record);
      if (parseResp.success) allDocs.push(parseResp.data);
    }
    if (e.action === "update") {
      const parseResp = imageMessageRecordSchema.safeParse(e.record);
      if (!parseResp.success) return;

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
      allDocs.push(parseResp.data);
    }
    if (e.action === "delete") {
      const parseResp = imageMessageRecordSchema.safeParse(e.record);
      if (!parseResp.success) return;

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
    }
    p.onChange(allDocs);
  });

  return { success: true, data: unsub } as const;
};
