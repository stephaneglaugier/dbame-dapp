const Dbame = artifacts.require("Dbame");

contract("Dbame", () => {
    let dbameInstance;

    beforeEach(async () => {
        dbameInstance = await Dbame.new();
    });

    it("should allow casting a vote", async () => {
        const vote = "option1";
        await dbameInstance.castVote(vote);

        const allVotes = await dbameInstance.getAllVotes();
        assert.equal(allVotes.length, 1);
        assert.equal(allVotes[0], vote);
    });

    it("should allow casting multiple votes", async () => {
        const votes = ["option1", "option2", "option3"];

        for (const vote of votes) {
            await dbameInstance.castVote(vote);
        }

        const allVotes = await dbameInstance.getAllVotes();
        assert.equal(allVotes.length, votes.length);

        for (let i = 0; i < votes.length; i++) {
            assert.equal(allVotes[i], votes[i]);
        }
    });

    it("should return all votes", async () => {
        const votes = ["option1", "option2", "option3"];

        for (const vote of votes) {
            await dbameInstance.castVote(vote);
        }

        const allVotes = await dbameInstance.getAllVotes();
        assert.equal(allVotes.length, votes.length);

        for (let i = 0; i < votes.length; i++) {
            assert.equal(allVotes[i], votes[i]);
        }
    });
});
