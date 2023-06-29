import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [paginate, setPaginate] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api_key = "iF5aJFN9RntStSgQWNJwbUeVWNAml3RoFkeKyFnA";
        const request_headers = {
          Authorization: `Bearer ${api_key}`,
          "Content-Type": "application/json",
        };
        const response = await fetch("https://countryapi.io/api/all", {
          headers: request_headers,
        });
        const result = await response.json();
        setLoaded(true);
        setItems(result);
      } catch (error) {
        setLoaded(true);
        setError(error);
      }
    };
    fetchData();
  }, []);

  const data = Object.values(items);

  const search_parameters = Object.keys(Object.assign({}, ...data));
  const filter_items = [...new Set(data.map((item) => item.region))];

  const search = (items) => {
    return items.filter(
      (item) =>
        item.region.includes(filter) &&
        search_parameters.some((parameter) =>
          item[parameter].toString().toLowerCase().includes(query)
        )
    );
  };

  const loadMore = () => {
    setPaginate((prevValue) => prevValue + 8);
  };

  if (error) {
    return <>{error.message}</>;
  } else if (!loaded) {
    return <>loading...</>;
  } else
    return (
      <div className="wrapper">
        <header className="App-header">Flag Filter App</header>
        <div className="search-wrapper">
          <label htmlFor="search-form">
            <input
              type="search"
              name="search-form"
              id="search-form"
              className="search-input"
              placeholder="Search for..."
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="sr-only">Search countries here</span>
          </label>
          <div className="select">
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="custom-select"
              aria-label="Filter Countries By Region"
            >
              <option value="">Filter By Region</option>
              {filter_items.map((item) => (
                <option value={item} key={item}>
                  Filter By {item}
                </option>
              ))}
            </select>
            <span className="focus"></span>
          </div>
        </div>
        <ul className="card-grid">
          {search(data)
            .slice(0, paginate)
            .map((item) => (
              <li key={item.alpha3Code}>
                <article className="card">
                  <div className="card-image">
                    <img src={item.flag.large} alt={item.name} />
                  </div>
                </article>
                <div className="card-content">
                  <h2 className="card-name">{item.name}</h2>
                  <ol className="card-list">
                    <li>
                      population: <span>{item.population}</span>
                    </li>
                    <li>
                      Region: <span>{item.region}</span>
                    </li>
                    <li>
                      Capital: <span>{item.capital}</span>
                    </li>
                  </ol>
                </div>
              </li>
            ))}
        </ul>
        <button onClick={loadMore}>Load More</button>
      </div>
    );
}

export default App;
