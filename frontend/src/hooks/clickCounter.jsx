import { useState } from "react";

const useClickCounter = (ini = 0) => {
    const [count, setCount] = useState(ini);
    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => prev - 1);
    const reset = () => setCount(ini);

    return {
        count,
        increment,
        decrement,
        reset
    };
}

export default useClickCounter;