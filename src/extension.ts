import { ExtensionContext } from "./context"
import { ID } from "./utils"

export interface Extension {
	id: ID
	description?: any
	setup?: (context: ExtensionContext) => any
}

export default Extension
