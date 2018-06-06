import { merge } from 'lodash';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import {printSchema} from 'graphql';

// DATE TYPES
import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} from 'graphql-iso-date';

// TYPE DEFS
import { EventSchema, EventResolvers } from './Event'
import { UserSchema, UserResolvers } from './User'

// END TYPE DEFS

// TEMPORARY
const messages = [];
// END TEMPORARY

const DateTypes = `
  scalar DateTime
  scalar Date
  scalar Time
`
const RootSchema = `
  type Query {
    # Get the currently logged in user (null if none)
    messages: [String!]!
  }

  type Mutation {
    addMessage(text: String!): [String!]!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;


const RootResolvers = {
  Query: {
    messages: () => messages
  },
  Mutation: {
    addMessage: (_, { text }, context) => {
      messages.push(text)
      return messages
    }
  },
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime
};

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
const schema = [
  RootSchema,
  DateTypes,
  EventSchema,
  UserSchema,
];

const resolvers = merge(
  RootResolvers,
  EventResolvers,
  UserResolvers,
);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

// FOR TESTING SCHEMA, REMOVE TO USE RESOLVERS
addMockFunctionsToSchema({schema: executableSchema})



export const FullSchemaDeff = printSchema(executableSchema, {
  commentDescriptions: true
})

export default executableSchema;