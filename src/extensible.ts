import Extension from "./extension"
import { injectable, injected, inject, initInjection } from "./inject"
import { useExtensionContext } from "./context"
import { Key } from "./utils"
import { hook, hookable, initHook, emit, HookAction } from "./hook"

export type Set = <T>(key: string | symbol, value: T) => T
export type Get = <T = any>(key: string | symbol) => T | undefined

export type Injectable = <T = any>(name: Key) => () => T
export type Injected = <T = any>(name: Key, simplify?: boolean) => T[]
export type Inject = <T>(name: Key, content: T) => void

export type Hook = <T = any>(name: Key, func: HookAction<T>) => void
export type Hookable = <T = any>(name: Key) => (payload: T) => void
export type Emit = <T = any>(name: Key, payload?: T) => void

export type InitExtensible = (context: Extensible) => void

export type Use = (extension: Extension) => void

export interface ExtensibleContext extends Extensible {}

export interface Extensible {
	set: Set
	get: Get

	injectable: Injectable
	injected: Injected
	inject: Inject

	hook: Hook
	hookable: Hookable
	emit: Emit

	use: Use
}

export function createExtensible(name: string, init?: InitExtensible): Extensible {
	const cache = {}

	const baseExtensionID = Symbol()
	const baseExtension: Extension = {
		id: baseExtensionID,
		name,
	}

	const extensible = {
		set<T>(key: string | symbol, value: T): T {
			Reflect.set(cache, key, value)

			return value
		},
		get<T = any>(key: string | symbol): T | undefined {
			return Reflect.get(cache, key)
		},
		use(extension) {
			useExtensionContext(extension, () => extension.setup?.(extensible))
		},
	} as Extensible

	// Init Injection System
	initInjection(extensible)
	extensible.injectable = <T = any>(name: Key): (() => T) => injectable<T>(extensible, name)
	extensible.injected = <T = any>(name: Key, simplify = true): T =>
		injected<T>(extensible, name, simplify)
	extensible.inject = <T = any>(name: Key, content: T): void =>
		inject<T>(extensible, name, content)

	// Init Hook System
	initHook(extensible)
	extensible.hook = <T = any>(name: Key, func: HookAction<T>) => hook(extensible, name, func)
	extensible.hookable = <T = any>(name: Key) => hookable<T>(extensible, name)
	extensible.emit = <T = any>(name: Key, payload: T) => emit<T>(extensible, name, payload)

	useExtensionContext(baseExtension, () => init?.(extensible))

	return extensible
}
