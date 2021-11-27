import { ServiceService } from './service/ServiceService.js'

export const services = (): void => {
    ServiceService.add('DoodleService', () => import('./service/DoodleService.js'))
}
