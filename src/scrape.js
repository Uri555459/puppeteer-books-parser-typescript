import fs from 'fs'
import puppeteer from 'puppeteer'

import { time } from './utils/utils.js'

const scrape = async () => {
	// Constants
	const dataFileName = 'data.json'

	const browser = await puppeteer.launch({ headless: false, devtools: true })
	const page = await browser.newPage()

	await page.goto('http://books.toscrape.com/')

	const result = await page.evaluate(() => {
		// HTML elements selectors
		const bookSelector = '.product_pod'
		const titleSelector = '.product_pod > h3'
		const priceSelector = '.product_price > .price_color'
		const imagePrevSelector = '.product_pod > div > a > img'

		const books = document.querySelectorAll(bookSelector)

		const booksData = []

		books.forEach((book, index) => {
			booksData.push({
				id: index + 1,
				title: book.querySelector(titleSelector).textContent.trim(),
				imageUrlPrev: book.querySelector(imagePrevSelector).src.trim(),
				url: book.querySelector('a').href,
				price: book.querySelector(priceSelector).textContent.trim()
			})
		})

		return booksData
	})

	// Проверяем существуют ли данные
	if (!fs.existsSync(dataFileName)) {
		// создаём файл
		fs.writeFileSync(dataFileName, JSON.stringify({ data: result }))
	} else {
		fs.writeFileSync(dataFileName, JSON.stringify({ data: result }))
	}

	// читаем файл
	const { data } = JSON.parse(fs.readFileSync(dataFileName, 'utf8'))

	console.log(data)

	browser.close()
	return result
}

time(scrape)
