const User =`
  # Type for users of the app
  type User {
    # the User's Unique ID
    id: ID!

    # User's first name
    first_name: String!

    # User's last name
    last_name: String

    # User's full name
    name: String

    # User's email
    email: String

  }
`

const Queries = `
  extend type Query {
    # Get a list of all User's
    users: [User!]!

    # Get a specific user by ID
    user(
      # User ID
      id: ID!
    ): User
  }
`

const Mutations = `
  extend type Mutation {

  }
`

export const UserResolvers = {
  Query: {
    users: (_, args, { User, ...context}) => {
      return User.find()
    },
    user: (_, {id}, { User, ...context}) => {
      return User.findById(id);
    },
  },
  User: {
    name: (user, args, {current_user}) => `${user.first_name} ${user.last_name}`
  }
}


export const UserSchema = ()=> [ User, Queries, Mutations ]