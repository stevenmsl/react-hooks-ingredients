import React, { useReducer, useEffect, useCallback, useMemo } from "react";
// import IngredientForm from './IngredientForm';
import IngredientForm2 from "./IngredientForm2";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";
/*
  useReducer
  - when you have complex state logic that involves multiple sub-values 
  - when the next state depends on the previous one
  - code is easier to understand 
*/
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      // React will re-render the component when reducer
      // return a new state
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Invalid action type");
  }
};

const Ingredients2 = () => {
  const [userIngreditents, dispatch] = useReducer(ingredientReducer, []);

  const {
    isLoading,
    data,
    error,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier) {
      switch (reqIdentifier) {
        case "REMOVE_INGREDIENT":
          dispatch({ type: "DELETE", id: reqExtra });
          break;
        case "ADD_INGREDIENT":
          dispatch({
            type: "ADD",
            ingredient: { id: data.name, ...reqExtra },
          });
          break;
        default:
      }
    }
  }, [data, isLoading, error, reqIdentifier, reqExtra]);

  const filteredIngredientsHandler2 = useCallback((filteredIngredients) => {
    dispatch({
      type: "SET",
      ingredients: filteredIngredients,
    });
  }, []);

  // - use useCallback to prevent this function from being re-created
  //   so the IngredientForm2 will not have unnecessary re-renders
  // - React.memo is required to wrap the child component
  const addIngredientHandler = useCallback(
    (ingredient) => {
      const url = `https://react-hooks-ingredients-4ede3.firebaseio.com/ingredients.json`;
      sendRequest(
        url,
        "POST",
        JSON.stringify(ingredient),
        ingredient, // what has been sent
        "ADD_INGREDIENT" // what has been done
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `https://react-hooks-ingredients-4ede3.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  // - useMemo will only recompute the memoized value
  //   when one of the dependencies has changed.
  //   This optimization helps to avoid expensive
  //   calculations on every render.
  // - use useMemo to prevent <IngredientList/> the
  //   from unnecessary renders
  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngreditents}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [
    userIngreditents,
    // use useCallback to prevent removeIngredientHandler
    // from being re-created
    removeIngredientHandler,
  ]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm2
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler2} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients2;
