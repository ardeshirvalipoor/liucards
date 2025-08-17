// app.ts
import * as createError from 'http-errors'
import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import * as path from 'path'
import * as cookieParser from 'cookie-parser'
import * as logger from 'morgan'
import routes from './routes'

const app = express()

app.enable('trust proxy') // needed for correct req.secure behind Fly proxy

app.use(logger('dev'))
app.use(express.json())
app.use(routes)
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/health', (_req: Request, res: Response) => res.status(200).send('ok'))

app.get('*', (_req: Request, res: Response) =>
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
)

// catch 404 and forward to error handler
app.use((req: Request, _res: Response, next: NextFunction) => {
	next(createError(404))
})

// error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	res.status(err.status || 500)
	res.render('error')
})

export = app