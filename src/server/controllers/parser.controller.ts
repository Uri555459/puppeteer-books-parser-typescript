import { exec } from 'child_process'
import type { Request, Response } from 'express'

class ParserController {
	async parser(req: Request, res: Response) {
		try {
			exec('npm run parser', (error, stdout, stderr) => {
				if (error) {
					console.error(`error: ${error.message}`)
					return res
						.status(500)
						.json({ message: 'Ошибка запуска npm скрипта.' })
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`)
					return res.json({ message: 'Парсер закончил работу.' })
				}
				console.log(`stdout: ${stdout}`)
			})
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Ошибка парсинга.' })
		}
	}
}

export const parserController = new ParserController()
