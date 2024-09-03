import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface CustomRequest extends Request {
	user?: unknown
}

export const checkToken = (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1]

			if (token) {
				jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
					if (err) {
						return res.status(401).json({ message: 'Ошибка авторизации.' })
					} else {
						req.user = decoded

						next()
					}
				})
			}
		} else {
			return res.status(401).json({ message: 'Пользователь не авторизован' })
		}
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Ошибка авторизации повторите позже.' })
	}
}
