import { exec } from 'child_process'
import type { Request, Response } from 'express'
import fs from 'fs'

import { CONSTANTS } from '../../constants'

class SendController {
	async send(req: Request, res: Response) {
		try {
			if (!fs.existsSync(CONSTANTS.dataFullFileName)) {
				console.info('Не найден файл для отправки.')
				return res.status(404).json({ message: 'Не найден файл для отправки.' })
			}

			exec('npm run send:file', (error, stdout, stderr) => {
				if (error) {
					console.error(`error: ${error.message}`)
					return res
						.status(500)
						.json({ message: 'Ошибка запуска npm скрипта.' })
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`)
					return res.json({ message: 'Файл отправлен.' })
				}
				console.log(`stdout: ${stdout}`)
			})
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Ошибка отправки файла.' })
		}
	}
}

export const sendController = new SendController()
