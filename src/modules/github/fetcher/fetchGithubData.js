const { GQLPaginator } = require('gql-paginator');
require('dotenv').config();

async function fetchGithubData(query) {
    try {
        const result = await GQLPaginator(query, process.env.GH_TOKEN, "github-v1.0.0");
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

module.exports = {
    fetchGithubData
};
