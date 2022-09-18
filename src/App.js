import logo from './logo.svg';
import './App.css';
import GoogleAuthenticator from './googleAuthenticator';

function App() {
  return (
    <div className="App">
        <GoogleAuthenticator />
    </div>
  );
}

export default App;


{/* {
            <div>
                <h2>{validCode}</h2>
                <button onClick={getCode}>Get valid code</button>
            </div>
            } */}