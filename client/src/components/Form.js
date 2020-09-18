import React from "react";

function form(props) {
  return (
    <div className="Form">
      <p>Enter proper product name</p>
      <form onSubmit={props.formSubmit} className="MainForm">
        <div className="form__group field">
          <input
            type="input"
            className="form__field"
            placeholder="product name"
            autoComplete="off"
            value={props.product}
            onChange={props.inputChange}
            name="name"
            id="name"
            required
          />

          <label htmlFor="name" className="form__label">
            Product name
          </label>
        </div>

        <button
          variant="contained"
          color="primary"
          className="button"
          onClick={props.formSubmit}
          disabled={props.product.length === 0 ? true : false}
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default form;
