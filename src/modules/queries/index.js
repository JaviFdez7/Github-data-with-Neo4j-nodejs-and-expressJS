// Create a router for handling API routes
const express = require('express');
const router = express.Router();
const database = require('../../database/db');
const basePath = '/query';
const {createRepositoriesIssuesAndAssigneesFromUser,createRepositoriesAndCollaboratorsFromUser} = require('../repository/services/RepositoryService');
const {createFollowersAndFollowingFromUser} = require('../user/services/UserService');
// Endpoint to find all assignees in common issues where the provided username is also an assignee
router.get(basePath+ '/findAssigneesInCommonIssues/:username', async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            res.status(400).json({ error: 'Missing username parameter' });
            return;
        }
        console.log(username);
        //this must be done allwas in order to have the data in the database
        await createRepositoriesIssuesAndAssigneesFromUser({username: username});
        const existingUserQuery = `
            MATCH (u:User {username: "${username}"})-[:IS_ASSIGNED_TO]->(i:Issue)<-[:IS_ASSIGNED_TO]-(assignee:User)
            WHERE NOT u.username = assignee.username
            RETURN DISTINCT assignee
        `;

    var user = await database.executeQuery(existingUserQuery);
        res.json({ message: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to list shared followers between two users
router.get(basePath + '/listSharedFollowers/:username1/:username2', async (req, res) => {
    try {
        const username1 = req.params.username1;
        const username2 = req.params.username2;
        if (!username1 || !username2) {
            res.status(400).json({ error: 'Missing username1 or username2 parameter' });
            return;
        }
        await createFollowersAndFollowingFromUser({username: username1});
        await createFollowersAndFollowingFromUser({username: username2});
        const followersQuery = `
            MATCH (u1:User {username: "${username1}"})<-[:FOLLOWS]-(f:User)-[:FOLLOWS]->(u2:User {username: "${username2}"})
            RETURN DISTINCT f.username AS follower
        `;
        const followers = await database.executeQuery(followersQuery);
        res.json({ followers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to find shared issues between two users
router.get(basePath + '/findSharedIssues/:username1/:username2', async (req, res) => {
    try {
        const username1 = req.params.username1;
        const username2 = req.params.username2;
        if (!username1 || !username2) {
            res.status(400).json({ error: 'Missing username1 or username2 parameter' });
            return;
        }
        await createRepositoriesIssuesAndAssigneesFromUser({username: username1});
        const issuesQuery = `
            MATCH (u1:User {username: "${username1}"})-[:IS_ASSIGNED_TO]->(i:Issue)<-[:IS_ASSIGNED_TO]-(u2:User {username: "${username2}"})
            RETURN DISTINCT i
        `;
        const issues = await database.executeQuery(issuesQuery);
        res.json({ issues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to find issues not assigned to a specific user in a specific repository by name
router.get(basePath + '/findNonUserAssignedIssues/:username/:repositoryName', async (req, res) => {
    try {
        const username = req.params.username;
        const repositoryName = req.params.repositoryName;
        if (!username || !repositoryName) {
            res.status(400).json({ error: 'Missing username or repository name parameter' });
            return;
        }
        await createRepositoriesIssuesAndAssigneesFromUser({username: username});
        const query = `
        MATCH (u:User {username: "${username}"}), (r:Repository {name: "${repositoryName}"})
        MATCH (r)-[:HAS]->(i:Issue)
        WHERE NOT (i)<-[:IS_ASSIGNED_TO]-(u)
        RETURN i
    `;
        const issues = await database.executeQuery(query);
        res.json({ issues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to find all users contributing in repositories contributed by a specific user
router.get(basePath + '/findAllUsersContributingInRepositoriesContributedBy/:username', async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            res.status(400).json({ error: 'Missing username parameter' });
            return;
        }
        await createRepositoriesAndCollaboratorsFromUser({username: username});
        const query = `
        MATCH (:User {username: "${username}"})-[:WORKS_IN]->(repo)<-[:WORKS_IN]-(user:User)
        RETURN DISTINCT user.username AS contributorUsername
        `;
        const contributors = await database.executeQuery(query);
        res.json({ contributors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to find users followed by the followers of a specific user
router.get(basePath + '/findUsersFollowedByTheFollowsOfTheUser/:username', async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            res.status(400).json({ error: 'Missing username parameter' });
            return;
        }
        await createFollowersAndFollowingFromUser({username: username});
        const query = `
            MATCH (u:User {username: "${username}"})<-[:FOLLOWS]-(follower:User)-[:FOLLOWS]->(followed:User)
            RETURN DISTINCT followed.username AS followedUser
        `;
        const followedUsers = await database.executeQuery(query);
        res.json({ followedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to find issues assigned to user follows
router.get(basePath + '/findIssuesAsignedToUserFollows/:username', async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            res.status(400).json({ error: 'Missing username parameter' });
            return;
        }
        await createFollowersAndFollowingFromUser({username: username});
        await createRepositoriesIssuesAndAssigneesFromUser({username: username});
        const query = `
            MATCH (u:User {username: "${username}"})-[:FOLLOWS]->(followed:User)-[:IS_ASSIGNED_TO]->(issue:Issue)
            //exclude issues assigned to the user
            WHERE NOT (u)-[:IS_ASSIGNED_TO]->(issue)
            RETURN DISTINCT issue AS assignedIssue
        `;
        const issues = await database.executeQuery(query);
        res.json({ issues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to find repositories with open issues assigned to a specific user
router.get(basePath + '/findRepositoriesWithUserOpenIssues/:username', async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            res.status(400).json({ error: 'Missing username parameter' });
            return;
        }
        await createRepositoriesIssuesAndAssigneesFromUser({username: username});
        const query = `
            //must return the repositories and the issues
            MATCH (u:User {username: "${username}"})-[:IS_ASSIGNED_TO]->(i:Issue)<-[:HAS]-(r:Repository)
            WHERE i.state = 'OPEN'
            RETURN DISTINCT r AS repository
        `;
        const repositories = await database.executeQuery(query);
        for (let i = 0; i < repositories.length; i++) {
            const repository = repositories[i];
            const issuesQuery = `
                MATCH (r:Repository {id: "${repository.id}"})-[:HAS]->(i:Issue)
                WHERE i.status = 'Open'
                RETURN i
            `;
            const issues = await database.executeQuery(issuesQuery);
            repository.issues = issues;
        }
        res.json({ repositories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to find users with similar contributions as a specific user (at least 2 repositories in common)
router.get(basePath + '/findUsersWithSimilarContributions/:username', async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            res.status(400).json({ error: 'Missing username parameter' });
            return;
        }

        await createRepositoriesAndCollaboratorsFromUser({username: username});
        await createRepositoriesIssuesAndAssigneesFromUser({username: username});
        const query = `
            MATCH (u:User {username: "${username}"})-[:IS_ASSIGNED_TO]->(:Issue)<-[:HAS]-(r:Repository),
                  (other:User)-[:IS_ASSIGNED_TO]->(:Issue)<-[:HAS]-(r)
            WITH other, COUNT(DISTINCT r) AS reposShared
            WHERE reposShared >= 2
            RETURN DISTINCT other.username AS similarContributor
        `;
        const similarUsers = await database.executeQuery(query);
        res.json({ similarUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router to use in index.js
module.exports = router;