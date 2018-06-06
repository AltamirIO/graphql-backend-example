import { UserSchema } from '../User'

const Event = `
  type Event  {
    # Event ID
    id: ID!

    # The Host (usually creator) of this Event
    host: User!

    # Event's Title
    title: String!

    # Brief Event description
    description: String

    # This Event's time/date
    time: DateTime!

    # List of Users participating in the event
    participants: [User!]!

  }
`
const Queries = `
  extend type Query {
    # Query all events
    events(
      filter: EventSearchInput = {}
    ): [Event!]!

    event(
      # Event ID
      id: ID!
    ): Event
  }
`

const Mutations = `
  extend type Mutation {
    # Create an event for the currently signed in user.
    # The current user becomes the host.
    create_event(
      # Info on the event to create
      event: EventCreateInput!
    ): Event

    # leave an event by ID
    update_event(
      # Event ID
      event: EventUpdateInput!
    ): Event
  }
`

const EventInput = `
  input EventCreateInput {
    title: String!
    description: String = ""
    time: DateTime!
  }

  input EventUpdateInput {
    id: ID!
    title: String
    description: String
    time: DateTime
  }

  input EventSearchInput{
    # ID of the event host
    host: ID

    # Will search titles containing this string
    title: String

    # Will search descriptions containing this string
    description: String

    # Will search in between these 2 times.
    # Will only use first 2 positions
    # time: [DateTime!]

    # Searches for Events where all the listed users are participating
    participants: [ID!]

    # For pagination - where to begin search
    # offset: Int = 0

    # For pagination - page size
    # limit: Int = 1000
  }
`

export const EventResolvers = {
  Query: {
    events: (_, {filter}, {Event}) => {
      return Event.find(filter)
    },
    event: (_, {id}, {Event }) => {
      return Event.findById(id)
    },
  },
  Mutation: {
    create_event: async (_, {event}, { Event }) => {
      return Event.create(event);
    },
    update_event: (_, {event}, {Event}) => {
      return Event.update(event)
    },
  },
  Event: {
    host: (event, args,  {User}) => {
      return User.findById(event.host)
    },
    participants: (event, args, {User}) => {
      return User.findByIds(event.participants)
    },
  },
}

export const EventSchema = () => [
  Event,
  Queries,
  Mutations,
  EventInput,
  UserSchema,
]