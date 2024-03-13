const neo4j = require('neo4j-driver');

async function executeQuery(query) {
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("githubdata", "githubdata"));
  const session = driver.session();

  try {
      const result = await session.run(query);
      const records = result.records.map(record => record.toObject());
      return records;
  } catch (error) {
      console.error("Error executing Cypher query:", error);
      throw error;
  } finally {
      await session.close();
      await driver.close();
  }
}

module.exports = {
  executeQuery
};