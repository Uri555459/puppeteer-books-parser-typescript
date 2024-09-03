import fs from 'fs'

export const time = async (func: () => void) => {
	const t0 = performance.now()

	func()

	const t1 = performance.now()

	console.log(
		`Количество: ${(t1 - t0).toFixed(4)}, миллисекунд или: ${(
			(t1 - t0) /
			1000
		).toFixed(4)} секунд`
	)
}

export const saveFileData = <T>(fileName: string, data: T) => {
	// Проверяем существуют ли данные
	if (!fs.existsSync(fileName)) {
		// создаём файл
		fs.writeFileSync(fileName, JSON.stringify({ data }))
	} else {
		fs.writeFileSync(fileName, JSON.stringify({ data }))
	}
}

export const formatUrl = (baseUrl: string, url: string): string =>
	`${baseUrl}/${url?.split('/').slice(1).join('/')}`
