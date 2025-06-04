const keys = [
    'myf4.2_release__daily',
    'myf4.2_release__official',
    'myf4.2_u_release__daily',
    'myf4.2_u_release__official',
    'alliance_u_release__daily',
    'alliance_u_release__official'
    //'추가 시 브랜치 명 넣기'
  ];
  
  // 한글 날짜 포맷

  function formatDateKorean(date) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const weekday = days[date.getDay()];
    return `🕗 ${year}년 ${month}월 ${day}일 (${weekday}) 🕔`;
  }

  function getTimestamp() {
    const now = new Date();
    const y = now.getFullYear();
    const m = ('0' + (now.getMonth() + 1)).slice(-2);
    const d = ('0' + now.getDate()).slice(-2);
    const h = ('0' + now.getHours()).slice(-2);
    const min = ('0' + now.getMinutes()).slice(-2);
    const s = ('0' + now.getSeconds()).slice(-2);
    return `[${y}-${m}-${d} ${h}:${min}:${s}]`;
  }
  
  function addLog(message) {
    const logEntry = `${getTimestamp()} ${message}`;
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('logs', JSON.stringify(logs));
    displayLogs();
  }
  
  function displayLogs() {
    const logDiv = document.getElementById('log');
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  
    logDiv.innerHTML = logs.map(log => {
      if (log.includes('+1')) {
        return `<div style="color: #2563eb;">${log}</div>`; // 파란색
      } else if (log.includes('-1')) {
        return `<div style="color: #dc2626;">${log}</div>`; // 빨간색
      } else {
        return `<div>${log}</div>`;
      }
    }).join('');
  
    // 스크롤 맨 아래로 이동
    setTimeout(() => {
      logDiv.scrollTop = logDiv.scrollHeight;
    }, 0);
  }
  
  function loadCounts() {
    keys.forEach(key => {
      const saved = localStorage.getItem(key);
      const count = saved ? parseInt(saved, 10) : 0;
      const elem = document.getElementById('count-' + key);
      if (elem) elem.innerText = count;
    });
  }
  
  function updateCount(key, delta) {
    let count = parseInt(localStorage.getItem(key) || '0', 10);
    count += delta;
    if (count < 0) count = 0;
    localStorage.setItem(key, count);
    const elem = document.getElementById('count-' + key);
    if (elem) elem.innerText = count;
    const action = delta > 0 ? `+${delta}` : `${delta}`;
    addLog(`${key} ${action} → ${count}`);
  }
  
  function resetCount(key) {
    localStorage.setItem(key, 0);
    const elem = document.getElementById('count-' + key);
    if (elem) elem.innerText = 0;
    addLog(`${key} 초기화 → 0`);
  }
  
  function resetAll() {
    keys.forEach(key => {
      localStorage.setItem(key, 0);
      const elem = document.getElementById('count-' + key);
      if (elem) elem.innerText = 0;
    });
    addLog(`모두 초기화 (숫자만)`);
  }
  
  function clearAll() {
    keys.forEach(key => {
      localStorage.removeItem(key);
      const elem = document.getElementById('count-' + key);
      if (elem) elem.innerText = 0;
    });
    localStorage.removeItem('logs');
    displayLogs();
    addLog(`전체 초기화 (카운트+로그)`);
  }
  
  window.onload = function () {
    //document.getElementById('today-date').innerText = formatDateKorean(new Date());
    updateDateTime();
    loadCounts();
    displayLogs();
  };
  