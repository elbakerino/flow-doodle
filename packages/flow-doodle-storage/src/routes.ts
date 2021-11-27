import { DELETE, dynamicLoader, ExpressHandler, GET, POST, PUT } from './lib/routing.js'

export const corsConfig = {
    allowedOrigins: ['http://localhost:3000'],
}

const apiPrefix = ''

export const routes: [typeof GET | typeof POST | typeof PUT | typeof DELETE, string, ExpressHandler][] = [
    [GET, apiPrefix + '/', dynamicLoader(() => import ('./handler/HomeHandler.js').then(module => module.default))],
    [GET, apiPrefix + '/doodle/:id', dynamicLoader(() => import ('./handler/DoodleDetailsHandler.js').then(module => module.default))],
]
