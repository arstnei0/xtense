import { createExtensible } from ".."
import log, { outputLogs } from "./log"

const extensible = createExtensible("testApp", ({ injectable, hookable }) => {
	log("init")
	injectable("test")
	hookable("th")
})

extensible.install({
	id: "test",
	name: "test",
	setup(extensible) {
		extensible.inject("test", () => {
			log("running in test context injection")
		})

		extensible.hook("th", (payload?: string) => {
			log("running in test context hook")
			log(`received: ${payload}`)
		})

		extensible.subscribe<string>("s", (oldValue, newValue) => {
			log("detect 's' changed at extension context")
			log(`change from ${oldValue || "nothing"} to ${newValue}`)
		})
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
