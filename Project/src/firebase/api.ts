import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { config } from './keys';
import { Estimate, Material, MaterialAdd } from '../interfaces/Common';

const firebaseConfig = config

// Initialize Firebase with your configuration
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const registerUser = async (email: string, password: string) => {
  try {
    // Create a new user in Firebase Authentication
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user) {
      // Store user data in Firestore, including email
      const db = firebase.firestore();
      const userRef = db.collection('users').doc(user.uid); // Assuming you have a "users" collection
      await userRef.set({
          role: 'user',
          email
      });

      return true; // Registration successful
    } else {
      console.error('Registration failed: User is null');
      return false; // Registration failed
    }
  } catch (error) {
    console.error('Registration failed:', error);
    return false; // Registration failed
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = firebase.auth().currentUser;
    if (!user) {
      return false
    }
    return {login:true,isAdmin, userId:user.uid}; // Login successful
  } catch (error) {
    console.error('Login failed:', error);
    return false; // Login failed
  }
};

export const logoutUser = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      await firebase.auth().signOut();
      resolve(true); // Logout successful
    } catch (error) {
      console.error('Logout failed:', error);
      resolve(false); // Logout failed
    }
    reject()
  });
};

// Function to check if a user is an admin
export const isAdmin = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const db = firebase.firestore();
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (userDoc.exists) {
          const userData = userDoc.data() as { role: string };
          resolve(userData?.role === 'admin');
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
      reject()
    });
  });
};

// Function to check if a user is an admin
export const isUser = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const db = firebase.firestore();
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          resolve(user.uid);
        } else {
          resolve("");
        }
      } else {
        resolve("");
      }
      reject()
    });
  });
};

// Function to get materials from Firestore
export const getMaterials = async (): Promise<Material[]> => {
  const db = firebase.firestore();
  const materialsRef = db.collection('materials');
  const snapshot = await materialsRef.get();

  const materials = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return materials as Material[];
};

// Function to add a new material to Firestore
export const addMaterial = async (material: MaterialAdd): Promise<Material | null> => {
    try {
      const db = firebase.firestore();
    const docRef = await db.collection('materials').add(material);
    const snapshot = await docRef.get();

    return {
      id: docRef.id,
      ...snapshot.data(),
    } as Material;
  } catch (error) {
    console.error('Error adding material:', error);
    return null;
  }
};

// Function to update a material in Firestore
export const updateMaterial = async (id: string, newUnitPrice: number): Promise<void> => {
    try {
      const db = firebase.firestore();
    await db.collection('materials').doc(id).update({ unitPrice: newUnitPrice });
  } catch (error) {
    console.error('Error updating material:', error);
  }
};

// Function to remove a material from Firestore
export const removeMaterial = async (id: string): Promise<void> => {
    try {
      const db = firebase.firestore();
    await db.collection('materials').doc(id).delete();
  } catch (error) {
    console.error('Error removing material:', error);
  }
};

//To get user estimate from firestore
export const getUserEstimate = (userId: string): Promise<Estimate[] | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = firebase.firestore();
      const userRef = db.collection('users').doc(userId);

      // Get the user's estimate field
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      if (userData && userData.estimate) {
        resolve(userData.estimate);
      } else {
        console.log('User estimate not found.');
        resolve(null);
      }
    } catch (error) {
      console.error('Error fetching user estimate:', error);
      resolve(null);
    }
    reject()
  });
};

export const updateUserEstimate = async (userId:string, userEstimate:Estimate[]) => {
  try {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(userId);

    // Update the user's estimate field with the new data
    await userRef.update({ estimate: userEstimate });

    console.log('User estimate updated successfully.');
    return true;
  } catch (error) {
    console.error('Error updating user estimate:', error);
    return false;
  }
};