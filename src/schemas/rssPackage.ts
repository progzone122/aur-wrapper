import { z } from "zod";

export const RssPackageInfoSchema = z.object({
    PackageBase: z.string(),
    Link: z.string().default("#"),
    Description: z.string().nullable(),
    PubDate: z.string()
});

export type RssPackageInfoResponse = z.infer<typeof RssPackageInfoSchema>;