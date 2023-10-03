import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [resultData, setResultData] = useState([]);
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState({ valid: false, msg: '', initial: true });
  const getRepos = async (user: string) => {
    const url = `https://api.github.com/users/${user}/repos`
    await axios
      .get(url)
      .then((response) => {
        setResultData(response as any)
      })
      .catch((error) => {
        setResultData({ data: [] } as any)
        console.log('log some error!', error)
      })
  }

useEffect(() => {
  if (!error.valid) {
    return
  }
  getRepos(username);
}, [username])


useEffect(() => {
  const valid = inputValue.match(/^[A-Za-z0-9]{1,15}$/);
  if (valid && valid?.length > 0) {
    setError({ valid: true, msg: '', initial: false })
  } else if (inputValue.length === 0) {
    setError({ valid: false, msg: 'Username is required.', initial: false });
  } else {
    setError({ valid: false, msg: 'Username only contains numbers and letters.', initial: false });
  }
}, [inputValue])

return (
  <div className="container">
    <div>
      <div className="title">
        <h1>Fetching Repositories By Name</h1>
      </div>
      <div className="form">
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          type="text"
          required
          maxLength={15}
          placeholder="Username"
          name="username"
          aria-label="username"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value) }}
          onKeyUp={(e) => { if (e.code === 'Enter') { setUsername(inputValue) } }}
        />
        <button title="Fetch Repositories" type="button" onClick={() => setUsername(inputValue)}>
          Fetch Repositories
        </button>

        {!error.valid && !error.initial && (
          <div className="alert">
            <div className="alert">
              {error.msg}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="title">Repository results</h2>
        <table className="item-list">
          <caption>
            List of repository names and their watcher count, sorted by ascending
            watcher count.
          </caption>
          <thead>
            <tr>
              <th>Repository name</th>
              <th>watchers</th>
            </tr>
          </thead>
          <tbody>

            {
              (resultData as any)?.data?.length > 0 &&
              (resultData as any).data.map((data: any) => (
                <tr key={data.id}>
                  <td>
                    {data.full_name}
                  </td>
                  <td>
                    {data.watchers}
                  </td>
                </tr>
              )
              )}

            {(!resultData || (resultData as any)?.data?.length === 0) && (
              <tr>
                <td colSpan={2}>No Repositories found for some user</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}

export default App;
