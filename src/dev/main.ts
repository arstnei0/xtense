import { createExtensible } from ".."
import log, { outputLogs } from "./log"

const extensible = createExtensible('testApp', ({ injectable, hookable }) => {
	log("init")
	injectable("test")
	hookable('th')
})

extensible.use({
	id: 'test',
	name: 'test',
	setup(extensible) {
		extensible.inject('test', () => { log('running in test context injection') })
		extensible.hook('th', (payload: string) => {
			log('running in test context hook')
			log(`received: ${payload}`)
			throw new Error('aaaa')
		})
	}
})

extensible.injected<() => void>('test', false).forEach((item: any) => {
	item?.content?.()
})

extensible.emit('th', '"message sent from extensible"')

outputLogs()