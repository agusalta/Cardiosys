const formatDateForInput = (date: string): string => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    ("Fecha inválida:", date);
    return "";
  }
  const formattedDate = parsedDate.toISOString().split("T")[0];

  return formattedDate;
};

export default formatDateForInput;
