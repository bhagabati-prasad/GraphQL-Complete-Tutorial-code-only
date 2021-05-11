const { ApolloServer, gql } = require('apollo-server');
const lodash = require('lodash');

// dummy data
const books = [
  { id: '1', name: 'book1', authorId: '2' },
  { id: '2', name: 'book2', authorId: '1' },
];
const authors = [
  { id: '1', fname: 'john', lname: 'doe' },
  { id: '2', fname: 'jane', lname: 'doe' },
];

// graphQL schema
const typeDefs = gql`
  type Book {
    id: ID
    name: String
    authorId: ID
    author: Author
  }

  type Author {
    id: ID
    fname: String
    lname: String
    books: Book
  }

  type Query {
    book(id: ID, name: String, authorId: ID): [Book!]!
    author(id: ID, name: String, authorId: ID): [Author]
  }
`;

// Nested Query Resolvers
const resolvers = {
  Query: {
    book: (parent, args, context) => {
      // console.log(args); // {id: '1'}
      return lodash.filter(books, args);
    },
    author: (parent, args, context) => {
      return lodash.filter(authors, args);
    },
  },
  Book: {
    author: (parent, args) => {
      // console.log(parent);
      // { id: '1', name: 'book1', authorId: '2' }
      // { id: '2', name: 'book2', authorId: '1' }
      return lodash.find(authors, { id: parent.authorId });
    },
  },
  Author: {
    books: (parent, args) => {
      return lodash.find(books, { authorId: parent.id });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4000).then(({ url }) => console.log(`listening at url ${url}`));

// INPUT:
// -------
// {
//   book {
//     id
//     name
//     author {
//       id
//       fname
//       books {
//         name
//       }
//     }
//   }
// }

// OUTPUT:
// --------
// {
//   "data": {
//     "book": [
//       {
//         "id": "1",
//         "name": "book1",
//         "author": {
//           "id": "2",
//           "fname": "jane",
//           "books": {
//             "name": "book1"
//           }
//         }
//       },
//       {
//         "id": "2",
//         "name": "book2",
//         "author": {
//           "id": "1",
//           "fname": "john",
//           "books": {
//             "name": "book2"
//           }
//         }
//       }
//     ]
//   }
// }
