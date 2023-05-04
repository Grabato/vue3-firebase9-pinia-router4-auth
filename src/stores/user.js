import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { defineStore } from "pinia";
import router from "../router";
import { useDatabaseStore } from "./database";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSession: false,
  }),
  actions: {
    //REGISTRAR
    async registerUser(email, password) {
      this.loadingUser = true;
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.userData = { email: user.email, uid: user.uid };
        router.push("/");
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },
    //INICIAR SESIÓN
    async loginUser(email, password) {
      this.loadingUser = true;
      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.userData = { email: user.email, uid: user.uid };
        router.push("/");
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },
    //CERRAR SESIÓN
    async logoutUser() {
      this.loadingUser = true;
      const databaseStore = useDatabaseStore();
      try {
        await signOut(auth);
        router.push("/login");
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
        this.userData = null;
        databaseStore.$reset();
      }
    },
    currentUser() {
      return new Promise((resolve, reject) => {
        const unsubcribe = onAuthStateChanged(
          auth,
          (user) => {
            const databaseStore = useDatabaseStore();
            if (user) {
              this.userData = {
                email: user.email,
                uid: user.uid,
              };
            } else {
              this.userData = null;
              databaseStore.$reset();
            }
            resolve(user);
          },
          (e) => reject(e)
        );
        unsubcribe();
      });
    },
  },
});
