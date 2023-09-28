#!/usr/bin/node
// Import the necessary modules
import redis from 'redis';

// Create a Redis client
const client = redis.createClient();

// Handle Redis client errors
client.on('error', (err) => {
  console.error('Redis Client not connected to the server:', err);
});

// Handle Redis client connection
client.on('connect', () => {
  console.log('Redis Client connected to the server.');
});

// Function to set a new school name and value
const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error('Error setting school value:', err);
    } else {
      console.log('Reply:' ,reply);
    }
  });
};

// Function to display the value of a school
const displaySchoolValue = (schoolName) => {
  client.get(schoolName, (err, value) => {
    if (err) {
      console.error('Error getting school value:', err);
    } else {
      console.log(value);
    }
  });
};

// Usage of the functions
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');

