# Corona School - Frontend

The frontend for the Corona School user dashboard.

## Tools used

We use [npm](https://npmjs.com/) as package manager, which should come with the standard node.js installation. Please do not use yarn, as usage of both can lead to conflicts.

We use [React](https://reactjs.org/) in this project. This project was bootstrapped with [Create React App](https://create-react-app.dev/). Therefore we also use Babel and Webpack, though this works mostly under the hood.

We use [Typescript](https://www.typescriptlang.org/) for type checking. Use \*.ts and \*.tsx file extensions.

We use [React Router](https://reacttraining.com/react-router/web) for url path routing.

We use [styled components](https://styled-components.com/) for CSS styling.

We use [Normalize.css](https://necolas.github.io/normalize.css) for cross-browser consistency in the default styling of HTML elements. Currently the normalize.css file is located directly in /src/, though it could also be included using npm.

## Available Scripts

You may need the following commands.

### `npm install`

Installs the dependencies into the /node_modules/ directory. This must be run after cloning the directory and each update to the package.json file.

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

If the server won't start, make sure you are in the /frontend/ directory and have ran `npm install`.

### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Recommended setup

If you do not prefer another setup, it is recommended to use [VS Code](https://code.visualstudio.com/) with the following extensions:

[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for code formatting. It will read the .prettierrc file for unified formatting among contributers.

[vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components) for syntax highlighting and auto completion in styled-components template literals.

[ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) to avoid typing common patterns.

In the VS Code settings, the _Format On Save_ (editor.formatOnSave) option may be used.
