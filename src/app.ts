import { CONSTANTS } from './constants'
import { getFullData, scrape } from './parser'

export const start = async () => {
	await scrape()
	await getFullData(CONSTANTS.dataFileName, CONSTANTS.baseUrl)
	console.log('Парсинг завершен.')
}

start()
