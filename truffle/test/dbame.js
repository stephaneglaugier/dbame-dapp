const Dbame = artifacts.require("Dbame");

contract("Dbame", () => {
    let dbameInstance;

    beforeEach(async () => {
        dbameInstance = await Dbame.new();
    });

    it("should allow casting a vote", async () => {
        const ballot = "0x3bc50285f7cfaaf4a80477583a5892e8f8fdc9207b995fe13260fb5420b5594d";
        await dbameInstance.castVote(ballot);

        const allVotes = await dbameInstance.getAllVotes();
        assert.equal(allVotes.length, 1);
        assert.equal(allVotes[0], ballot);
    });

    it("should allow casting multiple votes", async () => {
        const ballots = [
            "0x3bc50285f7cfaaf4a80477583a5892e8f8fdc9207b995fe13260fb5420b5594d",
            "0x62390ff58b52fb1052d94817ba56636e1dbad6f3c621545034e7a2f800ec141b",
            "0xe769b5425bfc3324af3524562599846158b525b1c29cdb6dd8d2381a2a3a745b"
        ];

        for (const ballot of ballots) {
            await dbameInstance.castVote(ballot);
        }

        const allVotes = await dbameInstance.getAllVotes();
        assert.equal(allVotes.length, ballots.length);

        for (let i = 0; i < ballots.length; i++) {
            assert.equal(allVotes[i], ballots[i]);
        }
    });

    it("should return all votes", async () => {
        const ballots = [
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000002"
        ];
        for (const ballot of ballots) {
            await dbameInstance.castVote(ballot);
        }

        const allVotes = await dbameInstance.getAllVotes();
        assert.equal(allVotes.length, ballots.length);

        for (let i = 0; i < ballots.length; i++) {
            assert.equal(allVotes[i], ballots[i]);
        }
    });
});
