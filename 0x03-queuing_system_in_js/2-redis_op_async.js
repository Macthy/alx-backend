#!/usr/bin/node
import { createClient } from 'redis';
import { promisify } from 'util'; // Import the promisify function

const client = createClient();

// Event handler for errors
client.on('error', (err) => {
  console.log('Redis Client not connected to the server.', err.toString());
});

// Event handler for successful connection
client.on('connect', () => {
  console.log('Redis Client connected to the server.');
});

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, redis.print()); // Assuming you have a 'redis' object named 'redis' for printing
}

// Use promisify to create an asynchronous version of client.get
const asyncGet = promisify(client.get).bind(client);

// Modify the displaySchoolValue function to use async/await
const displaySchoolValue = async (schoolName) => {
  try {
    const value = await asyncGet(schoolName); // Use await to wait for the Promise to resolve
    console.log(value);
  } catch (error) {
    console.error('Error:', error); // Handle any errors that occur during the async operation
  }
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');

