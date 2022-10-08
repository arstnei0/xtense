import { getCurrentContext } from "./context"
import Extension from "./extension"
import { ID } from "./utils"

export type OnRequire<T = any> = (
	extension: Extension,
	isInstalled: boolean,
	id: ID,
	description?: T,
) => boolean | void

export type Require = <T = any>(id: ID, description?: T) => boolean

export const require = <T = any>(
	installed: Extension[],
	onRequires: OnRequire<T>[],
	id: ID,
	description?: T,
): boolean => {
	let isInstalled = false

	installed.forEach((extension: Extension) => {
		if (extension.id === id) {
			isInstalled = true
		}
	})

	onRequires.forEach((onRequire) => {
		if (
			onRequire(
				getCurrentContext()?.extension as Extension,
				isInstalled,
				id,
				description,
			)
		)
			isInstalled = true
	})

	return isInstalled
}
