export interface Team {
    teamId: string;
    teamName: string;
    teamDescription: string;
    teamAdminEmail: string;
    teamAdminId: string;
    teamEmails: string[];
    teamProjectsIds?: string[];
    teamUsersIds?: string[];
    teamUsersCount: number;
    teamProjectsCount: number;
  }