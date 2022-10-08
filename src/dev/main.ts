import { createExtensible } from ".."
import log, { outputLogs } from "./log"

const extensible = createExtensible(({ injectable, hookable, onRequire }) => {
	log("init")
	injectable("test")
	hookable("th")
	
	onRequire((extension, isInstalled, id, description) => {
		log(`${String(extension.id)} is requiring ${String(id)}`)

		// return true
	})
})

extensible.install({
	id: "test",
	setup(context) {
		context.inject("test", () => {
			log("running in test context injection")
		})

		context.hook("th", (payload?: string) => {
			log("running in test context hook")
			log(`received: ${payload}`)
		})

		const unsubscribe = context.subscribe<string>("s", (oldValue, newValue) => {
			log("detect 's' changed at extension context")
			log(`change from ${oldValue || "nothing"} to ${newValue}`)
		})

		unsubscribe()

		log(context.require('required extension') ? 'installed' : 'not installed')
	},
})

log()

extensible.injected<() => void>("test", false).forEach((item: any) => {
	item?.content?.()
})

log()

extensible.emit("th", '"message sent from extensible"')

log()

log('main context changing "s"')
extensible.set("s", "new new new new new value")
log("changed")

outputLogs()
