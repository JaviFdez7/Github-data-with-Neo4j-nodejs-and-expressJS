const fetcher = require("../fetcher/fetchGithubData")

async function getRepositoriesFromUser(username) {
    try {
      const query = `
      query {
        user(login: "${username}") {
          repositories(first: 50) {
            nodes {
              name
              description
              createdAt
              url
              primaryLanguage {
                name
              }
              languages(first:10) {
                nodes{
                  name
                }
              }
              collaborators(first:20){
                nodes{
                  login
                  name
                }
              }
              issues(first:50){
                nodes{
                  title
                  closedAt
                  state
                  assignees(first:10){
                    nodes{
                      login
                    }
                  }
                }                                
              }
            }
          }
        }
      }
      `;
      const repositoriesFromUserInfo = await fetcher.fetchGithubData(query);
      return repositoriesFromUserInfo.data.user;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  }
  
  module.exports = { 
    getRepositoriesFromUser
  }