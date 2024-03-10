const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("githubdata", "githubdata"));
const session = driver.session();

session
  .run("CREATE (n:Person {name: 'John Doe'}) RETURN n")
  .then(result => {
    result.records.forEach(record => {
      console.log(record.get("n").properties);
    });
    session.close();
    driver.close(); // Cierra el controlador después de cerrar la sesión
  })
  .catch(error => {
    console.error("Error executing Cypher query:", error);
    session.close();
    driver.close(); // Cierra el controlador en caso de error
  });
