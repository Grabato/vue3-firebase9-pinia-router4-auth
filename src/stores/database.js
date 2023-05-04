import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { db } from "../firebaseConfig";
import { defineStore } from "pinia";
import { auth } from "../firebaseConfig";
import { nanoid } from "nanoid";
import router from "../router";

export const useDatabaseStore = defineStore("database", {
  state: () => ({
    documents: [],
    loadingDoc: false,
  }),
  actions: {
    async getUrls() {
      if (this.documents.length !== 0) {
        return;
      }

      this.loadingDoc = true;
      try {
        const q = query(
          collection(db, "urls"),
          where("user", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          //console.log(doc.id, doc.data());
          this.documents.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingDoc = false;
      }
    },
    async addUrl(name) {
      this.loadingDoc = true;
      try {
        const docObjeto = {
          name: name,
          short: nanoid(5),
          user: auth.currentUser.uid,
        };
        const q = query(collection(db, "urls"));
        const docRef = await addDoc(q, docObjeto);
        this.documents.push({
          id: docRef.id,
          ...docObjeto,
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingDoc = false;
      }
    },

    async leerUrl(id) {
      this.loadingDoc = true;
      try {
        const docRef = doc(db, "urls", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("no existe el doc");
        }

        if (docSnap.data().user !== auth.currentUser.uid) {
          throw new Error("no le pertenece ese documento");
        }

        return docSnap.data().name;
      } catch (error) {
        console.log(error.message);
      } finally {
        this.loadingDoc = false;
      }
    },

    async updateUrl(id, name) {
      this.loadingDoc = true;
      try {
        const docRef = doc(db, "urls", id);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error("no existe el doc");
        }

        if (docSnap.data().user !== auth.currentUser.uid) {
          throw new Error("no le pertenece ese documento");
        }

        await updateDoc(docRef, {
          name: name,
        });

        this.documents = this.documents.map((item) =>
          item.id === id ? { ...item, name: name } : item
        );
        router.push("/");
      } catch (error) {
        console.log(error.message);
      } finally {
        this.loadingDoc = false;
      }
    },

    async deleteUrl(id) {
      try {
        const docRef = doc(db, "urls", id);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error("no existe el doc");
        }

        if (docSnap.data().user !== auth.currentUser.uid) {
          throw new Error("no le pertenece ese documento");
        }

        await deleteDoc(docRef);
        this.documents = this.documents.filter((item) => item.id !== id);
      } catch (error) {
        console.log(error.message);
      } finally {
      }
    },
  },
});
