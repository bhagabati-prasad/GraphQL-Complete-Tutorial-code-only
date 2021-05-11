const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const lodash = require('lodash');

const books = [
  { id: '1', name: 'Book1', authorId: '2' },
  { id: '2', name: 'Book2', authorId: '1' },
];

const authors = [
  { id: '1', name: 'Author1' },
  { id: '2', name: 'Author2' },
];

const typeDefs = gql`
  type Book {
    id: ID
    name: String
    authorId: ID
  }

  type Author {
    id: ID
    name: String
  }

  type BookAuth {
    book: Book
    author: Author
  }

  type Query {
    hello: String
    books: [Book!]!
    authors: [Author!]!
    book(id: ID!): Book
    author(id: ID!): Author
    bookauth(id: ID!): BookAuth
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from graphql!',
    books: () => books,
    authors: () => authors,
    book: async (parent, args, context, info) => {
      return lodash.find(books, { id: args.id });
    },
    author: async (parent, args, context, info) => {
      return lodash.find(authors, { id: args.id });
    },
    bookauth: (parent, args, cont, info) => {
      const book = lodash.find(books, { id: args.id });
      const author = lodash.find(authors, { id: book.authorId });
      return { book, author };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// -------- SERVER SECTION ---------
// # when using "apollo-server":
// server.listen().then(({ url }) => console.log(`server started at ${ url }...`));
//OR, server.listen(PORT);
// console.log(`Server started at port ${PORT}...`);

// # when using "apollo-server-express":
async function startServer() {
  const app = express();
  const apolloServer = server;

  await apolloServer.start();

  apolloServer.applyMiddleware({ app: app });

  app.listen(4000, () => console.log('Server running on port 4000...'));
}
startServer();
