
//step 1 - import
import { ApolloServer } from "@apollo/server";
import {startStandaloneServer} from '@apollo/server/standalone'

//step 2 - in memory data

let tasks = [
    { id: '1', text: 'Buy groceries', completed: false },
    { id: '2', text: 'Do laundry', completed: true },
  ];
  
//step 3 - Define the GraphQL schema

const typeDefs = `#graphql
  type Task {
    id:ID!
    text:String!
    completed:Boolean!
  }

  type Query{
    tasks:[Task!]!
  }

  type Mutation{
    addTask(text: String!): Task!
    markTaskCompleted(id: ID!): Task!
    deleteTask(id: ID!): Task!
    updateTask(id: ID!,text: String!,completed: Boolean!): Task!
  }
`

//step 4 - resolvers

const resolvers = {
    Query:{
        tasks:() => tasks
    },
    Mutation:{
        addTask:(_,{text})=>{
            const newTask = {id:String(tasks.length + 1),text,completed:false}
            tasks.push(newTask)
            return newTask
        },
        markTaskCompleted:(_,{id})=>{
            const currentTaskIndex = tasks.findIndex(e=>e.id === id)
            if(currentTaskIndex >= 0){
                tasks[currentTaskIndex].completed = true

            }
            return tasks[currentTaskIndex]
        },
        deleteTask:(_,{id})=>{
            const taskIndex = tasks.findIndex((task) => task.id === id);
            const deletedTask = tasks.splice(taskIndex, 1);
            return deletedTask[0]
        },
        updateTask:(_,{id,text,completed})=>{
            const taskIndex = tasks.findIndex((task)=> task.id === id)
            if (taskIndex >= 0) {
                tasks[taskIndex].text = text
                tasks[taskIndex].completed = completed
            }
            return tasks[taskIndex]
        }
    }
}

// step 5 - create server of ApolloServer
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// step 6 - Create the Apollo Server instance

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });


