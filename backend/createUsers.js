const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api/register';

async function createUser(email, password, role) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(`User created: ${email} with role ${role}`);
    } else {
      console.error(`Failed to create user ${email}: ${data.error}`);
    }
  } catch (error) {
    console.error(`Error creating user ${email}:`, error);
  }
}

async function main() {
  await createUser('employee1@arise.com', 'password123', 'employee');
  await createUser('client1@arise.com', 'password123', 'client');
}

main();
