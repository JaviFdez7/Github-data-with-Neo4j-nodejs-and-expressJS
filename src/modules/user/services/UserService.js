const database = require('../../../database/db');
const userData = require("../../github/services/githubUser")

const createUser = async (data) => {
  try {
    const existingUserQuery = `
        MATCH (u:User {username: "${data.username}"})
        RETURN u
    `;

    var user = await database.executeQuery(existingUserQuery);

    if (user.length === 0){
      console.log("Inserting user: ", data)
      const githubData = await userData.getUserInfo(data.username)

      const query = `
        CREATE (u:User {
          username: "${githubData ? githubData.login : data.username}",
          name: "${githubData ? githubData.name : null}",
          email: "${githubData ? githubData.email : null}",
          bio: "${githubData ? githubData.bio : null}",
          company: "${githubData ? githubData.company : null}",
          location: "${githubData ? githubData.location : null}",
          websiteUrl: "${githubData ? githubData.websiteUrl : null}",
          twitterUsername: "${githubData ? githubData.twitterUsername : null}",
          followersCount: ${githubData ? githubData.followers.totalCount : null},
          followingCount: ${githubData ? githubData.following.totalCount : null}
        })
        RETURN u
      `;

      user = await database.executeQuery(query);
    }

    return user;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
};

const createFollowersAndFollowingFromUser = async (data) => {
  try {
    await createUser(data)

    const githubData = await userData.getUserInfo(data.username)

    if(githubData.followers.nodes.length > 0)
      for(const follower of githubData.followers.nodes){
        await createUser({username: `${follower.login}`})

        const query = `
            MATCH (user:User {username: "${githubData.login}"})
            MATCH (follower:User {username: "${follower.login}"})
            CREATE (follower)-[:FOLLOWS]->(user)
            RETURN user
        `
        await database.executeQuery(query);
      }

    if(githubData.following?.nodes.length > 0)
      for(const following of githubData.following.nodes){
        await createUser({username: `${following.login}`})

        const query = `
            MATCH (user:User {username: "${githubData.login}"})
            MATCH (following:User {username: "${following.login}"})
            CREATE (user)-[:FOLLOWS]->(following)
            RETURN user
        `
        await database.executeQuery(query);
      }

    return githubData;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  createFollowersAndFollowingFromUser
};
