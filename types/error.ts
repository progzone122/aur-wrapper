export type WrapperError = {
	error: true;
	code: string;
	message: string;
};

export function createWrapperError(code: string, message: string): WrapperError {
	return { error: true, code, message };
}

export function isWrapperError(result: any): result is WrapperError {
	return result && result.error === true && typeof result.code === 'string' && typeof result.message === 'string';
}