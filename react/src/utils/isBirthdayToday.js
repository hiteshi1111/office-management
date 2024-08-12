export default function isBirthdayToday(birthday) {
    const birthDate = new Date(birthday);
    const birthMonth = birthDate.getUTCMonth();
    const birthDay = birthDate.getUTCDate();
  
    const currentDate = new Date();
    const currentMonth = currentDate.getUTCMonth();
    const currentDay = currentDate.getUTCDate();

    return birthMonth === currentMonth && birthDay === currentDay;
}