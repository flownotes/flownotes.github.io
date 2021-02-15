# FlowNotes

Flow Notes is a web app that let's users (students) take notes on youtube videos. 
Got to [flownotes.github.io][1]

## Development

### Installation

To install the project for development / testing, run the following commands -

```
git clone https://github.com/flownotes/flownotes.github.io
cd flownotes
npm install
```

**Note** : Install NodeJS and NPM before running the above commands. (NPM get's installed along with NodeJS).


### Run the dev environment

Run `npm start`

This runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.


### Production build

Run `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

Your app is ready to be deployed! (With the `/build` folder as root folder to be hosted).


### Deploy

Run `npm run deploy`

This builds **and** deploys the current code. It internally does two things -
1. Builds the code into `/build` directory by running `npm run build`
2. Commits the build folder to the `gh-pages` branch and pushes it to origin.

The [Origin repo][2] is configured to serve the `gh-pages` content at [flownotes.github.io][1].

[1] : https://flownotes.github.io
[2] : https://github.com/flownotes/flownotes.github.io