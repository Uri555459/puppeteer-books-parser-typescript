import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'

import { parserRouter, sendRouter } from './routes'
import { authRouter } from './routes/auth.route'

export const startServer = async () => {
	const app = express()

	const port = process.env.PORT
	const hostNameServer = process.env.HOST_NAME_SERVER

	app.use(cors())
	app.use(morgan('dev'))
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())

	app.use('/', authRouter)
	app.use('/', parserRouter)
	app.use('/', sendRouter)

	// Запуск сервера

	app.listen(port, () => {
		console.log(`Сервер запущен по пути ${hostNameServer}:${port}`)
	})
}

startServer()
