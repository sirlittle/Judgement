// Instantiate bot with game
// the bot needs to get some token from the server
// the bot needs to be able to query for data about some game
// the game needs to be able to ping the bot for a move

// set up express server
import express from "express";

const app = express();
const port = 4000;
app.use(express.json());
app.listen(port, () => {
    console.log(`Game server listening at http://localhost:${port}`);
  });
  
// set up an express endpt for the game to ping
app.post("/instantiateGame", (req, res) => {
    const gameId = req.body["gameId"];
    console.log(gameId);
    res.send(gameId);
}); 

app.post("/predict", (req, res) => {
    // Game Data needs the following information
    // 1. The game id
    // 2. The player id
    // 3. The current round
    // 4. The current hand
    // 5. The current trump card
    // 6. the predictions so far
    res.send("Hello World!");
});

app.post("/playCard", (req, res) => {
    // Game Data provided to the bot
    // 1. Game id
    // 2. Player id
    // 3. Current round
    // 4. Current hand
    // 5. Current trump card
    // 6. Current predictions
    // 7. Current moves so far
    res.send("Hello World!");
});
