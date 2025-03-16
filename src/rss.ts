import axios from "axios";
import { RssPackageInfoSchema, RssPackageInfoResponse } from "./schemas/rssPackage";
import { createWrapperError, Result, WrapperError } from "./types/error";

let XMLParser: any;

if (typeof window === "undefined") {
    import("fast-xml-parser").then(module => {
        XMLParser = module.XMLParser;
    });
}

export default class AurWebRss {
    private baseUrl: string;

    constructor(config: any) {
        if (config.proxy) {
            this.baseUrl = `https://corsproxy.io/?url=${config.baseUrl}`;
        } else {
            this.baseUrl = config.baseUrl;
        }
    }

    private async request(args: string = ""): Promise<string> {
        const resp = await axios.get(`${this.baseUrl}/rss${args}`, {
            responseType: "text"
        });
        return resp.data;
    }

    private parseRssData(rssData: string): Result<RssPackageInfoResponse[], WrapperError> {
        if (typeof window === "undefined") {
            // Server-side (Node.js / Bun)
            if (!XMLParser) {
                throw new Error("XMLParser is not loaded yet. Ensure it's available before calling this function.");
            }
            const parser = new XMLParser();
            const xml = parser.parse(rssData);
            const items = (xml.rss?.channel?.item ?? []).map((item: any) => ({
                PackageBase: item.link || "#",
                Link: item.link || "#",
                Description: item.description || null,
                PubDate: item.pubDate || "",
            }));

            const parsedResponse = RssPackageInfoSchema.array().safeParse(items);
            if (!parsedResponse.success) {
                return {
                    success: false,
                    error: createWrapperError("INVALID_DATA", `Invalid data format: ${parsedResponse.error.message}`)
                };
            }

            return { success: true, data: parsedResponse.data };  // Return the array of items
        } else {
            // Client-side (browser)
            const parser = new DOMParser();
            const xml = parser.parseFromString(rssData, "application/xml");
            const items = Array.from(xml.querySelectorAll("item")).map(item => ({
                PackageBase: item.querySelector("link")?.textContent || "",
                Link: item.querySelector("link")?.textContent || "#",
                Description: item.querySelector("description")?.textContent || null,
                PubDate: item.querySelector("pubDate")?.textContent || "",
            }));
            const parsedResponse = RssPackageInfoSchema.array().safeParse(items);
            if (!parsedResponse.success) {
                return {
                    success: false,
                    error: createWrapperError("INVALID_DATA", `Invalid data format: ${parsedResponse.error.message}`)
                };
            }

            return { success: true, data: parsedResponse.data };
        }
    }

    async getLatestPackages(): Promise<Result<RssPackageInfoResponse[], WrapperError>> {
        const rssData = await this.request();
        const result = this.parseRssData(rssData);

        if (!result.success) {
            return {
                success: false,
                error: createWrapperError(result.error.code, result.error.message)
            }
        }

        return { success: true, data: result.data };
    }
}