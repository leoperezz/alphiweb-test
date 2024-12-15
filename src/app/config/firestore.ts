import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app } from './firebase';
import { Team } from '../types/team';

const db = getFirestore(app);

export const saveLlamaCloudKey = async (userId: string, apiKey: string) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      userLlamaCloud: apiKey
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving API key:', error);
    return false;
  }
};

export const getLlamaCloudKey = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()?.userLlamaCloud || '';
    }
    return '';
  } catch (error) {
    console.error('Error getting API key:', error);
    return '';
  }
};

export const checkUserExists = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking user:', error);
    return false;
  }
};

interface Notification {
  date: string;
  message: string;
}

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return (docSnap.data()?.userNotifications || []).slice(0, 5);
    }
    return [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

export const getGlobalProjects = async () => {
  try {
    const globalsDoc = await getDoc(doc(db, 'global', 'projects'));
    const globalProjectIds = globalsDoc.data()?.projects || [];
    
    const projectPromises = globalProjectIds.map(async (projectId: string) => {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        return {
          projectId,
          ...projectDoc.data(),
          isGlobal: true
        };
      }
      return null;
    });

    return (await Promise.all(projectPromises)).filter((p) => p !== null);
  } catch (error) {
    console.error('Error fetching global projects:', error);
    return [];
  }
};


export const getUserTeams = async (userId: string): Promise<string[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data()?.userTeams || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting user teams:', error);
    return [];
  }
};

export const getTeamInfo = async (teamId: string): Promise<Team | null> => {
  try {
    const teamDoc = await getDoc(doc(db, 'teams', teamId));
    if (teamDoc.exists()) {
      return {
        teamId,
        ...teamDoc.data()
      } as Team;
    }
    return null;
  } catch (error) {
    console.error('Error getting team info:', error);
    return null;
  }
};

export const getAllUserTeams = async (userId: string): Promise<Team[]> => {
  try {
    const teamIds = await getUserTeams(userId);
    const teamsPromises = teamIds.map(teamId => getTeamInfo(teamId));
    const teams = await Promise.all(teamsPromises);
    return teams.filter((team): team is Team => team !== null);
  } catch (error) {
    console.error('Error getting all user teams:', error);
    return [];
  }
};

export { db };
