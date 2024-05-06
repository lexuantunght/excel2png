class ClientId {
    current;
    constructor() {
        this.current = 0;
    }

    next() {
        this.current += 1;
        return this.current;
    }
}

export default ClientId;
