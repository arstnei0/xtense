import { getCurrentContext } from "./context"
import { Extensible } from "./extensible"
import Extension from "./extension"
import type { Key } from "./utils"

const INJECTION = Symbol()
const INJECTION_CACHE = Symbol()

export interface InjectionMap {
	[key: Key]: Array<{}>
}

export interface Injection {
	extension: Extension
	content: any
}

export const injectable = <T = any>(extensible: Extensible, name: Key) => {
	extensible.get(INJECTION)[name] = []

	return (): T => extensible.get(INJECTION)[name]
}

export const initInjection = (extensible: Extensible) => {
	extensible.set(INJECTION, {})
}

export const injected = <T = any>(
	extensible: Extensible,
	name: Key,
	simplify = true,
): T => {
	if (simplify) {
		const cache = extensible.get(INJECTION_CACHE)

		if (cache) return cache
		else
			return extensible.set(
				INJECTION_CACHE,
				extensible
					.get(INJECTION)[name]
					// .map((item: Injection) => item),
					.map((item: Injection) => item.content),
			)
	}

	return extensible.get(INJECTION)[name]
}

export const inject = <T>(extensible: Extensible, name: Key, content: T) => {
	const injection = {
		content,
		extension: getCurrentContext()?.extension
	}

	const injectedList = extensible.get(INJECTION)[name]
	if (injectedList) {
		injectedList.push(injection)
	} else {
		extensible.get(INJECTION)[name] = [injection]
	}
}
