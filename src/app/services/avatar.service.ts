import { Auth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { docData, Firestore, setDoc } from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';
import { Photo } from '@capacitor/camera';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) { }

  getUserProfile(){
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user?.uid}`);
    return  docData(userDocRef);
  }

  async uploadImage(cameraFile: Photo){
    const user = this.auth.currentUser;
    const path = `uploads/${user?.uid}/profile.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, path);

      const imageUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(this.firestore, `users/${user?.uid}`);
      await setDoc(userDocRef, {
        imageUrl,
      });
      return true;

    } catch (e) {
      return null;
    }
  }
}
