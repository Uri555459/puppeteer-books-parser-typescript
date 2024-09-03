import fs from 'fs'
import puppeteer from 'puppeteer'

import type { ItemType } from '../@types/item.interface'
import { CONSTANTS } from '../constants'
import { saveFileData } from '../utils'

export const getFullData = async (fileName: string, baseUrl: string) => {
	if (fs.existsSync(fileName)) {
		const { data }: { data: ItemType[] } = JSON.parse(
			fs.readFileSync(fileName, 'utf8')
		)

		let flag = true
		let index = 0
		const newData: ItemType[] = []
		const browser = await puppeteer.launch({
			headless: CONSTANTS.isHeadless,
			// slowMo: 100,
			devtools: false
		})
		const page = await browser.newPage()

		await page.setViewport({ width: 1920, height: 1080 })

		const formatData = data.map(item => ({
			...item,
			imageUrlPrev: `${baseUrl}/${item.imageUrlPrev?.split('/').slice(1).join('/')}`
		}))

		try {
			while (flag) {
				try {
					await page.goto(String(formatData[index]?.url))
				} catch (error) {
					flag = false
					await browser.close()
					console.error(
						'Ошибка при переходе на внутреннюю страницу:',
						formatData[index]?.url
					)
				}

				const newItem = await page.evaluate(() => {
					const baseUrl = 'http://books.toscrape.com'
					const descriptionSelector = '.product_page > p'
					const imageSelector = '#product_gallery img'

					const description = document
						.querySelector(descriptionSelector)
						?.textContent?.trim()
					const imageUrl = document
						.querySelector(imageSelector)
						?.getAttribute('src')
						?.trim()

					return {
						description,
						imageUrl: `${baseUrl}/${imageUrl?.split('/').slice(2).join('/')}`
					}
				})
				newData.push({ ...formatData[index], ...newItem })
				index++
			}

			await browser.close()
		} catch (error) {
			saveFileData('dataFull.json', newData)
			await browser.close()
			console.error('Страницы закончились')
		}
		saveFileData('dataFull.json', newData)
	}
}
