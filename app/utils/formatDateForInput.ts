const formatDateForInput = (date: string): string => {
  console.log("Fecha original:", date);
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    console.error("Fecha inválida:", date);
    return "";
  }
  const formattedDate = parsedDate.toISOString().split("T")[0];
  console.log("Fecha formateada:", formattedDate);
  return formattedDate;
};

export default formatDateForInput;
