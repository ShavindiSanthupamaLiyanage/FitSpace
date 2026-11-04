import type { AuthSession, AuthUser, User } from '../types';

const USERS_URL = `${import.meta.env.BASE_URL}data/users.json`;
const TOKEN_LIFETIME_MS = 30 * 60 * 1000; // 30 minutes

// Users are loaded once from the JSON file and kept in memory.
// New registrations and password changes live here and are lost on refresh (demo only).
let usersCache: User[] | null = null;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadUsers = async (): Promise<User[]> => {
  if (usersCache === null) {
    const response = await fetch(USERS_URL);
    if (!response.ok) {
      throw new Error('Could not load user data. Please try again.');
    }
    usersCache = (await response.json()) as User[];
  }
  return usersCache;
};

const findUserByEmail = (users: User[], email: string): User | undefined =>
  users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());

const toAuthUser = (user: User): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const createSession = (user: User): AuthSession => ({
  user: toAuthUser(user),
  token: `mock-jwt-${user.id}-${Date.now()}`,
  expiresAt: Date.now() + TOKEN_LIFETIME_MS,
});

export const login = async (email: string, password: string): Promise<AuthSession> => {
  await delay(600); // simulate network
  const users = await loadUsers();
  const foundUser = findUserByEmail(users, email);
  if (!foundUser || foundUser.mockPassword !== password) {
    throw new Error('Incorrect email or password');
  }
  return createSession(foundUser);
};

export const register = async (name: string, email: string, password: string): Promise<void> => {
  await delay(600);
  const users = await loadUsers();
  if (findUserByEmail(users, email)) {
    throw new Error('An account with this email already exists');
  }
  users.push({
    id: users.length + 1,
    name: name.trim(),
    email: email.trim(),
    role: 'member',
    mockPassword: password,
  });
};

// Used by the Forgot Password page to decide whether the password fields unlock
export const emailExists = async (email: string): Promise<boolean> => {
  await delay(300);
  const users = await loadUsers();
  return findUserByEmail(users, email) !== undefined;
};

export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
  await delay(600);
  const users = await loadUsers();
  const account = findUserByEmail(users, email);
  if (!account) {
    throw new Error('No account found with this email address');
  }
  if (account.mockPassword === newPassword) {
    throw new Error('Your new password must be different from your current one');
  }
  account.mockPassword = newPassword;
};