import { z } from "zod";

export const PackageInfoResponseSchema = z.object({
    ID: z.number(),
    Name: z.string(),
    Description: z.string().nullable(),
    PackageBaseID: z.number(),
    PackageBase: z.string(),
    Maintainer: z.string().nullable(),
    NumVotes: z.number(),
    Popularity: z.number(),
    FirstSubmitted: z.number(),
    LastModified: z.number(),
    OutOfDate: z.string().nullable(),
    Version: z.string(),
    URLPath: z.string().nullable(),
    URL: z.string().nullable(),
    Submitter: z.string(),
    License: z.array(z.string()),
    Depends: z.array(z.string()),
    MakeDepends: z.array(z.string()).optional(),
    OptDepends: z.array(z.string()).optional(),
    CheckDepends: z.array(z.string()).optional(),
    Provides: z.array(z.string()).optional(),
    Conflicts: z.array(z.string()).optional(),
    Replaces: z.array(z.string()).optional(),
    Groups: z.array(z.string()).optional(),
    Keywords: z.array(z.string()).optional(),
    CoMaintainers: z.array(z.string()).optional(),
});

export const PackageSearchResponseSchema = z.object({
    resultcount: z.number(),
    results: z.array(PackageInfoResponseSchema),
});

export type PackageInfoResponse = z.infer<typeof PackageInfoResponseSchema>;
export type PackageSearchResponse = z.infer<typeof PackageSearchResponseSchema>;