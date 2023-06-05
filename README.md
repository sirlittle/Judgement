# Judgement

List of things that need to be understood:

- How to make Judgment Utils a proper package so that it can be imported by game_bot and game_server.
- Need to run npm link frequently.
- Outline of the game_bot is created, need to actively fill in the pieces and then have game_server run games with 

## How To Run

In order to see output on the site Front End, you need to run both the game server and the game site.

To run game server, navigate to the game_server folder and run
```
npm run build
npm run start
```

Now, the server raw output can be accessed from http://localhost:8080/ on your local machine 

Then to run the website, navigate to judgement-site and run

```
npm run dev
```
The site will automatically recompile when you save changes in the folder and you can access it via http://localhost:3000. 

## Current Progress

Please view this Notion Page here to see what work needs to get done for the continued progress of this repo.

Ignore everything in the old_python_judgement folder as it is deprecated code.

## What is Judgement

Judgement is a simple trump based card game. The rules of the game can be found [here](http://card-games.wonderhowto.com/how-to/play-card-game-judgment-0122237/) 

The goal of this project is to provide easy access to anyone who wants to build 
and test an AI to play the game of Judgement. Currently I have created the game
as well as a few straightforward AIs as an example.

I currently want to take this project in the direction of gathering large amount
of statistics from the game itself while simulating the game many thousands of times.
This way, better AIs can be built and also cool bits about the game can be gleaned
such as how much the game is based on luck and how much based on stratergy.

We will be deploying this game to a server somewhere and then allowing folks to build their
bots to compete against each other. All the bot will need to do will be to communicate via 
sending API Calls.

- [X] Complete a working text based game 
- [X] Create a Human Bot to allow user input
- [ ] Make game graphics based rather than text based
- [X] Create simple AI bot templates
- [ ] Pull different stats from the game
- [ ] Analyze stats and make cool graphs
