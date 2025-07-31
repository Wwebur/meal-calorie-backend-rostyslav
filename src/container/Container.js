export class Container {
  #services = new Map();
  #singletons = new Map();

  register(name, factory, options = {}) {
    this.#services.set(name, { factory, options });
    return this;
  }

  resolve(name) {
    const service = this.#services.get(name);

    if (!service) {
      throw new Error(`Service ${name} not found`);
    }

    if (service.options.singleton) {
      if (!this.#singletons.has(name)) {
        this.#singletons.set(name, service.factory(this));
      }
      return this.#singletons.get(name);
    }

    return service.factory(this);
  }
}
