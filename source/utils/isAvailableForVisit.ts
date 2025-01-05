const getCurrentDay = () => {
    const today = new Date().getDay(); // 0 (Domingo) a 6 (Sábado)
    return today;
  };
  
  export const isAvailableForVisit = (daysOfWeek: number[] | undefined) => {
    const currentDay = getCurrentDay();
    
    // Verifica si daysOfWeek es un array
    if (!Array.isArray(daysOfWeek)) {
        return false; // O puedes devolver true si prefieres
    }
  
    // console.log(daysOfWeek.includes(currentrDay));
    return daysOfWeek.includes(currentDay);
  };
  