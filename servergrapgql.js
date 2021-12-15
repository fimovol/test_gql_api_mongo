require('dotenv').config()
var { buildSchema } = require('graphql');
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var axios = require('axios')
const cors = require('cors')

var schema = buildSchema(`
  type Nota {
    content: String
    date: String
    important: Boolean
    id: String
  }
  type Mutation {
    updateMessage(numDice: Int!): Int


    updateNota(content: String!,important: Boolean):Nota
  }
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]


    getNotaconid(id: String): Nota
    getNota: [Nota]
  }
`);

var root = {
    updateMessage: ({numDice}) => {
        return numDice;
    },
    rollDice: ({numDice, numSides}) => {
        var output = [];
        for (var i = 0; i < numDice; i++) {
          output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
    },



    getNota: async ()=>{
        const {data:datos} = await axios.get(`http://localhost:${process.env.PORT}`)
        return datos
    },
    getNotaconid: async ({id})=>{
        const {data:datos} = await axios.get(`http://localhost:${process.env.PORT}/api/notes/${id}`)
        return datos
    },
    updateNota: async ({content,important})=>{
        const json = JSON.stringify({
            content: content,
            important: important
        });
        const {data:datos} = await axios.post(`http://localhost:${process.env.PORT}/api/notes`, json, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return datos
    }
}

var app = express();
app.use(cors())
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(process.env.PORT_GQL);
console.log(`Running a GraphQL API server at http://localhost:${process.env.PORT_GQL}/graphql`);