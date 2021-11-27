import express from 'express'
import cors, { CorsOptions, CorsOptionsDelegate } from 'cors'
import { corsConfig, routes } from './routes.js'
import {
    DELETE, GET, POST, PUT,
    ErrorHandlerMiddleware,
    handlerErrorWrapper,
} from './lib/routing.js'
import process from 'process'
import { getPerformanceInMs } from './lib/performance.js'
import { services } from './services.js'

services()

const app = express()

app.use(cors({
    origin: function(origin: string, callback: (arg0: null, arg1: boolean) => void) {
        callback(null, Boolean(origin && corsConfig.allowedOrigins.includes(origin)))
    },
} as CorsOptions | CorsOptionsDelegate))

app.use(function profilerMiddleware(_req: any, res: { json: (data: { dur: number }) => any }, next: () => void) {
    const startTime = process.hrtime()
    const json = res.json
    res.json = function(data: { dur: number }) {
        if(data) {
            data.dur = getPerformanceInMs(process.hrtime(startTime))
        }
        return json.call(this, data)
    }

    next()
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))

routes.forEach(([method, path, handler]) => {
    const handle = handlerErrorWrapper(handler)
    method === GET && app.get(path, handle)
    method === PUT && app.put(path, handle)
    method === POST && app.post(path, handle)
    method === DELETE && app.delete(path, handle)
})

app.use(ErrorHandlerMiddleware)

app.listen(process.env.PORT || 3030, () => {
    console.log('Server started on port http://localhost:' + (process.env.PORT || 3030))
})
