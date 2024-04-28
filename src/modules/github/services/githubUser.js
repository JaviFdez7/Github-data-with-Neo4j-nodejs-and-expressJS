const fetcher = require("../fetcher/fetchGithubData")

async function getUserInfo(username) {
    try {
      const query = `
        query {
          user(login: "${username}") {
            login
            name
            email
            bio
            company
            location
            websiteUrl
            twitterUsername
            followers(first:100) {
              nodes {
                login
                name
              }
              totalCount
            }
            following(first:100) {
              nodes {
                login
                name
              }
              totalCount
            }
          }
        }
      `;
      const userInfo = await fetcher.fetchGithubData(query);
      return userInfo.data.user;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  }
  
  module.exports = { 
    getUserInfo
  }