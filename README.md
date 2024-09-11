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




Error handling in Webpack Module Federation is crucial because of the dynamic nature of loading micro-frontends or shared modules across multiple applications. If a remote module fails to load or an error occurs during the import process, the host application should gracefully handle it to avoid a poor user experience.

Here are several strategies and best practices for error handling in Webpack Module Federation:

---

### 1. **Error Handling in Dynamic Imports (`import()`)**

Since Webpack Module Federation relies on dynamic imports (`import()`), you can handle errors by using `try/catch` blocks or `.catch()` when importing federated modules.

#### Example:

```js
const loadRemoteComponent = async () => {
  try {
    const Button = await import('remoteApp/Button');
    return Button;
  } catch (error) {
    console.error('Error loading the remote module:', error);
    return null; // Fallback to a default behavior or component
  }
};
```

In this case, the application will log the error and fall back to a safe default if the remote module fails to load.

---

### 2. **Using `React.Suspense` with `React.lazy`**

React's `Suspense` and `lazy` components are helpful for handling loading states and potential errors when working with federated components. You can also use `Error Boundaries` to catch errors that occur during the rendering of remote modules.

#### Example:

```js
import React, { Suspense, lazy } from 'react';

const RemoteButton = lazy(() => import('remoteApp/Button'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading remote button...</div>}>
        <ErrorBoundary>
          <RemoteButton />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
```

Here, the `Suspense` component provides a fallback while the remote module is being loaded. If the remote module fails to load, you can wrap it with an `ErrorBoundary` to catch rendering errors.

---

### 3. **Error Boundaries in React**

React’s error boundaries can be used to catch errors in rendering or during the lifecycle of the remote component. Error boundaries are React components that catch JavaScript errors anywhere in the component tree, log those errors, and display a fallback UI instead of crashing the whole app.

#### Example of an Error Boundary:

```js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in federated component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

Wrap your federated components with the `ErrorBoundary` to gracefully handle any errors that might occur.

#### Example:

```js
<Suspense fallback={<div>Loading...</div>}>
  <ErrorBoundary>
    <RemoteComponent />
  </ErrorBoundary>
</Suspense>
```

---

### 4. **Handling Remote Module Failures with Fallbacks**

In Module Federation, a common issue is that remote modules might not always be available. To mitigate this, you can provide a fallback component or behavior if the remote module fails to load.

#### Example with Fallback Component:

```js
import React, { Suspense, lazy, useState, useEffect } from 'react';

const RemoteButton = lazy(() => import('remoteApp/Button'));
const FallbackButton = () => <button>Fallback Button</button>;

function App() {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    import('remoteApp/Button').catch(() => setLoadError(true));
  }, []);

  return (
    <div>
      {loadError ? (
        <FallbackButton />
      ) : (
        <Suspense fallback={<div>Loading remote button...</div>}>
          <RemoteButton />
        </Suspense>
      )}
    </div>
  );
}
```

Here, if the remote module fails to load, it shows a fallback button.

---

### 5. **Handling Version Mismatches**

One common error in Module Federation is when there is a version mismatch between the shared dependencies. You can mitigate these issues using `ModuleFederationPlugin`'s `shared` option and specifying version constraints for shared dependencies.

#### Example of Shared Configuration with Versioning:

```js
new ModuleFederationPlugin({
  name: 'hostApp',
  remotes: {
    remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: '17.0.2',
    },
    'react-dom': {
      singleton: true,
      requiredVersion: '17.0.2',
    },
  },
}),
```

In this case, both the host and remote applications must share the same version of `react` and `react-dom`. If there's a version mismatch, the application will throw an error.

#### Error Handling for Version Mismatch:

In case of version mismatch, the best practice is to catch the error and show a user-friendly message indicating that there is a version conflict.

---

### 6. **Graceful Handling of Remote Application Unavailability**

Remote applications may be unavailable due to network issues or server downtime. One way to handle this is by using timeouts and error handling during remote application loading.

#### Example with Timeout and Fallback:

```js
const loadRemoteComponentWithTimeout = (remoteUrl, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Remote application timed out'));
    }, timeout);

    import(remoteUrl)
      .then((module) => {
        clearTimeout(timer);
        resolve(module);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

loadRemoteComponentWithTimeout('remoteApp/Button', 3000)
  .then((Button) => {
    // Use the Button component
  })
  .catch((error) => {
    console.error('Error loading the remote component:', error);
    // Fallback to a default component or handle the error gracefully
  });
```

This way, if the remote module takes too long to load, it times out and shows a fallback component or logs an error.

---

### 7. **Webpack Runtime Error Handling**

Webpack itself provides runtime error handling mechanisms for Module Federation. The following events can be used to detect and respond to failures:

- **`unhandledrejection`**: This is useful for catching promise rejections when a remote module fails to load.

#### Example:

```js
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  alert('A remote module failed to load');
});
```

This will catch any rejected promises globally, which is useful for monitoring errors during the dynamic loading of federated modules.

---

### Conclusion

Handling errors effectively in Webpack Module Federation is important to ensure a robust user experience in micro-frontend architectures. Using dynamic imports with proper error handling, React’s `Suspense` and `Error Boundaries`, timeouts, fallbacks, and handling version mismatches are all techniques to ensure that remote modules fail gracefully. These strategies allow applications to remain resilient even when remote micro-frontends encounter issues.

