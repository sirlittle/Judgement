type Bot = {
    id: string;
    elo: number;
};

type EloMap = {
    [id: string]: number;
};

export function calculateElo(players: Bot[], results: string[]): EloMap {
    // Set a K-factor, which determines the maximum change in rating
    const k = 50;

    // Convert the array of results into a map for easier lookup
    let resultMap = new Map<string, number>();
    results.forEach((id, index) => {
        resultMap.set(id, index + 1);
    });

    // Convert the array of players into a map for easier lookup
    let eloMap: EloMap = {};
    players.forEach((player) => {
        eloMap[player.id] = player.elo;
    });

    // Iterate over each pair of players
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            let playerA = players[i];
            let playerB = players[j];

            // Calculate expected scores
            let expectedScoreA =
                1 /
                (1 +
                    Math.pow(
                        10,
                        (eloMap[playerB.id] - eloMap[playerA.id]) / 400
                    ));
            let expectedScoreB = 1 - expectedScoreA;

            // Get the actual scores
            let rankA = resultMap.get(playerA.id);
            let rankB = resultMap.get(playerB.id);
            
            if (rankA === undefined || rankB === undefined) {
              throw new Error(`Ranking not found for one or more players: ${playerA.id}, ${playerB.id}`);
            }
            
            let actualScoreA = rankA < rankB ? 1 : 0;
                        let actualScoreB = 1 - actualScoreA;

            // Update Elo ratings
            eloMap[playerA.id] =
                eloMap[playerA.id] + k * (actualScoreA - expectedScoreA);
            eloMap[playerB.id] =
                eloMap[playerB.id] + k * (actualScoreB - expectedScoreB);
        }
    }

    return eloMap;
}
