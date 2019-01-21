import * as firebase from 'firebase';
// import 'firebase/auth';
// import 'firebase/database';

var config = {
  apiKey: "AIzaSyDVs10hAUStxGmb_TxSEIR7iW78NyqwVKE",
  authDomain: "stock-app-b7556.firebaseapp.com",
  databaseURL: "https://stock-app-b7556.firebaseio.com",
  projectId: "stock-app-b7556",
  storageBucket: "stock-app-b7556.appspot.com",
  messagingSenderId: "174869200663"
};

firebase.initializeApp(config);
var db = firebase.firestore();
db.settings({timestampsInSnapshots: true});
var provider = new firebase.auth.GoogleAuthProvider();
var userId;

export function tryToGetUserId() {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        userId = user.uid;
        resolve(true);
      } else {
        resolve(false);
      }
    });
  })
}

export function signOut() {
  return firebase.auth().signOut().then(() => {
  }).catch(function(error) {
    console.log(error);
    alert(error.message);
  });
}

export function signIn() {
  // provider.setCustomParameters({
  //   prompt: 'select_account'
  // });
  return firebase.auth().signInWithRedirect(provider).then(result => {
    userId = result.user.uid;
  }).catch(error => {
    console.log(error);
    alert(error.message);
  });
}

export function getSymbolsFromDb() {
  return db.collection("users").doc(userId).get().then(doc => {
    const data = doc.data();
    if (data) {
      return data.symbols;
    } else {
      return db.collection("users").doc(userId).set({
        symbols: []
      }, { merge: true }).then(() => ([]));
    }
  });
}

export function reorderSymbolsInDb(symbolsInNewOrder) {
  return db.collection("users").doc(userId).update({
    symbols: symbolsInNewOrder
  });
}

export function addSymbolToDb(symbol) {
  return db.collection("users").doc(userId).update({
    symbols: firebase.firestore.FieldValue.arrayUnion(symbol)
  });
}

export function deleteSymbolFromDb(symbol) {
  return db.collection("users").doc(userId).update({
    symbols: firebase.firestore.FieldValue.arrayRemove(symbol)
  });
}