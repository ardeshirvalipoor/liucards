import { Request, Response, NextFunction } from 'express'

function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack)
    next(err)
}

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        console.log('headers sent')
        return next(err)
    }
    res.status(500)
    // Or save the error to a database and return the id to the client
    res.json({ error: err })
}

export default {
    logErrors,
    errorHandler
}