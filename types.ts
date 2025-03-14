export type WrapperError = {
	error: true;
	code: string;
	message: string;
};

export function createWrapperError(code: string, message: string): WrapperError {
	return { error: true, code, message };
}

export type PackageInfoResult = PackageInfoResponse | WrapperError;
export type PackageSearchResult = PackageSearchResponse | WrapperError;

export type PackageInfoResponse = {
		id: number;
		name: string;
		description: string;
		packageBaseId: number;
		packageBase: string;
		maintainer: string;
		numVotes: number;
		popularity: number;
		firstSubmitted: number;
		lastModified: number;
		outOfDate: string | null;
		version: string;
		urlPath: string;
		url: string;
		submitter: string;
		license: string[];
		depends: string[];
		makeDepends: string[];
		optDepends: string[];
		checkDepends: string[];
		provides: string[];
		conflicts: string[];
		replaces: string[];
		groups: string[];
		keywords: string[];
		coMaintainers: string[];
}

export type PackageSearchResponse = {
	resultcount: number;
	results: PackageInfoResponse[];
}