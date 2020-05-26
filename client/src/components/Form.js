import React from 'react';
import './../styles/Form.scss';


function form(props) {
    return (
        <div className="Form">
            <p>Enter proper product name</p>
            <form onSubmit={props.formSubmit} className="MainForm" >
            
            <div class="form__group field">
                <input 
                    type="input"
                    class="form__field" 
                    placeholder="product name" 
                    autoComplete="off"
                    value={props.product}
                    onChange={props.inputChange}
                    name="name" id='name' 
                    required />

                <label for="name" class="form__label">Product name</label>
            </div>

            <button
                variant="contained"
                color="primary"
                className="button"
                onClick={props.formSubmit}
                disabled={!props.product.length > 0 ? true : null}
            >
                Search
            </button>
            </form>

        </div>
    )
}

export default form;
