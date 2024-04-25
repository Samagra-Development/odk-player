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
    initializeODKPlayer("https://8065-samagradevelop-workflow-dj4ut8bgzgf.ws-us110.gitpod.io", "https://3560-samagradevelop-workflow-dj4ut8bgzgf.ws-us110.gitpod.io");
  }, [])

  return (
    <div className="App">
      <header className="App-header">
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
