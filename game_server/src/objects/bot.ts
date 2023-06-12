export class Bot {
    botUrl: string; 
    botDescription: string; 
    creator: string;
    botName: string;
    numberOfGamesWon: number;
    numberOfGamesPlayed: number;
    eloScore: number;
    remote: boolean;
    botId: string;

    constructor(botId: string, botUrl: string, botDescription: string, creator: string, botName: string, remote=true, numberOfGamesWon: number = 0, numberOfGamesPlayed: number= 0, eloScore: number=1500) {
        this.botId = botId;
        this.botUrl = botUrl;
        this.botDescription = botDescription;
        this.creator = creator;
        this.botName = botName;
        this.numberOfGamesWon = numberOfGamesWon;
        this.numberOfGamesPlayed = numberOfGamesPlayed;
        this.eloScore = eloScore;
        this.remote = remote;
    }
    toFirestore(): any {
        return {
            botUrl: this.botUrl,
            botDescription: this.botDescription,
            creator: this.creator,
            botName: this.botName,
            numberOfGamesWon: this.numberOfGamesWon,
            numberOfGamesPlayed: this.numberOfGamesPlayed,
            eloScore: this.eloScore,
        };
    }
}


