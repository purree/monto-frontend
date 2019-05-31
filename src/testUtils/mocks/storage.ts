import { of } from 'rxjs';

export class StorageMock {
    driver: string;
    vals: {
        userHref: ''
    }

    values = {
        userHref: "/user/1"
    }

    constructor() {
    }

    clear() {
        return new Promise<void>((res) => res())
    }

    ready() {
        return new Promise<LocalForage>((res) => res())
    }

    async get(key: string) {
        return await of(this.values.userHref);
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