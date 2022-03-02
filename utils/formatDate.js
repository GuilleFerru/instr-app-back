export const formatDate = (date) => {
    return new Date(date).toLocaleString("es-AR", { dateStyle: "short" });
}

export const parseStringToDate = (stringDate) => {
    const b = stringDate.split(/\D+/);
    const d = new Date(b[2], b[1] - 1, b[0]);
    let year;
    b[2].length === 2 ? year = `20${b[2]}` : year = `${b[2]}`;
    d.setFullYear(year);
    return d && d.getMonth() == b[1] - 1 ? d : new Date(NaN);
}

export const todayInLocalDate = () => {
    const localToday = new Date().toLocaleDateString();
    const today = parseStringToDate(localToday);
    return today;
}

export const dateInLocalDate = (date) => {
    const localDate = new Date(date).toLocaleDateString();
    const dateResp = parseStringToDate(localDate);
    return dateResp;
}