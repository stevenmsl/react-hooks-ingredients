import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
  /*
   The drawback of managing multiple pieces of info in the same object
   is that even when you are just trying to update only one piece of info
   you still need to provide the others as React won’t merge the changes
   for you. 
   This will become quite cumbersome when the state becomes very complex. 
  */
  const [inputState, setInputState] = useState({ title: "", amount: "" });
  const submitHandler = (event) => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={inputState.title}
              onChange={
                // - This causes unnecessary complexity when you put
                //   all the pieces of data inside one object.
                // - you need to set the amount as well
                //   as the changes won’t be merged for you by React
                // - pass a function def to the input State[1] function.
                //   this guarantees that the value you base on is always
                //   correct
                (event) => {
                  // event will be disposed and reused.
                  // that means when you can’t hold a
                  // reference to it in the anonymous function
                  // passed to inputState[1] function as when
                  // the second key stroke is hit the previous
                  // event instance will be set to null.
                  const newTitle = event.target.value;
                  setInputState((prevInputState) => ({
                    // don’t reference event here
                    title: newTitle,
                    amount: prevInputState.amount,
                  }));
                }
              }
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={inputState.amount}
              onChange={(event) => {
                const newAmount = event.target.value;
                setInputState((prevInputState) => ({
                  title: prevInputState.title,
                  amount: newAmount,
                }));
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
