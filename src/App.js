import logo from './logo.svg';
import './App.css';
import ODKPlayer, { initializeODKPlayer } from './lib';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    initializeODKPlayer("https://express.staging.nisai.samagra.io", "https://central-demo.nl.samagra.io/v1/projects/9");
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <ODKPlayer
          formId={"UfAhe3PV72GX"}
          height='100vh'
          width='50vw'
          offline={true}
          onChange={onChange}
          onSuccess={onSubmit}
          onFailure={onFailure}
        />
      </header>
    </div>
  );
}

export default App;
