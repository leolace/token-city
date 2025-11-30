import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Button variant="outline" onClick={() => setCount((prev) => prev + 1)}>
        teste {count}
      </Button>
    </div>
  );
}

export default App;
