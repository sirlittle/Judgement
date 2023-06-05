import "jest";
import {RemotePlayer} from "../objects/remote_player";
import {Card} from "judgment_utils";
import {assert} from "chai";
import {describe, expect, test} from '@jest/globals';


describe("Remote player can instantiate game", () => {
    test("Remote player can instantiate game", async () => {
        const url = "http://localhost:4000";
        const remotePlayer = new RemotePlayer(url, 0, "testGame");

        await remotePlayer.instantiateGame();
        await remotePlayer.setDealtCards([new Card(0, 0), new Card(0, 1), new Card(0, 2), new Card(0, 3)]);
        const cardToPlay = await remotePlayer.playCard([], {}, {}, new Card(0, 0));
        assert(cardToPlay instanceof Card);
}) });
