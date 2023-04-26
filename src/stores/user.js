import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { defineStore } from "pinia";
import router from "../router";

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
      try {
        await signOut(auth);
        this.userData = null;
        router.push("/login");
      } catch (error) {
        console.log(error);
      }
    },
    currentUser() {
      return new Promise((resolve, reject) => {
        const unsubcribe = onAuthStateChanged(
          auth,
          (user) => {
            if (user) {
              this.userData = {
                email: user.email,
                uid: user.uid,
              };
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
