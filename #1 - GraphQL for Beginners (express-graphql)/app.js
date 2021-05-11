const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');

const app = express();

app.use(cors());

// connect to the database
(async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb://localhost:27017/react-node-graphql',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
    console.log(`Connected to the database: ${conn.connection.host}...`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

app.get('/', (req, res) => res.send('hello graphql'));

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(4000, () => console.log('listening on port 4000...'));
