const Dbame = artifacts.require("Dbame");

contract("Dbame", () => {
    let dbameInstance;

    beforeEach(async () => {
        dbameInstance = await Dbame.new();
    });

    it("should allow casting a vote", async () => {
        const option1 = "0x3bc50285f7cfaaf4a80477583a5892e8f8fdc9207b995fe13260fb5420b5594d";
        const option2 = "0x0000000000000000000000000000000000000000000000000000000000000000";
        await dbameInstance.castVote(option1, option2);

        const allVotes = await dbameInstance.getAllVotes();
        assert.equal(allVotes.length, 1);
        assert.equal(allVotes[0][0], option1);
        assert.equal(allVotes[0][1], option2);
    });

    it("should allow casting multiple votes", async () => {
        const votes = [
            {
                option1: "0x3bc50285f7cfaaf4a80477583a5892e8f8fdc9207b995fe13260fb5420b5594d",
                option2: "0x0000000000000000000000000000000000000000000000000000000000000000"
            },
            {
                option1: "0x62390ff58b52fb1052d94817ba56636e1dbad6f3c621545034e7a2f800ec141b",
                option2: "0x0000000000000000000000000000000000000000000000000000000000000001"
            },
            {
                option1: "0xe769b5425bfc3324af3524562599846158b525b1c29cdb6dd8d2381a2a3a745b",
                option2: "0x0000000000000000000000000000000000000000000000000000000000000002"
            }
        ];

        for (const vote of votes) {
            await dbameInstance.castVote(vote.option1, vote.option2);
        }

        const allVotes = await dbameInstance.getAllVotes();
        assert.equal(allVotes.length, votes.length);

        for (let i = 0; i < votes.length; i++) {
            assert.equal(allVotes[i][0], votes[i].option1);
            assert.equal(allVotes[i][1], votes[i].option2);
        }
    });

    it("should return all votes", async () => {
        const votes = [
            [
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x0000000000000000000000000000000000000000000000000000000000000000"
            ],
            [
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000001"
            ],
            [
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x0000000000000000000000000000000000000000000000000000000000000002"
            ]
        ];
        for (const vote of votes) {
            await dbameInstance.castVote(vote[0], vote[1]);
        }

        const allVotes = await dbameInstance.getAllVotes();
        assert.equal(allVotes.length, votes.length);

        for (let i = 0; i < votes.length; i++) {
            assert.equal(allVotes[i][0], votes[i][0]);
            assert.equal(allVotes[i][1], votes[i][1]);
        }
    });
});