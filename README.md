To expose different versions of React components using Webpack Module Federation, you can achieve this by creating multiple remote applications, each exposing a different version of the React component. These remote applications can be dynamically consumed by the host application, allowing you to choose which version of the component to use.

### Key Steps:

1. **Set up Remote Applications** for different versions of React components.
2. **Expose Components** in each remote application using `ModuleFederationPlugin`.
3. **Use Dynamic Imports** in the host application to load different component versions.

### 1. **Set up Remote Applications with Different React Component Versions**

For each version of the React component, you’ll create a separate project (remote app). For this example, let’s assume we have two versions of a `Button` component: **Button v1** and **Button v2**.

#### Remote Application 1 (for `Button v1`)

1. Create a new React app for the first version of the `Button` component.

```bash
npx create-react-app button-v1
cd button-v1
```

2. Install Webpack Module Federation dependencies:

```bash
npm install --save-dev webpack webpack-cli
npm install --save react react-dom
```

3. Create the `Button` component in `src/Button.js`:

```jsx
import React from 'react';

const Button = () => {
  return <button>Button Version 1</button>;
};

export default Button;
```

4. Configure `ModuleFederationPlugin` in `webpack.config.js` to expose this component:

```js
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'remoteEntry.js',
    publicPath: 'auto',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'buttonAppV1',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button',
      },
      shared: { 
        react: { singleton: true }, 
        'react-dom': { singleton: true } 
      },
    }),
  ],
  devServer: {
    port: 3001,
  },
};
```

#### Remote Application 2 (for `Button v2`)

1. Repeat the above steps to create another app for `Button v2`. You can call this project `button-v2`.

```bash
npx create-react-app button-v2
cd button-v2
```

2. Create `Button` component in `src/Button.js` for this version:

```jsx
import React from 'react';

const Button = () => {
  return <button>Button Version 2</button>;
};

export default Button;
```

3. Configure `ModuleFederationPlugin` in `webpack.config.js` for this remote app:

```js
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'remoteEntry.js',
    publicPath: 'auto',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'buttonAppV2',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button',
      },
      shared: { 
        react: { singleton: true }, 
        'react-dom': { singleton: true } 
      },
    }),
  ],
  devServer: {
    port: 3002,
  },
};
```

### 2. **Host Application to Consume Different Component Versions**

The host application can dynamically import and consume these components based on the version you need.

1. Create the host app:

```bash
npx create-react-app host-app
cd host-app
```

2. Install Webpack Module Federation dependencies:

```bash
npm install --save-dev webpack webpack-cli
npm install --save react react-dom
```

3. Configure `ModuleFederationPlugin` in the `webpack.config.js` to dynamically load the components:

```js
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'auto',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'hostApp',
      remotes: {
        buttonAppV1: 'buttonAppV1@http://localhost:3001/remoteEntry.js',
        buttonAppV2: 'buttonAppV2@http://localhost:3002/remoteEntry.js',
      },
      shared: { 
        react: { singleton: true }, 
        'react-dom': { singleton: true } 
      },
    }),
  ],
  devServer: {
    port: 3000,
  },
};
```

4. **Dynamically Load Components** in the host app:

In `src/App.js`, load different component versions dynamically based on user input or configuration:

```jsx
import React, { Suspense, useState } from 'react';

const ButtonV1 = React.lazy(() => import('buttonAppV1/Button'));
const ButtonV2 = React.lazy(() => import('buttonAppV2/Button'));

function App() {
  const [version, setVersion] = useState('v1');

  const loadButton = () => {
    return version === 'v1' ? <ButtonV1 /> : <ButtonV2 />;
  };

  return (
    <div>
      <h1>Host Application</h1>
      <button onClick={() => setVersion('v1')}>Load Button v1</button>
      <button onClick={() => setVersion('v2')}>Load Button v2</button>
      <Suspense fallback={<div>Loading...</div>}>
        {loadButton()}
      </Suspense>
    </div>
  );
}

export default App;
```

### 3. **Run the Applications**

1. Run both remote apps (Button v1 and Button v2):

```bash
# In button-v1 folder
npm run start

# In button-v2 folder
npm run start
```

2. Run the host application:

```bash
# In host-app folder
npm run start
```

### Conclusion

By setting up separate remote applications for each version of your React component and using dynamic imports in the host app, you can expose and consume different versions of React components using Webpack Module Federation. This gives you the flexibility to use different versions of the same component in a modular and maintainable way.
