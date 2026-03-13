export const formatTerlambat = (totalMenit) => {
    if (totalMenit < 60) {
        return `${totalMenit} menit`;
    }
    const jam = Math.floor(totalMenit / 60);
    const menit = totalMenit % 60;
    if (menit === 0) {
        return `${jam} jam`;
    }
    return `${jam} jam ${menit} menit`;
};