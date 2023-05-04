import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearchQuery = () => {
    fetch(`https://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=pLURtkhVrUXr3KG25Gy5IvzziV5OrZGa&limit=100`)
      .then(response => response.json())
      .then(data => setSearchResults(data.data));
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleClearResults = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAddToSearchHistory = (query) => {
    setSearchHistory([...searchHistory, query]);
    fetch('MY_BACKEND_API_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
  };

  const handleClearSearchHistory = () => {
    setSearchHistory([]);
    fetch('MY_BACKEND_API_URL', {
      method: 'DELETE'
    });
  };

  useEffect(() => {
    fetch('MY_BACKEND_API_URL')
      .then(response => response.json())
      .then(data => setSearchHistory(data));
  }, []);

  useEffect(() => {
    if (searchQuery !== '') {
      handleSearchQuery();
    }
  }, [searchQuery]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

  return (
    <div className="App">
      <header className="App-header">
        <p>Search here your Giphy</p>
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button onClick={handleSearchQuery}>search</button>
        <button onClick={handleClearResults}>clear results</button>
        <br />
        {currentResults.map(result => (
          <img key={result.id} src={result.images.fixed_height.url} alt={result.title} />
        ))}
        <br />
        <button onClick={handleLoadMore}>load more</button>
        <br />
        <ul>
          {searchHistory.map(query => (
            <li key={query}>{query}</li>
          ))}
        </ul>
        <button onClick={handleClearSearchHistory}>clear search history</button>
      </header>
    </div>
  );
}

export default App;