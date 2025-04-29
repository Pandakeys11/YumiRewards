import { db, auth, storage } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    query, 
    orderBy, 
    limit, 
    getDocs,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Submit score to Firebase
export async function submitScoreToFirebase(scoreData) {
    try {
        const scoresRef = collection(db, 'scores');
        await addDoc(scoresRef, {
            ...scoreData,
            timestamp: serverTimestamp()
        });
        console.log("Score submitted successfully");
    } catch (error) {
        console.error("Error submitting score:", error);
    }
}

// Update user profile in Firebase
export async function updateUserProfile(userData) {
    try {
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('username', '==', userData.username));
        const querySnapshot = await getDocs(userQuery);
        
        if (querySnapshot.empty) {
            // Create new user profile
            await addDoc(usersRef, {
                ...userData,
                createdAt: serverTimestamp()
            });
        } else {
            // Update existing user profile
            const userDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, 'users', userDoc.id), {
                ...userData,
                updatedAt: serverTimestamp()
            });
        }
        console.log("Profile updated successfully");
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}

// Fetch leaderboard from Firebase
export async function fetchLeaderboard(limit = 5) {
    try {
        const scoresRef = collection(db, 'scores');
        const q = query(
            scoresRef,
            orderBy('score', 'desc'),
            limit(limit)
        );
        
        const querySnapshot = await getDocs(q);
        const leaderboard = [];
        
        querySnapshot.forEach((doc) => {
            leaderboard.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return leaderboard;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
}

// Upload profile picture to Firebase Storage
export async function uploadProfilePicture(file, username) {
    try {
        const storageRef = ref(storage, `profile-pictures/${username}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        return null;
    }
}

// Get user profile from Firebase
export async function getUserProfile(username) {
    try {
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(userQuery);
        
        if (!querySnapshot.empty) {
            return {
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data()
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

// Get user's top scores from Firebase
export async function getUserTopScores(username, limit = 5) {
    try {
        const scoresRef = collection(db, 'scores');
        const q = query(
            scoresRef,
            where('username', '==', username),
            orderBy('score', 'desc'),
            limit(limit)
        );
        
        const querySnapshot = await getDocs(q);
        const scores = [];
        
        querySnapshot.forEach((doc) => {
            scores.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return scores;
    } catch (error) {
        console.error("Error fetching user scores:", error);
        return [];
    }
} 