const Dbame = artifacts.require("Dbame");

contract("Dbame", (accounts) => {
    let dbameInstance;
    const owner = accounts[0];
    const nonOwner = accounts[1];

    beforeEach(async () => {
        dbameInstance = await Dbame.new({ from: owner });
    });

    it("should not allow casting a vote before the election has started", async () => {
        try {
            const vote = "option1";
            await dbameInstance.castVote(vote, { from: nonOwner });
            assert.fail("Casting a vote was allowed before the election started");
        } catch (err) {
            assert.include(err.message, "Election must be started and not stopped.", "Error message should contain 'Election must be started and not stopped.'");
        }
    });

    it("should allow starting the election", async () => {
        await dbameInstance.startElection({ from: owner });
        const electionStarted = await dbameInstance.isElectionStarted();
        assert.equal(electionStarted, true, "Election should have been started");
    });

    it("should not allow starting the election by non-owner", async () => {
        try {
            await dbameInstance.startElection({ from: nonOwner });
            assert.fail("Starting the election was allowed by non-owner");
        } catch (err) {
            assert.include(err.message, "Only the contract owner can perform this action.", "Error message should contain 'Only the contract owner can perform this action.'");
        }
    });

    context("when election started", () => {
        beforeEach(async () => {
            await dbameInstance.startElection({ from: owner });
        });

        it("should allow casting a vote", async () => {
            const vote = "option1";
            await dbameInstance.castVote(vote, { from: nonOwner });

            const allVotes = await dbameInstance.getAllVotes();
            assert.equal(allVotes.length, 1);
            assert.equal(allVotes[0], vote);
        });

        it("should allow casting multiple votes", async () => {
            const votes = ["option1", "option2", "option3"];

            for (const vote of votes) {
                await dbameInstance.castVote(vote, { from: nonOwner });
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
                await dbameInstance.castVote(vote, { from: nonOwner });
            }

            const allVotes = await dbameInstance.getAllVotes();
            assert.equal(allVotes.length, votes.length);

            for (let i = 0; i < votes.length; i++) {
                assert.equal(allVotes[i], votes[i]);
            }
        });

        it("should allow stopping the election", async () => {
            await dbameInstance.stopElection({ from: owner });
            const electionStopped = await dbameInstance.isElectionStopped();
            assert.equal(electionStopped, true, "Election should have been stopped");
        });

        it("should not allow stopping the election by non-owner", async () => {
            try {
                await dbameInstance.stopElection({ from: nonOwner });
                assert.fail("Stopping the election was allowed by non-owner");
            } catch (err) {
                assert.include(err.message, "Only the contract owner can perform this action.", "Error message should contain 'Only the contract owner can perform this action.'");
            }
        });
        context("when election stopped", () => {
            beforeEach(async () => {
                await dbameInstance.stopElection({ from: owner });
            });

            it("should not allow casting a vote after the election has been stopped", async () => {
                try {
                    const vote = "option1";
                    await dbameInstance.castVote(vote, { from: nonOwner });
                    assert.fail("Casting a vote was allowed after the election was stopped");
                } catch (err) {
                    assert.include(err.message, "Election must be started and not stopped.", "Error message should contain 'Election must be started and not stopped.'");
                }
            });
        });
    });
});