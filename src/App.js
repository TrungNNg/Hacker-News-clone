import React, { useState, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
import List from "./List";
import SearchForm from "./SearchForm";
import { StyledContainer, StyledHeadlinePrimary, StyledButtonSmall } from "./styled";
import GlobalStyle from './globalStyle';
import LastSearches from './LastSearches';

const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";

// When it first run it will set or replace a key called 'search' with 'React'.
// setSearchTerm() function in App() is actualy setValue() function.
// whenever setSearchTerm() get called, setValue() get called here
// which change 'value' which triggle useEffect() to store in localStorage,
// the new 'value' get return which update 'searchTerm' in App();
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

// Reducer function for useReducer() in App(). Has access to action object that 
// return by dispatchStories() function. Will return a new stories state.
const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data:
          action.payload.page === 0
            ? action.payload.list
            : state.data.concat(action.payload.list),
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

// trim the string until only the search term.
const extractSearchTerm = (url) =>
  url
    .substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&"))
    .replace(PARAM_SEARCH, "");

// Recieve an urls array and map it with extractSearchTeam function.
// can make more consice:    => urls.slice(-5).map(extractSearchTerm);
// The extractSeachTerm take in whatever item in array and use it as argument.
// reduce urls array to array that eliminate duplicate.
const getLastSearches = (urls) =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(searchTerm);
      }

      const previousSearchTerm = result[result.length - 1];

      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6)
    .slice(0, -1);

const getUrl = (searchTerm, page) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const App = () => {
  // useSemiPersistentState on line 17.
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  // getUrl() on line 95.
  const [urls, setUrls] = useState([getUrl(searchTerm, 0)]);

  // storiesReducer() on line 29.
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    page: 0,
    isLoading: false,
    isError: false,
  });

  // useCallback change the function only when the searchTerm change.
  // without useCallback() when App() render -> trigger useEffect() 
  // -> call handleFetchStory() -> which re-fetch state -> re-render App(). 
  // handleFetchStories() now reusable since it not in useEffect() only.
  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const lastUrl = urls[urls.length - 1]; // take the last url entry from urls array state.
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  // pass in the urls array to getLastSearches() then store the value in lastSearches.
  // base on getLastSearches() implementation, lastSearches will store an array of [searchTerm]
  const lastSearches = getLastSearches(urls);

  // every time user submit search, url is set and put into urls array
  const handleSearchSubmit = (event) => {
    handleSearch(searchTerm, 0);

    event.preventDefault();
  };

  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  // DRY function for handleSearchSubmit and handleLastSearch.
  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };

  return (
    <StyledContainer>
      <GlobalStyle />
      <StyledHeadlinePrimary>Trung's Hacker Stories</StyledHeadlinePrimary>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />

      <List list={stories.data} onRemoveItem={handleRemoveStory} />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <StyledButtonSmall type="button" onClick={handleMore}>
          More
        </StyledButtonSmall>
      )}
    </StyledContainer>
  );
};

export default App;
