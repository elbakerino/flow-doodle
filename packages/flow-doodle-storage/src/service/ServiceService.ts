class ServiceServiceClass {
    // todo: correctly type services as dynamic imports using the service `name` as module name
    protected services: { [key: string]: () => Promise<{ [key: string]: any }> } = {}
    protected loadedServices: { [key: string]: InstanceType<any> } = {}

    add(name: string, service: any) {
        this.services[name] = service
    }

    async get(name: string) {
        if(!this.services[name]) {
            throw new Error('service-not-found: ' + name)
        }
        if(!this.loadedServices[name]) {
            const service = await this.services[name]().then(module => module[name])
            // todo: add service params in service definition
            this.loadedServices[name] = new service()
        }
        return this.loadedServices[name]
    }
}

// export instance to have a singleton
export const ServiceService = new ServiceServiceClass()
