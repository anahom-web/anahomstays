import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/site/SmoothScroll";
import Home from "@/pages/Home";

function App() {
  return (
    <div className="App">
      <SmoothScroll>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </SmoothScroll>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#282521",
            color: "#F6F1E9",
            border: "1px solid #A8812F",
            fontFamily: '"Switzer", ui-sans-serif, sans-serif',
          },
        }}
      />
    </div>
  );
}

export default App;
