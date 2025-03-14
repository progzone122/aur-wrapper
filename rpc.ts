import axios from "axios";
import { mapKeys, camelCase } from "lodash";

import {
    type PackageInfoResponse,
    type PackageInfoResult,
    type PackageSearchResponse,
    type PackageSearchResult
} from './types';

import {
    type SearchResult,
    SearchResultSchema
} from "./schemas/searchResult";

import {
    type WrapperError,
    createWrapperError
} from "./types/error";

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

    async search(query: string): Promise<SearchResult | WrapperError> {
        try {
            let response = await this.request<any>(`/v5/search/${encodeURIComponent(query)}`);

            if (!response) {
                return createWrapperError("API_ERROR", "Failed to retrieve data from AUR");
            }

            const parsedResponse = SearchResultSchema.safeParse(response);

            if (!parsedResponse.success) {
                return createWrapperError("INVALID_DATA", `Invalid data format: ${parsedResponse.error.message}`);
            }

            return parsedResponse.data ?? {};
        } catch (e) {
            return createWrapperError("UNKNOWN_ERROR", e instanceof Error ? e.message : "Unknown error");
        }
    }
    async searchSuggest(query: string): Promise<[string] | WrapperError> {
        try {
            let response = await this.request(`/v5/suggest/${encodeURIComponent(query)}`);

            if (!response) {
                return createWrapperError("API_ERROR", "Failed to retrieve data from AUR");
            }

            return response as [string];

        } catch (e) {
            return createWrapperError("UNKNOWN_ERROR", e instanceof Error ? e.message : "Unknown error");
        }
    }
    async getPackageInfo(query: string): Promise<PackageInfoResult> {
        try {
            const response = await this.request<{ results: any[] }>(`/v5/info/${encodeURIComponent(query)}`);

            if (!response) {
                return createWrapperError("API_ERROR", "Failed to retrieve data from AUR");
            }

            if (response.results.length > 0) {
                return mapKeys(response.results[0], (_: any, key: any) => camelCase(key)) as PackageInfoResponse;
            } else {
                return createWrapperError("PACKAGE_NOT_FOUND", "Package not found");
            }
        } catch (e) {
            return createWrapperError("UNKNOWN_ERROR", e instanceof Error ? e.message : "Unknown error");
        }
    }
}