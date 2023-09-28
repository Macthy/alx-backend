#!/usr/bin/node
import { createClient, print } from 'redis';

const client = createClient();

// Event handler for errors
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Event handler for successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');

  // Create a hash with specified key and values using hset
  client.hset('HolbertonSchools', 'Portland', 50, print);
  client.hset('HolbertonSchools', 'Seattle', 80, print);
  client.hset('HolbertonSchools', 'New York', 20, print);
  client.hset('HolbertonSchools', 'Bogota', 20, print);
  client.hset('HolbertonSchools', 'Cali', 40, print);
  client.hset('HolbertonSchools', 'Paris', 2, print);

  // Use hgetall to retrieve the hash and display it
  client.hgetall('HolbertonSchools', (err, reply) => {
    if (err) {
      console.error('Error:', err);
      return;
    }

    console.log(reply);

    // Quit the client after setting the values and displaying the hash
    client.quit();
  });
});

