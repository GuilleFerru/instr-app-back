export const formatDate = (date) => {
    return new Date(date).toLocaleString("es-AR", { dateStyle: "short" });
}

export const parseStringToDate = (stringDate) => {
    const b = stringDate.split(/\D+/);
    const d = new Date(b[2], b[1] - 1, b[0])
    let year;
    b[2].length === 2 ? year = `20${b[2]}` : year = `${b[2]}`;
    d.setFullYear(year);
    return d && d.getMonth() == b[1] - 1 ? d : new Date(NaN);
}


export const parseStringToString = (stringDate) => {
    const arrayDate = stringDate.split(/\D+/)
    const day = arrayDate[2].charAt(0) === '0' ? arrayDate[2].substring(1) : arrayDate[2];
    const month = arrayDate[1].charAt(0) === '0' ? arrayDate[1].substring(1) : arrayDate[1];
    const year = arrayDate[0].substring(2, 4);
    const dateString = `${day}/${month}/${year}`;
    return dateString;
}

export const todayInLocalDate = () => {
    const localToday = new Date().toLocaleDateString('es-AR');
    const today = parseStringToDate(localToday);
    return today;
}

export const getFirstDayOfCurrentMonth = () => {
    const localToday = new Date().toLocaleDateString('es-AR');
    const today = parseStringToDate(localToday);
    // Obtener el primer día del mes
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDayOfMonth;
}


export const dateInLocalDate = (date) => {
    const localDate = new Date(date).toLocaleDateString('es-AR');
    const dateResp = parseStringToDate(localDate);
    return dateResp;
}

export const dateInLocalDateString = (date) => {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const localDateString = new Date(date).toLocaleDateString('es-AR', options);
    return localDateString;
}

export const checkWeekDay = (weekCheckDays) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const dayName = [];
    weekCheckDays.forEach(day => {
        dayName.push(days[day]);
    });
    return dayName.join(' - ');
}

export const getDayName = (dayNumber) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    return days[dayNumber];
}


export const monthAndYearString = (date) => {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthAndYear = `${months[month]} ${year}`;
    return monthAndYear;
}

export const startAndEndOfWeek = (date) => {
    const now = date ? new Date(date).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0);
    const monday = new Date(now);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    const sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    return [monday, sunday];
}