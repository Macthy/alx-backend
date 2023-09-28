import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';

const app = express();
const port = 1245;
const redisClient = redis.createClient();
const queue = kue.createQueue();

// Promisify Redis methods
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Function to reserve a seat
const reserveSeat = async (number) => {
  await setAsync('available_seats', number);
};

// Function to get the current number of available seats
const getCurrentAvailableSeats = async () => {
  const availableSeats = await getAsync('available_seats');
  return parseInt(availableSeats) || 0;
};

// Initialize the number of available seats to 50
reserveSeat(50);

// Initialize the reservationEnabled flag to true
let reservationEnabled = true;

// Middleware to parse JSON responses
app.use(express.json());

// Route: GET /available_seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats });
});

// Route: GET /reserve_seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue
    .create('reserve_seat')
    .save((err) => {
      if (err) {
        return res.json({ status: 'Reservation failed' });
      }
      res.json({ status: 'Reservation in process' });
    });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (errorMessage) => {
    console.error(`Seat reservation job ${job.id} failed: ${errorMessage}`);
  });
});

// Route: GET /process
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();
    
    if (availableSeats <= 0) {
      reservationEnabled = false;
      return done(new Error('Not enough seats available'));
    }
    
    await reserveSeat(availableSeats - 1);
    
    if (availableSeats - 1 <= 0) {
      reservationEnabled = false;
    }
    
    done();
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

