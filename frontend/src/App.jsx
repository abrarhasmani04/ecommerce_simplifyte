import { Provider } from "react-redux";
import { store } from "./redux/store";
import AuthInitializer from "./components/common/AuthInitializer";
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartAnimationProvider } from "./context/CartAnimationContext";

const App = () => {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <CartAnimationProvider>
          <AppRouter />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
        </CartAnimationProvider>
      </AuthInitializer>
    </Provider>
  );
};

export default App;
