import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";
import "./Search.css";

const Search = React.memo((props) => {
  // only interested if this property has changed
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  // useRef will give you the same ref object on every render.
  const inputRef = useRef();

  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      // - the value of enteredFilter will be locked down when
      //   the timer is set.
      // - Compare it to the current value of the input element
      //   to determine if user has stopped typing and then make
      //   the http call if that’s the case.
      if (
        enteredFilter === inputRef.current.value /* How you access the DOM */
      ) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        const url = `https://react-hooks-ingredients-4ede3.firebaseio.com/ingredients.json${query}`;
        sendRequest(url, "GET");
      }
    }, 500);
    return () => {
      // If user keeps typing, just clear the timer
      // set by the previous key stroke
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
