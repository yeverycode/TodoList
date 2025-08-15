export const formatYMD = (d) => {
const dt = (d instanceof Date) ? d : new Date(d);
const m = String(dt.getMonth() + 1).padStart(2, '0');
const day = String(dt.getDate()).padStart(2, '0');
return `${dt.getFullYear()}-${m}-${day}`;
};