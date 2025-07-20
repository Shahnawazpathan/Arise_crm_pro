import { Client } from '../types';
import clientsData from '../data/clients.json';

export const getClients = (): Promise<Client[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(clientsData as Client[]);
    }, 500);
  });
};
