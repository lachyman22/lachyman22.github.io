function updateMenuTime() {
  const now = new Date();

  const weekday = now.toLocaleString('en-US', { weekday: 'short' }); 
  const month = now.toLocaleString('en-US', { month: 'short' });     
  const day = now.getDate();                                         

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const time = `${hours}:${minutes}:${seconds} ${ampm}`;
  const formatted = `${weekday} ${month} ${day}  ${time}`; 

  document.getElementById('menu-time').textContent = formatted;
}

updateMenuTime();
setInterval(updateMenuTime, 1000);
