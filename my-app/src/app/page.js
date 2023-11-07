"use client";
import store from "./store";
import InitGame from "../../components/InitGame";
import { Provider } from "react-redux";

export default function Home() {
  return (
    <Provider store={store}>
      <main>
        <InitGame />
      </main>
    </Provider>
  );
}
