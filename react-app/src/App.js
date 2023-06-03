import axios from 'axios';

function App() {
  axios.get('http://localhost:8000/')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });


  return (
    <div>
      <div>
          Hello World!
      </div>
    </div>
  );
}

export default App;
