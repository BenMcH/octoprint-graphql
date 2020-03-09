const { ApolloServer, gql } = require('apollo-server');
const { get, post } = require('./octoprint');

const typeDefs = gql`
  type File {
    name: String!
    display: String!
    path: String!
    type: String!
    children: [File!]
    size: Float
    date: Int
  }

  type FilesQueryResponse {
    files: [File!]
    free: String!
  }

  type Job {
    averagePrintTime: Int
    estimatedPrintTime: Int
    lastPrintTime: Int
    file: File!
    user: String
  }

  type Progress {
    completion: Float
    filePos: Int
    printTime: Int
    printTimeLeft: Int
    printTimeLeftOrigin: String
  }

  type JobInformation {
    job: Job
    progress: Progress
    state: String
  }

  type Query {
    currentJob: JobInformation
    fileInformation: FilesQueryResponse
  }

  type Mutation {
    jog(x: Float, y: Float, z: Float): Int
    home(x: Boolean, y: Boolean, z: Boolean, all: Boolean): Int
    startJob: Boolean
    cancelJob: Boolean
    pauseJob: Boolean
    resumeJob: Boolean
    setTargetTemperature(tool: Int = 0, temperature: Float!): Boolean
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    currentJob: async () => {
      const response = await get('/job');

      const jobInformation = await response.json();

      return jobInformation;
    },
    fileInformation: async () => {
      const response = await get('/files?recursive=true');

      const jobInformation = await response.json();

      return jobInformation;
    }
  },
  Mutation: {
    jog: async (_, {x, y, z}) => {
      await post('/printer/printhead', {
        command: 'jog',
        x,
        y,
        z
      });

      return 0;
    },
    home: async (_, {all, ...args}) => {
      const axes = [];

      const addIfHoming = (axis) => all || args[axis] ?
        axes.push(axis)
        : axes.length;
      
      addIfHoming('x');
      addIfHoming('y');
      addIfHoming('z');

      const response = await post('/printer/printhead', {
        command: 'home',
        axes
      });

      return axes.length;
    },
    startJob: async () => {
      await post('/job', {
        command: 'start',
      });

      return true;
    },
    cancelJob: async () => {
      await post('/job', {
        command: 'cancel',
      });

      return true;
    },
    pauseJob: async () => {
      await post('/job', {
        command: 'pause',
        action: 'pause'
      });

      return true;
    },
    resumeJob: async () => {
      await post('/job', {
        command: 'pause',
        action: 'resume'
      });

      return true;
    },
    setTargetTemperature: async (_, args) => {
      await post('/printer/tool', {
        command: 'target',
        targets: {
          [`tool${args.tool}`]: args.temperature
        }
      });

      return true;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});