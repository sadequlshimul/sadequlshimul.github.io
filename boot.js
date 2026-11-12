/* ===== boot.js: সবশেষে চালু: সব ফাইল লোড হওয়ার পর শুরু ===== */
window.addEventListener('hashchange',route);
renderWg();route();loadCourses(true);
