import { Provider } from "react-redux";
import { store } from "./app/store";
import AuthInitializer from "./components/common/AuthInitializer";
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </AuthInitializer>
    </Provider>
  );
};

export default App;
