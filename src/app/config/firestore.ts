import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
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
      const teamData = teamDoc.data();
      
      // Obtenemos el array de emails y proyectos
      const emails = teamData.teamUsersEmails || [];
      const projectsIds = teamData.teamProjectsId || [];
      
      const team: Team = {
        teamId,
        teamName: teamData.teamName || '',
        teamDescription: teamData.teamDescription || '',
        teamAdminEmail: teamData.teamAdminEmail || '',
        teamAdminId: teamData.teamAdminId || '',
        teamProjectsIds: projectsIds,
        teamEmails: emails,
        teamUsersCount: emails.length,
        teamProjectsCount: projectsIds.length
      };

      return team;
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

export const getUserApiKeys = async (userId: string): Promise<string[]> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()?.userApiKeys || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting API keys:', error);
    return [];
  }
};

interface JobSection {
  content: string;
  number: string;
  title: string;
}

export interface Job {
  jobId: string;
  jobName: string;
  jobDescription: string;
  jobSections: JobSection[];
  jobStatus: string;
  jobTotalSections: number;
  jobActualSections: number;
}

export const getUserJobs = async (userId: string): Promise<Job[]> => {
  try {
    // Primero verificamos si el usuario existe y tiene jobs
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      console.error('User document does not exist');
      return [];
    }

    const jobIds = userDoc.data()?.userJobsIds || [];
    if (!jobIds.length) {
      return [];
    }

    const jobPromises = jobIds.map(async (jobId: string) => {
      try {
        const jobDoc = await getDoc(doc(db, 'superinference', jobId));
        if (!jobDoc.exists()) {
          console.warn(`Job ${jobId} not found`);
          return null;
        }

        const data = jobDoc.data();
        return {
          jobId,
          jobName: data.jobName || '',
          jobDescription: data.jobDescription || '',
          jobSections: data.jobSections || [],
          jobStatus: data.jobStatus || 'pending',
          jobTotalSections: data.jobTotalSections || 0,
          jobActualSections: data.jobActualSections || 0
        };
      } catch (error) {
        console.error(`Error fetching job ${jobId}:`, error);
        return null;
      }
    });

    const jobs = await Promise.all(jobPromises);
    return jobs.filter((j): j is Job => j !== null);
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    return [];
  }
};

export { db };
