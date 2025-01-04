import { useState,useEffect } from "react";


const useGreeting = () => {
    const [greeting, setGreeting] = useState<string>('');
    useEffect(() => {
        const date = new Date();
        const hours = date.getHours();
        if (hours < 12) {
            setGreeting('Buen día');
        } else if (hours < 18) {
            setGreeting('Buenas tardes');
        } else {
            setGreeting('Buenas noches');
        }
    }, []);

    return greeting;
}

export default useGreeting;