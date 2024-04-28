const RepositoryService = require('../services/RepositoryService');

const createRepositoriesFromUser = async (req, res) => {
  try {
      const data = await RepositoryService.createRepositoriesFromUser(req.body);
      res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const createRepositoriesAndCollaboratorsFromUser = async (req, res) => {
  try {
      const data = await RepositoryService.createRepositoriesAndCollaboratorsFromUser(req.body);
      res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const createRepositoriesIssuesAndAssigneesFromUser = async (req, res) => {
  try {
      const data = await RepositoryService.createRepositoriesIssuesAndAssigneesFromUser(req.body);
      res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = {
    createRepositoriesFromUser,
    createRepositoriesAndCollaboratorsFromUser,
    createRepositoriesIssuesAndAssigneesFromUser
};
