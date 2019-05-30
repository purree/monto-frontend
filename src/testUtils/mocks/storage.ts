export class StorageMock {
    driver: string;
    vals: {
        'userHref': '', 
        'user': {}
    };

    constructor() {
    }

    clear() {
        return new Promise<void>((res) => res())
    }

    ready() {
        return new Promise<LocalForage>((res) => res())
    }

    get(key: string) {
        return new Promise((res) => res(this.vals[key]))
    }

    set(key, val) {
        return new Promise((res) => {
            this.vals[key] = val;
            res()
        })
    }

    remove(key) {
        return new Promise((res) => {
            delete this.vals[key];
            res()
        })
    }
}