import { getCurrentContext } from "./context"
import { Extensible } from "./extensible"
import Extension from "./extension"
import { Key } from "./utils"

const HOOK = Symbol()

export interface Hook {
    extension: Extension
    action: HookAction
}

export type HookAction = (payload?: any) => any

export const initHook = (extensible: Extensible) => {
    extensible.set(HOOK, {})
}

export const emit = <T = any>(extensible: Extensible, name: Key, payload?: T) => {
    extensible.get(HOOK)[name]?.forEach((hook: Hook) => {
        try{ 
            hook?.action?.(payload)
        } catch (e) {
            console.error('XTEns')
        }
    })
}

export const hookable = <T = any>(extensible: Extensible, name: Key) => {
    extensible.get(HOOK)[name] = []

    return (payload: T) => emit(extensible, name, payload)
}

export const hook = <T = any>(extensible: Extensible, name: Key, func: HookAction) => {
    extensible.get(HOOK)[name]?.push({
        extension: getCurrentContext()?.extension,
        action: func
    })
}