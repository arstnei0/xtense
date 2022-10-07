import { Extensible } from "./extensible"
import { ID } from "./utils"

export interface Extension {
	id: ID
	name?: string
	setup?: (extensible: Extensible) => void
}

export default Extension
