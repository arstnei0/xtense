import Extension from "./extension"

export interface ExtensionContext {
	extension: Extension
}

let currentContext: ExtensionContext | null = null

export const setCurrentContext = (extension: Extension) => {
	currentContext = { extension }
}

export const getCurrentContext = () => {
	return currentContext
}

export const clearCurrentContext = () => {
	currentContext = null
}

export const useExtensionContext = (
	extension: Extension,
	action: (context: ExtensionContext | null) => void,
) => {
	setCurrentContext(extension)
	action?.(getCurrentContext())
	clearCurrentContext()
}
