import { ExpressHandler, HandlerError } from '../lib/routing.js'
import { ServiceService } from '../service/ServiceService.js'
import { DoodleService } from '../service/DoodleService.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const handleGetDoodle = async(doodleService: DoodleService, id: string) => {
    //if(!await doodleService.templateExist(id)) {
        throw new HandlerError(404, 'template-not-found')
    //}

    /*const template = await doodleService.get(id)

    if(!template) {
        throw new HandlerError(500, 'template-config-not-loadable')
    }

    return template*/
}

const DoodleDetailsHandler: ExpressHandler = async(req, res) => {
    const template = await handleGetDoodle(await ServiceService.get('DoodleService'), req.params.id)
    return res.json({
        result: template,
    })
}

export default DoodleDetailsHandler
