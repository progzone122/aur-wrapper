import { z } from "zod";

export const PackageSchema = z.object({
	ID: z.number(),
	Name: z.string(),
	Description: z.string().optional(),
	PackageBaseID: z.number(),
	PackageBase: z.string(),
	Maintainer: z.string().nullable(),
	NumVotes: z.number(),
	Popularity: z.number(),
	FirstSubmitted: z.number(),
	LastModified: z.number(),
	OutOfDate: z.union([z.string(), z.number()]).nullable(),
	Version: z.string(),
	URLPath: z.string().nullable(),
	URL: z.string().nullable(),
});

export const SearchResultSchema = z.object({
	description: z.string().optional(),
	resultcount: z.number(),
	type: z.string(),
	version: z.number(),
	results: z.array(PackageSchema),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;