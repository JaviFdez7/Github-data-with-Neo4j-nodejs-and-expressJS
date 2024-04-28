const express = require('express');
const repositoryController = require('./controllers/RepositoryController');

const router = express.Router();

router.post('/', repositoryController.createRepositoriesFromUser);
router.post('/collaborators', repositoryController.createRepositoriesAndCollaboratorsFromUser);
router.post('/issues/assignees', repositoryController.createRepositoriesIssuesAndAssigneesFromUser);

module.exports = router
