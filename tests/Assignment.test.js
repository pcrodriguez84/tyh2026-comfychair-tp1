const Assignment = require("../src/Assignment");
const Paper = require("../src/Paper");
const User = require("../src/User");

describe("Assignment", () => {

    it("should represent the assignment of a reviewer to a paper", () => {

        const author = new User(
            "Author",
            "UNLP",
            "author@test.com",
            "123"
        );

        const reviewer = new User(
            "Reviewer",
            "UNLP",
            "reviewer@test.com",
            "123"
        );

        const paper = new Paper(
            "Paper title",
            [author],
            author
        );

        const assignment = new Assignment(
            paper,
            reviewer
        );

        expect(assignment.paper()).toBe(paper);
        expect(assignment.reviewer()).toBe(reviewer);
    });

});