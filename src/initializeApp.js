import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig';
const pageAuthenticantion =() => {
    initializeApp(firebaseConfig);
}
export default pageAuthenticantion;