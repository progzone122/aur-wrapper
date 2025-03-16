import axios from "axios";

import {
    SearchResult,
    SearchResultSchema
} from "./schemas/searchResult";

import {
    type WrapperError,
    createWrapperError,
    type Result
} from "./types/error";
import {
    PackageInfoResponse,
    PackageSearchResponse,
    PackageSearchResponseSchema
} from "./schemas/packageInfo";

export default class AurWebRpc {
    private baseUrl: string;

    constructor(config: any) {
        if (config.proxy) {
            this.baseUrl = `https://corsproxy.io/?url=${config.baseUrl}`;
        } else {
            this.baseUrl = config.baseUrl;
        }
    }

    private async request<T>(endpoint: string = ""): Promise<T> {
        const resp = await axios.get(`${this.baseUrl}/rpc${endpoint}`);
        return resp.data;
    }

    async search(query: string): Promise<Result<SearchResult, WrapperError>> {
        try {
            let response = await this.request<SearchResult>(`/v5/search/${encodeURIComponent(query)}`);

            if (!response) {
                return { success: false, error: createWrapperError("API_ERROR", "Failed to retrieve data from AUR") };
            }

            const parsedResponse = SearchResultSchema.safeParse(response);

            if (!parsedResponse.success) {
                return { success: false, error: createWrapperError("INVALID_DATA", `Invalid data format: ${parsedResponse.error.message}`) };
            }

            return { success: true, data: parsedResponse.data };
        } catch (e) {
            return { success: false, error: createWrapperError("UNKNOWN_ERROR", e instanceof Error ? e.message : "Unknown error") };
        }
    }

    async searchSuggest(query: string, type: "pkgname" | "pkgbase"): Promise<Result<[string], WrapperError>> {
        try {
            const endpoint =
                type === "pkgname"
                    ? `/v5/suggest/${encodeURIComponent(query)}`
                    : `/v5/suggest-pkgbase/${encodeURIComponent(query)}`;

            let response = await this.request(endpoint);

            if (!response) {
                return { success: false, error: createWrapperError("API_ERROR", "Failed to retrieve data from AUR") };
            }

            return { success: true, data: response as [string] };

        } catch (e) {
            return { success: false, error: createWrapperError("UNKNOWN_ERROR", e instanceof Error ? e.message : "Unknown error") };
        }
    }

    async getPackageInfo(query: string): Promise<Result<PackageInfoResponse, WrapperError>> {
        try {
            const response = await this.request<PackageSearchResponse>(`/v5/info/${encodeURIComponent(query)}`);

            if (!response) {
                return { success: false, error: createWrapperError("API_ERROR", "Failed to retrieve data from AUR") };
            }

            const parsedResponse = PackageSearchResponseSchema.safeParse(response);

            if (!parsedResponse.success) {
                return { success: false, error: createWrapperError("INVALID_DATA", `Invalid data format: ${parsedResponse.error.message}`) };
            }

            if (response.results.length > 0) {
                return { success: true, data: response.results[0] };
            } else {
                return { success: false, error: createWrapperError("PACKAGE_NOT_FOUND", "Package not found") };
            }
        } catch (e) {
            return { success: false, error: createWrapperError("UNKNOWN_ERROR", e instanceof Error ? e.message : "Unknown error") };
        }
    }

    async getPackagesInfo(query: string[]): Promise<Result<PackageSearchResponse, WrapperError>> {
        try {
            let args: string = query.map(pkg => `arg[]=${encodeURIComponent(pkg)}`).join("&");

            const response = await this.request<PackageSearchResponse>(`/v5/info?${args}`);

            if (!response) {
                return { success: false, error: createWrapperError("API_ERROR", "Failed to retrieve data from AUR") };
            }

            const parsedResponse = PackageSearchResponseSchema.safeParse(response);

            if (!parsedResponse.success) {
                return { success: false, error: createWrapperError("INVALID_DATA", `Invalid data format: ${parsedResponse.error.message}`) };
            }

            // @ts-ignore
            const { type, version, ...cleanedResponse } = response;

            return { success: true, data: cleanedResponse };
        } catch (e) {
            return { success: false, error: createWrapperError("UNKNOWN_ERROR", e instanceof Error ? e.message : "Unknown error") };
        }
    }
}