import { Extensible } from "./extensible"
import Extension from "./extension"
import { Require } from "./require"

export interface ExtensionContext extends Extensible {
	extension: Extension
	require: Require
}

let currentContext: ExtensionContext | null = null

export const setCurrentContext = (
	extensible: Extensible,
	extension: Extension,
	require: Require,
) => {
	currentContext = {
		...extensible,
		extension,
		require,
	}
}

export const getCurrentContext = () => {
	return currentContext
}

export const clearCurrentContext = () => {
	currentContext = null
}

export const useExtensionContext = (
	extensible: Extensible,
	extension: Extension,
	require: Require,
	action: (context: ExtensionContext) => void,
) => {
	setCurrentContext(extensible, extension, require)
	action?.(getCurrentContext() as ExtensionContext)
	clearCurrentContext()
}
