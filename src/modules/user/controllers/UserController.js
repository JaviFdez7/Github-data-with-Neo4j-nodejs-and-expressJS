const express = require('express');
const UserService = require('../services/UserService');

const createUser = async (req, res) => {
  try {
      const data = await UserService.createUser(req.body);
      res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = {
  createUser
};
