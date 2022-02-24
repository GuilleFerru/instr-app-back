export const formatDate = (date) => {
    return new Date(date).toLocaleString("es-AR", { dateStyle: "short" });
}