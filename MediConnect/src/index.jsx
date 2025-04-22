import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store"; // Ensure correct store import
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
