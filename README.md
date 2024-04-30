# Github-data-with-Neo4j-nodejs-and-expressJS

## Descripcción
El proyecto que presentamos se centra en la creación de una API utilizando ExpressJS, Node.js
y Neo4j, junto con la integración de la API de GraphQL de GitHub. La finalidad es extraer, pro-
cesar y almacenar información relevante sobre perfiles de usuarios, repositorios, issues, seguidores,
colaboradores y otras entidades relacionadas con proyectos alojados en GitHub.

GitHub proporciona una API de GraphQL que permite acceder a datos detallados sobre los
repositorios, usuarios y actividades en la plataforma. Sin embargo, a veces es necesario realizar
procesamientos adicionales sobre estos datos para obtener información específica o realizar análisis
complejos que no son directamente proporcionados por la API de GitHub.

El objetivo principal de nuestro proyecto es ofrecer una interfaz de programación que permita
a los usuarios acceder a información detallada sobre los proyectos y perfiles de GitHub, así como
realizar consultas avanzadas y análisis sobre estos datos. Además, la integración con Neo4j como
base de datos permite almacenar relaciones entre entidades y realizar consultas de manera eficiente,
lo que facilita la recuperación y el análisis de datos relacionales.

## Guía de instalación
Para instalar y ejecutar el proyecto, siga los siguientes pasos:

1. Instalar Neo4j:
- Descargue e instale Neo4j Desktop desde el [sitio web oficial](https://neo4j.com/download/).
- Una vez instalado, cree un nuevo proyecto y agregue una nueva base de datos. La contraseña puede ser la que desee ya que configuraremos un usuario y contraseña personalizados.
- Inicie la base de datos pulsando el botón de `Start` y se abrirá la interfaz de Neo4j Browser.
- Dentro de la interfaz de Neo4j Browser, acceda al panel izquierdo y seleccione el primer icono (una base de datos) que le dará acceso al panel de información de la base de datos.
- En la sección `Connected as`, haga clic en el botón `Server user Add` 
- Cree un nuevo usuario con el nombre de usuario `githubdata` y la contraseña `githubdata`. Es importante que sean estos valores ya que la aplicación está configurada para utilizar estos valores por defecto.
- Asigne los roles de `admin` y `PUBLIC` al usuario y haga clic en el botón `Add User`.

Recuerde que debe mantener la base de datos de Neo4j en ejecución para que la aplicación pueda conectarse a ella.

2. Clonar el repositorio:
```bash
git clone https://github.com/JaviFdez7/Github-data-with-Neo4j-nodejs-and-expressJS
```

3. Instalar las dependencias:
```bash
cd Github-data-with-Neo4j-nodejs-and-expressJS
npm install
```

4. Configurar las variables de entorno:

Cambie el nombre del archivo `.env.example` a `.env` y configure las siguientes variables de entorno:
- GH_TOKEN: Debe proporcionar un token de autenticación de GitHub para acceder a la API de GitHub. Puede obtener un token de acceso personal en la [configuración](https://docs.github.com/es/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app) de su cuenta de GitHub.

5. Iniciar la aplicación:
```bash
npm start
```
En caso de no tener instalado el paquete `nodemon`, puede instalarlo de manera global con el siguiente comando:
```bash
npm install -g nodemon
```

O bien, puede ejecutar la aplicación con el siguiente comando:
```bash
node app.js
```

La aplicación se iniciará en el puerto 3000 por defecto. Puede acceder a la interfaz de swagger en `http://localhost:3000/api-docs` para realizar consultas y pruebas.

## Manual de usuario


### 1. Uso de la API

Esta API es accesible desde cualquier cliente HTTP, como Postman, o mediante interfaces interactivas como Swagger, que proporcionamos para facilitar la visualización y el manejo de las solicitudes y respuestas. La API está diseñada para interactuar con datos de GitHub y almacenarlos en una base de datos Neo4j, permitiendo análisis avanzados y consultas específicas.

#### Organizacion de endpoints
La API ofrece una serie de endpoints que se dividen en operaciones de tipo POST y GET:

- **Operaciones POST**: Permiten crear y almacenar información en la base de datos Neo4j a partir de datos extraídos de GitHub.
- **Operaciones GET**: Facilitan la recuperación de información avanzada y análisis específicos a partir de los datos almacenados. Además, internamente, estos endpoints realizan consultas a la API de GitHub en caso de que no se disponga de la información necesaria en la base de datos.


#### Listado detallado de endpoints

A continuación, se detallan los endpoints disponibles en la API, junto con una breve descripción de su funcionalidad:

- **POST `/user`**: Este endpoint permite la creación de un usuario en la base de datos Neo4j utilizando como entrada el nombre de usuario de GitHub. Esta información es esencial para vincular todas las operaciones subsecuentes que involucren a este usuario.

- **POST `/user/followers/following`**: Registra en la base de datos no solo al usuario especificado, sino también a todos los perfiles que siguen a este usuario. Entonces crea una relacion de FOLLOWS bidireccional.

- **POST `/repositories`**: Almacena información detallada sobre todos los repositorios públicos de un usuario de GitHub. Esta data incluye detalles como el nombre del repositorio, la descripción, y la fecha de creación, entre otros.

- **POST `/repositories/collaborators`**: Similar al anterior, pero además de guardar los repositorios del usuario, también almacena información sobre otros usuarios que colaboran en esos repositorios. Esto permite analizar cómo las colaboraciones se distribuyen a través de diferentes proyectos.

- **POST `/repositories/issues/assignees`**: Este endpoint captura no solo los repositorios del usuario y sus issues asociadas, sino también los usuarios asignados a cada issue. Proporciona una vista completa de la participación en proyectos y la gestión de tareas dentro de los mismos.

A continuación se detallan los endpoints de tipo GET, que proporcionan información que desde la API de GitHub no se puede obtener directamente, pero que puede ser de utilidad a la hora de analizar los perfiles y proyectos de GitHub. 

- **GET `/query/findAssigneesInCommonIssues/{username}`**: Devuelve una lista de todos los usuarios que están asignados a las mismas issues que el usuario especificado. Esto es útil para identificar colaboraciones y dependencias en equipos de trabajo.

- **GET `/query/listSharedFollowers/{username1}/{username2}`**: Muestra una lista de seguidores que son comunes entre dos usuarios especificados. Este endpoint es valioso ver las conexiones entre los usuarios.

- **GET `/query/findSharedIssues/{username1}/{username2}`**: Encuentra las issues a las cuales ambos usuarios especificados están asignados, facilitando la identificación de áreas de trabajo en común o colaboración.

- **GET `/query/findNonUserAssignedIssues/{username}/{repositoryName}`**: Obtiene una lista de issues en un repositorio específico que no están asignadas al usuario dado, es decir, las tareas que no están bajo su responsabilidad.

- **GET `/query/findAllUsersContributingInRepositoriesContributedBy/{username}`**: Este endpoint proporciona una lista de todos los usuarios que contribuyen en los mismos repositorios que el usuario especificado, es decir, devuelve los usuarios que han trabajado junto al usuario.

- **GET `/query/findUsersFollowedByTheFollowsOfTheUser/{username}`**: Devuelve los usuarios que son seguidos por aquellos que el usuario dado sigue. Es útil para explorar cómo se extienden las redes de influencia a través de conexiones indirectas.

- **GET `/query/findIssuesAsignedToUserFollows/{username}`**: Recupera las issues asignadas a los usuarios que son seguidos por el usuario especificado, proporcionando una vista de la carga de trabajo y las responsabilidades los perfiles que sigue.

- **GET `/query/findRepositoriesWithUserOpenIssues/{username}`**: Lista todos los repositorios que tienen issues abiertas asignadas al usuario dado, lo cual da una idea de los proyectos en los que está involucrado en los que quedan tareas pendientes.

- **GET `/query/findUsersWithSimilarContributions/{username}`**: Busca usuarios que tienen contribuciones en al menos dos repositorios en común con el usuario dado, facilitando la identificación de patrones de colaboración y especialización en áreas específicas de desarrollo.

### 2. Ejemplos de peticiones

A continuación, se proporcionan ejemplos de consultas para cada uno de los endpoints mencionados anteriormente. Estos ejemplos ilustran cómo se deben estructurar las solicitudes para interactuar efectivamente con la API.

#### POST Requests

**POST `/user`**
```json
{
    "username": "JaviFdez7"
}
```

**POST `/user/followers/following`**
```json
{
    "username": "JaviFdez7"
}
```

**POST `/repositories`**
```json
{
    "username": "JaviFdez7"
}
```

**POST `/repositories/collaborators`**
```json
{
    "username": "JaviFdez7"
}
```

**POST `/repositories/issues/assignees`**
```json
{
    "username": "JaviFdez7"
}
```

**GET `/query/findAssigneesInCommonIssues/motero2k`**


**GET `/query/listSharedFollowers/motero2k/JaviFdez7`**


**GET `/query/findSharedIssues/motero2k/JaviFdez7`**


**GET `/query/findNonUserAssignedIssues/motero2k/ISPP-G1-Talent`**


**GET `/query/findAllUsersContributingInRepositoriesContributedBy/motero2k`**


**GET `/query/findUsersFollowedByTheFollowsOfTheUser/motero2kv2`**


**GET `/query/findIssuesAsignedToUserFollows/motero2k`**


**GET `/query/findRepositoriesWithUserOpenIssues/motero2k`**


**GET `/query/findUsersWithSimilarContributions/motero2k`**
