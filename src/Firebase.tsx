
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDSfh5wpIArKZ0wdXxD2x4zaDiC35lb6BQ",
	authDomain: "zhizha-store.firebaseapp.com",
	databaseURL: "https://zhizha-store-default-rtdb.firebaseio.com",
	projectId: "zhizha-store",
	storageBucket: "zhizha-store.appspot.com",
	messagingSenderId: "1042330685074",
	appId: "1:1042330685074:web:723dbffa3256c1a35e204b",
	measurementId: "G-GC29JQ7ZJP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);