import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCcdhPKaVEEbl2-dm4hVaSbv700IkSovPY",
    authDomain: "whatsapp-clone-8645a.firebaseapp.com",
    databaseURL: "https://whatsapp-clone-8645a.firebaseio.com",
    projectId: "whatsapp-clone-8645a",
    storageBucket: "whatsapp-clone-8645a.appspot.com",
    messagingSenderId: "171955872569",
    appId: "1:171955872569:web:8c3fe8ff702a6156cdfee8"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth
                     .GoogleAuthProvider();

export { auth, provider };
