import type { Request, Response } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'

import type { IIsAdminDbType } from '../../@types/isAdminDb.interface'
import { CONSTANTS } from '../../constants'

class AuthController {
	async login(req: Request, res: Response) {
		try {
			// Проверка логина и пароля
			const { username, password } = req.body
			const { username: usernameDb, password: passwordDb }: IIsAdminDbType =
				JSON.parse(fs.readFileSync(CONSTANTS.isAdminDbFileName, 'utf8'))

			// Выполнение логики входа
			if (username === usernameDb && password === passwordDb) {
				const token = jwt.sign({ username }, process.env.JWT_SECRET!, {
					expiresIn: '1h'
				})

				return res.json({ message: 'Вы вошли в систему.', token })
			} else {
				return res.status(401).json({ message: 'Неверный логин или пароль.' })
			}
		} catch (error) {
			console.error(error)
			return res.status(500).json({ message: 'Ошибка входа.' })
		}
	}
}

export const authController = new AuthController()
