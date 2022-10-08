import Extension from "./extension"
import { injectable, injected, inject, initInjection } from "./inject"
import { getCurrentContext, useExtensionContext } from "./context"
import { Key } from "./utils"
import { hook, hookable, initHook, emit, HookAction } from "./hook"

export type Set = <T>(key: Key, value: T) => T
export type Get = <T = any>(
	key: Key,
	subscriber?: Subscriber<T>,
) => T | undefined
export type Subscribe = <T = any>(key: Key, func: Subscriber<T>) => Unsubscribe
export type Unsubscribe = () => undefined
export type Subscriber<T = any> = (oldValue: T, newValue: T) => void
export interface Subscription<T = any> {
	extension: Extension
	action: Subscriber<T>
}

export type Injectable = <T = any>(name: Key) => () => T
export type Injected = <T = any>(name: Key, simplify?: boolean) => T[]
export type Inject = <T>(name: Key, content: T) => void

export type Hook = <T = any>(name: Key, func: HookAction<T>) => void
export type Hookable = <T = any>(name: Key) => (payload: T) => void
export type Emit = <T = any>(name: Key, payload?: T) => void

export type InitExtensible = (context: Extensible) => void

export type Install = (extension: Extension) => void

export interface ExtensibleContext extends Extensible {}

export interface Extensible {
	set: Set
	get: Get
	subscribe: Subscribe

	injectable: Injectable
	injected: Injected
	inject: Inject

	hook: Hook
	hookable: Hookable
	emit: Emit

	install: Install
}

export function createExtensible(
	name: string,
	init?: InitExtensible,
): Extensible {
	const store = {}
	const subscriptions = {}

	const baseExtensionID = Symbol()
	const baseExtension: Extension = {
		id: baseExtensionID,
		name,
	}

	const extensible = {
		set<T>(key: Key, value: T): T {
			const oldValue = Reflect.get(store, key)

			Reflect.set(store, key, value)
			const subscribers = Reflect.get(subscriptions, key)
			subscribers &&
				subscribers.forEach((subscription: Subscription) =>
					subscription.action(oldValue, value),
				)

			return value
		},
		get<T = any>(key: Key, subscriber?: Subscriber<T>): T | undefined {
			subscriber && this.subscribe(key, subscriber)

			return Reflect.get(store, key)
		},
		subscribe<T = any>(key: Key, func: Subscriber<T>) {
			const subscription = {
				extension: getCurrentContext()?.extension,
				action: func,
			} as Subscription

			let subscribers = Reflect.get(subscriptions, key) as
				| Subscription[]
				| undefined
			let index: number
			if (subscribers) index = subscribers.push(subscription) - 1
			else {
				Reflect.set(subscriptions, key, [subscription])
				index = 0
				subscribers = Reflect.get(subscription, key)
			}

			return () => {
				subscribers?.splice(index, 1)
			}
		},
		install(extension) {
			useExtensionContext(extension, () => extension.setup?.(extensible))
		},
	} as Extensible

	// Init Injection System
	initInjection(extensible)
	extensible.injectable = <T = any>(name: Key): (() => T) =>
		injectable<T>(extensible, name)
	extensible.injected = <T = any>(name: Key, simplify = true): T =>
		injected<T>(extensible, name, simplify)
	extensible.inject = <T = any>(name: Key, content: T): void =>
		inject<T>(extensible, name, content)

	// Init Hook System
	initHook(extensible)
	extensible.hook = <T = any>(name: Key, func: HookAction<T>) =>
		hook(extensible, name, func)
	extensible.hookable = <T = any>(name: Key) => hookable<T>(extensible, name)
	extensible.emit = <T = any>(name: Key, payload: T) =>
		emit<T>(extensible, name, payload)

	useExtensionContext(baseExtension, () => init?.(extensible))

	return extensible
}
