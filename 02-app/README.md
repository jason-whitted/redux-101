# Counter
- Display current count
- Increment / Decrement buttons

# Dogs
- Fetch breeds from an API
- Allow the user to select a breed
- Display the current breed

# DogImage
- Fetches an image based on the current counter and current breed
- Doesn't work (yet)
- We don't want to hoist all of the properties to the `App` component and use prop drilling
- We *could* use React context to share the application state, but fundamentally we'd just start recreating a state management library like Redux
