import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import {
    legacy_createStore as createstore,
    applyMiddleware,
    compose,
} from "redux";
import { thunk } from "redux-thunk";
import reducers from "./reducers";

const store = createstore(reducers, compose(applyMiddleware(thunk)));
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>
);
