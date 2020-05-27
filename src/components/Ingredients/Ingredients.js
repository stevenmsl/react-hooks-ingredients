import React, { useState, useEffect, useCallback } from "react";

// import IngredientForm from './IngredientForm';
import IngredientForm2 from "./IngredientForm2";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const Ingredients = () => {
  const [userIngreditents, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  // executed after and for each render cycle
  // commented out as this now handled in Search component
  // useEffect(
  //   () => {
  //     fetch(
  //       `https://react-hooks-ingredients-4ede3.firebaseio.com/ingredients.json`
  //     )
  //       .then((response) => response.json()) // convert to json object first
  //       .then((responseData) => {
  //         const loadedIngredients = [];
  //         for (const key in responseData) {
  //           loadedIngredients.push({
  //             id: key,
  //             title: responseData[key].title,
  //             amount: responseData[key].amount,
  //           });
  //         }
  //         setUserIngredients(loadedIngredients);
  //       });
  //   },
  //   [] /* passing an empty array will override the behavior of the useEffect so
  //   that it’s only executed once. Typically used to avoid entering an infinite loop
  //   like ComponentDidMount */
  // );

  useEffect(() => {
    // console.log("Rendering Ingredients", userIngreditents);
  });

  /* 
    this will cause infinite loop
    in Search component as set the state 
    will trigger a re-render which will redefine
    this function. So The useEffect in Search component 
    will be executed again hence entering an infinite loop   
  */
  // const filteredIngredientsHandler = (filteredIngredients) => {
  //   setUserIngredients(filteredIngredients);
  // };

  const filteredIngredientsHandler2 = useCallback(
    (filteredIngredients) => {
      setUserIngredients(filteredIngredients);
    },
    /* setUserIngredients function remains the same
       between re-renders */
    [setUserIngredients]
  );

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-ingredients-4ede3.firebaseio.com/ingredients.json`,
      {
        method: "Post",
        body: JSON.stringify({
          ...ingredient,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        setIsLoading(false);
        return response.json();
      }) // convert to json object first
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-ingredients-4ede3.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        setIsLoading(false);
        setUserIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        );
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const clearError = () => {
    // these two statements reside in the same function
    // so React will batch these two state updates which
    // in turn will trigger only one re-render cycle
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm2
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler2} />
        <IngredientList
          ingredients={userIngreditents}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
