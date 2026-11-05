import type { ContactMessage } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Demo only: messages are kept in memory and are lost on refresh, like the rest of the data
const receivedMessages: ContactMessage[] = [];

export const sendContactMessage = async (message: ContactMessage): Promise<void> => {
  await delay(800); // simulate a network request
  receivedMessages.push({ ...message });
};