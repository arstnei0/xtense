import { createExtensible } from 'xtense'
import {} from 'nanostores'
import extension from './extension'
import log, { out } from './log'

const extensible = createExtensible(({
    hookable,
    injectable
}) => {
    log('Creating extensible...')

    hookable('test hook')
    injectable('test injection')
})

extensible.install(extension)

extensible.emit('test hook')

log('Injected: ' + extensible.injected<string>('test injection')[0])

out()