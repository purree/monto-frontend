import { StorageMock } from './storage';
import { of } from 'rxjs';

export default {
    storage: new StorageMock(),
    firebaseUser: '',
    user: '',
    handleRedirectResult: '',
    gplus: {login:() => { return of({})}},
    googleLogin: () => { },
    signOut: () => { },
    nativeGoogleLogin: () => { },
    webGoogleLogin: () => {  },
    checkAccount: (user) => {},
}
