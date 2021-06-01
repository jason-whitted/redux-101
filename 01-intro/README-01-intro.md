# redux-101
[https://github.com/jason-whitted/redux-101](https://github.com/jason-whitted/redux-101)
# Facts
Prop Drilling sucks!

Managing distributed state sucks even more!

Redux fixes both of these.

# Agenda:
Starting with a simple app we are going to:
- Implement Redux using `redux` and `react-redux`
- Connect the Redux store to Redux DevTools
- Create selectors using `reselect`
- Implement thunks with `redux-thunk`
- Convert to `@reduxjs/toolkit`
- Create persistance middleware

# Redux
Redux has a fairly steep learning curve with its own vocabulary:
  - `action creator` - A helper function to create an "action" object
  - `action` - An object describing a requested change to the store
  - `dispatch` - A function on the store used to process actions
  - `higher-order function` - Any function that takes a function as input and/or returns a function as output
  - `reducer` - A function which receives the previous state and an "action" object and returns the updated state
  - `selector` - A helper function for reading data from the state
  - `slice` - Individual branches of the state
  - `state` - The current state
  - `store` - The public interface which is managing state and dispatching actions to the reducers
  - `thunk` - An asynchronous action

But under the hood it is composed of very simple concepts that requires you to follow rigid guidelines in order to maintain simplicity.

Simple does not necessarily mean easy.  Some of these concepts are hard initially, but with practice they become easy. Please watch [Simple Made Easy](https://www.infoq.com/presentations/Simple-Made-Easy/) by Rich Hickey for more on this concept. In my opinion this is one of the most important software engineering concepts to understand in order to help write good code.

Redux centralizes your application state into a single, immutable object.

Updates to the store can be done from anywhere in the application by dispatching a normalized "action" object.

Individual applications can subscribe to the store to receive notification when the state has changed.

![Redux](https://redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

It "simplifies" a system by systematically enforcing:
- immutability
  - mutation is easy
  - managing and reacting to mutation is hard
- CQRS (Command Query Responsibility Segregation) pattern
  - separating reads from writes
- [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
  - business logic can be centralized to the store and not spread around your app
- [single-responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)
  - small, individual files are responsible for doing one thing
  - easy to unit test
