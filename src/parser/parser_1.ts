import puppeteer from 'puppeteer'

import type { ItemType } from '../@types/item.interface'
import { CONSTANTS } from '../constants'
import { saveFileData } from '../utils'

export const scrape = async () => {
	// Constants
	let flag = true
	let pageIndex = 50
	const res: ItemType[] = []

	const browser = await puppeteer.launch({
		headless: CONSTANTS.isHeadless,
		// slowMo: 100,
		devtools: false
	})
	const page = await browser.newPage()

	await page.setViewport({ width: 1920, height: 1080 })

	try {
		while (flag) {
			try {
				await page.goto(`${CONSTANTS.baseUrl}/catalogue/page-${pageIndex}.html`)
			} catch (error) {
				flag = false
				await browser.close()
				return false
			}

			const result = await page.evaluate(() => {
				// HTML elements selectors
				const bookSelector = '.product_pod'
				const titleSelector = '.product_pod > h3'
				const priceSelector = '.product_price > .price_color'
				const imagePrevSelector = '.product_pod > div > a > img'

				const books = document.querySelectorAll(bookSelector)

				const dataArray: ItemType[] = []

				books.forEach((item, index) => {
					dataArray.push({
						id: index,
						title: item?.querySelector(titleSelector)?.textContent?.trim(),
						imageUrlPrev: item
							?.querySelector(imagePrevSelector)
							?.getAttribute('src')
							?.trim(),
						url: item?.querySelector('a')?.href,
						price: item?.querySelector(priceSelector)?.textContent?.trim()
					})
				})

				return dataArray
			})

			// читаем файл
			// const { data } = JSON.parse(fs.readFileSync(dataFileName, 'utf8'))
			if (result.length === 0) {
				flag = false
				browser.close()
			}

			res.push(...result)

			pageIndex++
		}

		await browser.close()
	} catch (error) {
		await browser.close()

		flag = false
		console.log(error)
	}

	saveFileData<ItemType[]>(CONSTANTS.dataFileName, res)

	console.info(`Собрано ${res.length} позиций`)
}
