# ODK Player

### A React library to render ODK forms powered by Enketo Express 🔥⚡
ODK (Open Data Kit) is a free and open-source set of tools that help organizations author, field, and manage mobile data collection solutions. Enketo Express is a form engine that enables offline-capable, web-based form filling experiences. ODK Player is a React library that seamlessly integrates Enketo Express with React applications, allowing for easy rendering of ODK forms.

This library simplifies the process of incorporating ODK forms into React projects, providing a smooth and intuitive experience for both developers and users.

## Prerequisites:
Before using ODK Player, ensure the following prerequisites are met:
1. **Deployed Enketo Express Instance:** You need to have a deployed instance of Enketo Express where your ODK forms are hosted.
2. **Deployed OpenRosa-Compliant Server:** ODK forms are typically served through an OpenRosa-compliant server. Ensure that you have a server, for example, Centro, properly deployed and configured.

### How to Use:
To use ODK Player in your React application, follow these steps:

[Insert instructions here]

```jsx
/* Sample Code snippet to incorporate ODK player */
// Import ODKPlayer and initializeODKPlayer from 'odk-player'
import ODKPlayer, { initializeODKPlayer } from 'odk-player';
import { useEffect } from 'react';

function App() {

  const onChange = (data) => {
    console.log("OnChange being executed on data: ", data)
  }

  const onSubmit = (data) => {
    console.log("OnSubmit called on data: ", data);
  }

  const onFailure = (data) => {
    console.log("onFailure called on data: ", data);
  }

  // Call initializeODKPlayer in useEffect with enketo express instance url and open rosa compliant server url.
  useEffect(() => {
    initializeODKPlayer(
        "ENKETO_EXPRESS_SERVER_URI", 
        "OPEN_ROSA_SERVER_URI"
        );
  }, [])

  return (
    <div className="App">
      <header className="App-header">

        {/* Finally load the ODKPlayer component in your app providing in the required props */}
        <ODKPlayer
          formId={"Nursing Form-Medical (CRP)"}
          height='100vh'
          width='50vw'
          offline={false}
          onChange={onChange}
          onSuccess={onSubmit}
          onFailure={onFailure}
        />
      </header>
    </div>
  );
}

export default App;


export default MyODKForm;
```

##  Props:
| Prop     | Type   | Description                                      | Default |
|----------|--------|--------------------------------------------------|---------|
| formId  | string | The id of the form to be rendered | None    |
| height  | string | Height of the iframe to be rendered | 100vh |
| width  | string | Width of the iframe to be rendered | 100vw |
| offline  | boolean | Boolean to decide whether form should work offline or not | false |
| onChange  | function | Callback function to be executed on any form change event | None |
| onSuccess  | function | Callback function to be executed on successful submission of form | None |
| onFailure  | function | Callback function to be executed on failure of form submission  | None |


## Ending Notes:
Thank you for choosing ODK Player! I hope this library makes integrating ODK forms into your React applications a breeze. Don't forget to star my repository if you find it useful!

🌟 Star us on GitHub: [https://github.com/Samagra-Development/odk-player]

Feel free to contribute, report issues, or suggest improvements. Happy coding! 💻✨
