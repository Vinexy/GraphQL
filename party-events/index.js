import Data from "./data.json" assert { type: "json" };
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
    type User{
        id: ID!
        username: String!
        email: String!
        eventList: [Event!]!
    }

    type Event{
        id: ID!
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: Int!
        user_id: Int!
        user: User!
        participants: [Participant!]!
        location: Location!
    }

    type Location{
      id: ID!
      name: String!
      desc: String!
      lat: Float!
      lng: Float!
    }

    type Participant{
      id: ID!
      user_id: Int!
      event_id: Int!
      user: User!
    }

    type Query{
      users: [User!]!
      user(id: ID!): User! 

      events: [Event!]!
      event(id: ID!): Event!

      locations: [Location!]!
      location(id: ID!): Location!

      participants: [Participant!]!
      participant(id: ID!): Participant

    }
`;

const resolvers = {
  Query: {
    users: () => Data.users,
    user: (parent, args) =>
      Data.users.find((user) => user.id === parseInt(args.id)),

    events: () => Data.events,
    event: (parent, args) =>
      Data.events.find((event) => event.id === parseInt(args.id)),

    locations: () => Data.locations,
    location: (parent, args) =>
      Data.locations.find((location) => location.id === parseInt(args.id)),

    participants: () => Data.participants,
    participant: (parent, args) =>
      Data.participants.find(
        (participant) => participant.id === parseInt(args.id)
      ),
  },

  User: {
    eventList: (parent, args) =>
      Data.events.filter((event) => event.user_id === parseInt(parent.id)),
  },

  Event: {
    user: (parent, args) =>
      Data.users.find((user) => user.id === parseInt(parent.user_id)),

    participants: (parent, args) =>
      Data.participants.filter(
        (participant) => participant.event_id === parseInt(parent.id)
      ),

    location: (parent, args) =>
      Data.locations.find(
        (location) => location.id === parseInt(parent.location_id)
      ),
  },

  Participant: {
    user: (parent, args) =>
      Data.users.find((user) => user.id === parseInt(parent.user_id)),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
