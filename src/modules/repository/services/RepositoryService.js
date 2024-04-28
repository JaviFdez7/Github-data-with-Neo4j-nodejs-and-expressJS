const database = require('../../../database/db');
const repositoriesData = require("../../github/services/githubRepositoriesFromUser")
const userData = require("../../user/services/UserService")

const createRepositoriesFromUser = async (data) => {
  try {
    await userData.createUser(data);

    const githubData = await repositoriesData.getRepositoriesFromUser(data.username)

    for (const repository of githubData.repositories.nodes) {
        const existingRepositoryQuery = `
            MATCH (r:Repository {name: "${repository.name}"})
            RETURN r
        `
        const existingRepository = await database.executeQuery(existingRepositoryQuery);

        if (existingRepository.length === 0){
            const query = `
                MATCH (u:User {username: "${data.username}"})
                CREATE (u)-[:WORKS_IN]->(r:Repository {
                    name: "${repository.name}",
                    description: "${repository.description}",
                    createdAt: "${repository.createdAt}",
                    url: "${repository.url}",
                    primaryLanguage: "${repository.primaryLanguage ? repository.primaryLanguage.name : null}"
                })
                RETURN r
            `

            await database.executeQuery(query);
        }
    }

    return githubData;
  } catch (error) {
    console.error('Error inserting repositories:', error);
    throw error;
  }
};

const createRepositoriesAndCollaboratorsFromUser = async (data) => {
    try {
      const existingUserQuery = `
          MATCH (u:User {username: "${data.username}"})
          RETURN u
      `;
  
      const userResult = await database.executeQuery(existingUserQuery);
  
      if (userResult.length === 0)  
          await userData.createUser(data);
  
      const githubData = await repositoriesData.getRepositoriesFromUser(data.username)
  
      for (const repository of githubData.repositories.nodes) {
          const existingRepositoryQuery = `
              MATCH (r:Repository {name: "${repository.name}"})
              RETURN r
          `
          const existingRepository = await database.executeQuery(existingRepositoryQuery);
  
          if (existingRepository.length === 0){
              const query = `
                  MATCH (u:User {username: "${data.username}"})
                  CREATE (u)-[:WORKS_IN]->(r:Repository {
                      name: "${repository.name}",
                      description: "${repository.description}",
                      createdAt: "${repository.createdAt}",
                      url: "${repository.url}",
                      primaryLanguage: "${repository.primaryLanguage ? repository.primaryLanguage.name : null}"
                  })
                  RETURN r
              `
  
              await database.executeQuery(query);
          }
          if(repository.collaborators?.nodes.length>0)
            for (const collaborator of repository.collaborators.nodes){
                const existingCollaboratorQuery = `
                    MATCH (u:User {username: "${collaborator.login}"})
                    RETURN u
                `;
    
                const collaboratorResult = await database.executeQuery(existingCollaboratorQuery);
    
                if (collaboratorResult.length === 0){
                    const collaboratorData = {
                            username: `${collaborator.login}`
                    }
    
                    await userData.createUser(collaboratorData);
                }
    
                const collaboratorRepositoryConnectionQuery = `
                    MATCH (u:User {username: "${collaborator.login}"}), (r:Repository {name: "${repository.name}"})
                    CREATE (u)-[:WORKS_IN]->(r)
                    RETURN r
                `
                await database.executeQuery(collaboratorRepositoryConnectionQuery);
            }
      }
  
      return githubData;
    } catch (error) {
      console.error('Error inserting repositories:', error);
      throw error;
    }
  };

  const createRepositoriesIssuesAndAssigneesFromUser = async (data) => {
    try {
      const existingUserQuery = `
          MATCH (u:User {username: "${data.username}"})
          RETURN u
      `;
  
      const userResult = await database.executeQuery(existingUserQuery);
  
      if (userResult.length === 0)  
          await userData.createUser(data);
  
      const githubData = await repositoriesData.getRepositoriesFromUser(data.username)
  
      for (const repository of githubData.repositories.nodes) {
          const existingRepositoryQuery = `
              MATCH (r:Repository {name: "${repository.name}"})
              RETURN r
          `
          const existingRepository = await database.executeQuery(existingRepositoryQuery);
  
          if (existingRepository.length === 0){
              const query = `
                  MATCH (u:User {username: "${data.username}"})
                  CREATE (u)-[:WORKS_IN]->(r:Repository {
                      name: "${repository.name}",
                      description: "${repository.description}",
                      createdAt: "${repository.createdAt}",
                      url: "${repository.url}",
                      primaryLanguage: "${repository.primaryLanguage ? repository.primaryLanguage.name : null}"
                  })
                  RETURN r
              `
  
              await database.executeQuery(query);
          }

          if(repository.issues?.nodes.length>0)
            for(const issue of repository.issues.nodes){
              if(issue.assignees?.nodes.length>0)
                for(const assignee of issue.assignees.nodes){
                    await userData.createUser({username: `${assignee.login}`});

                    const existingIssueQuery = `
                        MATCH (i:Issue {title: "${issue.title}"})
                        RETURN i
                    `
                    existingIssue = await database.executeQuery(existingIssueQuery);

                    if(existingIssue<1){
                        console.log("Creando issue")
                        const query = `
                            MATCH (u:User {username: "${assignee.login}"})
                            CREATE (u)-[:IS_ASSIGNED_TO]->(i:Issue {
                                title: "${issue.title}",
                                closedAt: "${issue.closedAt}",
                                state: "${issue.state}"
                            })
                            RETURN i
                        `
                        await database.executeQuery(query);
                    } else {
                        await userData.createUser({username: `${assignee.login}`});
                        const query = `
                            MATCH (u:User {username: "${assignee.login}"})
                            MATCH (i:Issue {title: "${issue.title}"})
                            CREATE (u)-[:IS_ASSIGNED_TO]->(i)
                            RETURN i
                        `
                        await database.executeQuery(query);
                    } 
                }
            }
      }
  
      return githubData;
    } catch (error) {
      console.error('Error inserting repositories:', error);
      throw error;
    }
  };

module.exports = {
    createRepositoriesFromUser,
    createRepositoriesAndCollaboratorsFromUser,
    createRepositoriesIssuesAndAssigneesFromUser
};
