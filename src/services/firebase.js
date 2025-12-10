
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRhdcYX0pIe6oWRy-Foq8oUKK3SMd4cbA",
  authDomain: "las-puertas-del-olimpo.firebaseapp.com",
  projectId: "las-puertas-del-olimpo",
  storageBucket: "las-puertas-del-olimpo.firebasestorage.app",
  messagingSenderId: "882751834274",
  appId: "1:882751834274:web:2f360edd68928dd471effb"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app;