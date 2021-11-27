import { DoodleRepository } from '../repository/DoodleRepository.js'

export class DoodleService {
    protected repo: DoodleRepository

    constructor() {
        this.repo = new DoodleRepository()
    }
}
