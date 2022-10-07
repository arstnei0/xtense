import "./log.css"

export const logList = [] as string[]

export default function log(str: string) {
	logList.push(str)
}

export function outputLogs() {
	const logEl = document.createElement("p")

	logEl.innerText = logList.join("\n")

	document.body.appendChild(logEl)
}
