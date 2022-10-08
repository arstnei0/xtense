import { Extension } from "xtense"
import log from "./log"

const extension: Extension = {
    id: 'example extension',
    setup(context){
        const extensible = context
        const {
            hook,
            inject
        } = extensible

        log('Extension setting up...')

        hook('test hook', () => {
            log('Test hook runs successfully!')
        })

        inject('test injection', prompt('Input Injection:'))
    }
}

export default extension