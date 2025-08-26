interface UserData {
  id?: string;
  isNewUser?: boolean;
  lastVisit?: Date;
  preferences?: any;
  sessionCount?: number;
}

class UserService {
  private userData: UserData = {};

  // Get user data from localStorage or API
  getUserData(): UserData {
    const stored = localStorage.getItem('userData');
    if (stored) {
      this.userData = JSON.parse(stored);
    }
    return this.userData;
  }

  // Save user data
  saveUserData(data: Partial<UserData>): void {
    this.userData = { ...this.userData, ...data };
    localStorage.setItem('userData', JSON.stringify(this.userData));
  }

  // Determine message type based on user data
  getMessageType(): string {
    const userData = this.getUserData();
    
    if (!userData.isNewUser && userData.sessionCount && userData.sessionCount > 1) {
      return 'returning';
    } else if (userData.lastVisit && this.isFirstVisitToday(userData.lastVisit)) {
      return 'daily';
    } else {
      return 'onboarding';
    }
    // return 'onboarding';
  }

  // Check if this is the first visit today
  private isFirstVisitToday(lastVisit: Date): boolean {
    const today = new Date();
    const lastVisitDate = new Date(lastVisit);
    
    return today.toDateString() !== lastVisitDate.toDateString();
  }

  // Update session count
  updateSessionCount(): void {
    const userData = this.getUserData();
    const sessionCount = 1;
    this.saveUserData({ 
      sessionCount,
      lastVisit: new Date(),
      isNewUser: true

    });
  }
}

export default UserService;
