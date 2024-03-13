const database = require('../../../database/db');
const userData = require("../../github/services/githubUser")

const createUser = async (data) => {
  try {
    const githubData = await userData.getUserInfo(data.username)

    const query = `
      CREATE (u:User {
        username: "${githubData.login}",
        name: "${githubData.name}",
        email: "${githubData.email}",
        bio: "${githubData.bio}",
        company: "${githubData.company}",
        location: "${githubData.location}",
        websiteUrl: "${githubData.websiteUrl}",
        twitterUsername: "${githubData.twitterUsername}",
        followersCount: ${githubData.followers.totalCount},
        followingCount: ${githubData.following.totalCount}
      })
      RETURN u
    `;

    const user = await database.executeQuery(query);
    return user;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
};

module.exports = {
  createUser
};
