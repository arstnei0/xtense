const allLog = [] as string[]

export const log = (str?: string) => {
    allLog.push(str || '')
}

export const out = () => {
    const el = document.createElement('p')
    el.innerText = allLog.join('\n')
    document.getElementById('app')?.appendChild(el)
}

export default log