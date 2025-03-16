export type Result<T, E> = { success: true, data: T } | { success: false, error: E };

export type WrapperError = {
	code: string;
	message: string;
};

export function createWrapperError(code: string, message: string): WrapperError {
	return {
		code,
		message,
	};
}