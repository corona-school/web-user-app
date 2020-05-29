# web-user-app

The frontend for the Corona School user dashboard.


## Getting started

You may need the following commands.

`yarn install`

Installs the dependencies into the /node_modules/ directory. This must be run after cloning the directory and each update to the package.json file.

`yarn run dev`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. If the server won't start, make sure you are in the /frontend/ directory and have ran `npm install`.

`yarn run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed!

### Tools used

- We use [yarn](https://yarnpkg.com/) as package manager.
- We use [React](https://reactjs.org/) in this project. This project was bootstrapped with [Create React App](https://create-react-app.dev/). Therefore we also use Babel and Webpack, though this works mostly under the hood.
- We use [Typescript](https://www.typescriptlang.org/) for type checking. Use \*.ts and \*.tsx file extensions.
- We use [React Router](https://reacttraining.com/react-router/web) for url path routing.
- We use [styled components](https://styled-components.com/) and SASS for styling.
- We use [Normalize.css](https://necolas.github.io/normalize.css) for cross-browser consistency in the default styling of HTML elements.

### Recommended setup

If you do not prefer another setup, it is recommended to use [VS Code](https://code.visualstudio.com/) with the following extensions:
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for code formatting. It will read the .prettierrc file for unified formatting among contributers.
- [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components) for syntax highlighting and auto completion in styled-components template literals.
- [ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) to avoid typing common patterns.
- In the VS Code settings, the _Format On Save_ (editor.formatOnSave) option may be used.
