// --- HELPER FUNCTION: GET ROLE COLOR STYLES ---
function getRoleBadgeStyle(role) {
    const r = (role || '').toLowerCase();
    if (r.includes('ต้อนรับ') || r.includes('reception')) {
        return { badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40', textClass: 'text-amber-300' };
    }
    if (r.includes('การตลาด') || r.includes('เสมียน') || r.includes('marketing') || r.includes('clerk') || r.includes('admin')) {
        return { badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40', textClass: 'text-sky-300' };
    }
    if (r.includes('เบลบอย') || r.includes('bellboy') || r.includes('porter')) {
        return { badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40', textClass: 'text-purple-300' };
    }
    if (r.includes('แม่บ้าน') || r.includes('housekeeping') || r.includes('maid')) {
        return { badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40', textClass: 'text-pink-300' };
    }
    if (r.includes('รปภ') || r.includes('รักษาความปลอดภัย') || r.includes('security')) {
        return { badgeClass: 'bg-blue-600/30 text-blue-300 border-blue-500/40', textClass: 'text-blue-300' };
    }
    if (r.includes('ช่าง') || r.includes('engineer') || r.includes('maintenance')) {
        return { badgeClass: 'bg-amber-900/40 text-amber-200 border-amber-700/50', textClass: 'text-amber-300' };
    }
    return { badgeClass: 'bg-slate-800 text-slate-300 border-slate-700', textClass: 'text-indigo-300' };
}

// --- DYNAMIC BACKGROUND PARTICLE CANVAS ANIMATION ---
function initBackgroundParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    });

    const particles = Array.from({ length: 30 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.5 ? '#818cf8' : '#c084fc'
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// --- SWIMMING FISH IN THE SAME AREA AS KRATHONG ---
function initLegendSwimmingFish() {
    const canvas = document.getElementById('legend-fish-canvas');
    const box = document.getElementById('shift-legend-box');
    if (!canvas || !box) return;
    const ctx = canvas.getContext('2d');

    function resizeLegendCanvas() {
        const rect = box.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(rect.width));
        canvas.height = Math.max(1, Math.floor(rect.height));
    }
    resizeLegendCanvas();

    const resizeObserver = new ResizeObserver(resizeLegendCanvas);
    resizeObserver.observe(box);
    window.addEventListener('resize', resizeLegendCanvas);

    const fishPalettes = [
        { body: '#38bdf8', fin: '#818cf8', glow: 'rgba(56, 189, 248, 0.45)' },
        { body: '#f472b6', fin: '#e879f9', glow: 'rgba(244, 114, 182, 0.45)' },
        { body: '#34d399', fin: '#22d3ee', glow: 'rgba(52, 211, 153, 0.45)' },
        { body: '#fbbf24', fin: '#fb923c', glow: 'rgba(251, 191, 36, 0.45)' },
        { body: '#a78bfa', fin: '#f472b6', glow: 'rgba(167, 139, 250, 0.45)' }
    ];

    const fishes = Array.from({ length: 6 }, (_, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const palette = fishPalettes[i % fishPalettes.length];
        return {
            x: Math.random() * (canvas.width || 600),
            y: 12 + Math.random() * Math.max(20, (canvas.height || 64) - 24),
            size: 7 + Math.random() * 5,
            speedX: dir * (0.4 + Math.random() * 0.45),
            waveFreq: 0.025 + Math.random() * 0.015,
            phase: Math.random() * Math.PI * 2,
            tailPhase: Math.random() * Math.PI * 2,
            alpha: 0.36 + Math.random() * 0.16,
            palette
        };
    });

    function drawFish(fish, time) {
        const dir = fish.speedX >= 0 ? 1 : -1;
        const s = fish.size;
        const tailWag = Math.sin(time * 0.011 + fish.tailPhase) * (s * 0.38);

        ctx.save();
        ctx.translate(fish.x, fish.y);
        ctx.scale(dir, 1);
        ctx.globalAlpha = fish.alpha;
        ctx.shadowColor = fish.palette.glow;
        ctx.shadowBlur = 10;

        // Tail fin
        ctx.beginPath();
        ctx.moveTo(-s * 0.85, 0);
        ctx.quadraticCurveTo(-s * 1.45, -s * 0.55 + tailWag, -s * 1.55, -s * 0.12 + tailWag * 0.6);
        ctx.quadraticCurveTo(-s * 1.25, tailWag * 0.3, -s * 1.5, s * 0.22 + tailWag * 0.6);
        ctx.quadraticCurveTo(-s * 1.35, s * 0.55 + tailWag, -s * 0.85, 0);
        ctx.closePath();
        ctx.fillStyle = fish.palette.fin;
        ctx.fill();

        // Fish body
        ctx.beginPath();
        ctx.moveTo(s, 0);
        ctx.quadraticCurveTo(s * 0.2, -s * 0.65, -s * 0.9, 0);
        ctx.quadraticCurveTo(s * 0.2, s * 0.65, s, 0);
        ctx.closePath();
        ctx.fillStyle = fish.palette.body;
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.arc(s * 0.55, -s * 0.12, Math.max(1.2, s * 0.11), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
    }

    function animate(time = 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const minY = 12;
        const maxY = Math.max(minY + 8, canvas.height - 12);

        fishes.forEach(fish => {
            fish.x += fish.speedX;
            fish.y += Math.sin(fish.x * fish.waveFreq + fish.phase) * 0.22;

            const margin = fish.size * 2.2;
            if (fish.speedX > 0 && fish.x > canvas.width + margin) {
                fish.x = -margin;
                fish.y = minY + Math.random() * (maxY - minY);
            } else if (fish.speedX < 0 && fish.x < -margin) {
                fish.x = canvas.width + margin;
                fish.y = minY + Math.random() * (maxY - minY);
            }

            if (fish.y < minY) fish.y = minY;
            if (fish.y > maxY) fish.y = maxY;

            drawFish(fish, time);
        });

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// --- PET THE RABBIT INTERACTION ---
function petTheRabbit() {
    const messages = [
        "กระโดดดึ๋งๆ! แบดจ์กะสีสวยสดใสมากๆ เลยค่ะ 🐰✨",
        "น้องกระต่ายช่วยเช็คประเภทกะให้เรียบร้อยแล้วน้า! 🥕",
        "เย้! จัดตารางกะกับกระต่ายน้อยกันเถอะค่า 💖",
        "กระต่ายน้อยตรวจดูสีสัญลักษณ์กะให้แล้ว สมบูรณ์แบบสุดๆ! ⭐"
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('rabbit-greeting-text').innerText = randomMsg;
    showModal('น้องกระต่าย 3D ส่งเสียงทักทาย', randomMsg);
}

// --- FIREBASE CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyCGUrUodL8btfwYECGfE6FtdFDz2uoqDaI",
    authDomain: "work-schedule-fbdee.firebaseapp.com",
    databaseURL: "https://work-schedule-fbdee-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "work-schedule-fbdee",
    storageBucket: "work-schedule-fbdee.firebasestorage.app",
    messagingSenderId: "935130124839",
    appId: "1:935130124839:web:78cb9af3e898077eea7402",
    measurementId: "G-VXTMXJV5G2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const monthNamesTH = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const dayNamesTH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const dayShortNamesTH = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

let hasInitialAutoScrolled = false;
let saveTimeout = null;

const DEFAULT_EMPLOYEES = [
    { id: 'EMP001', name: 'กัญญา ต้อนรับดี', role: 'พนักงานต้อนรับ (Reception)' },
    { id: 'EMP002', name: 'สมชาย ใจดี', role: 'การตลาด / เสมียน' },
    { id: 'EMP003', name: 'วิชัย มั่นคง', role: 'ช่างเทคนิค' },
    { id: 'EMP004', name: 'สุดา สุขสบาย', role: 'แม่บ้าน' }
];

const DEFAULT_SHIFTS = [
    { code: 'OFF', name: 'หยุด', start: '-', end: '-', bg: '#f1f5f9', text: '#64748b' },
    { code: 'M', name: 'กะเช้า', start: '07:00', end: '15:00', bg: '#dbeafe', text: '#1e40af' },
    { code: 'A', name: 'กะบ่าย', start: '15:00', end: '23:00', bg: '#ffedd5', text: '#c2410c' },
    { code: 'N', name: 'กะดึก', start: '23:00', end: '07:00', bg: '#e0e7ff', text: '#3730a3' },
    { code: '12H', name: 'กะเต็มวัน', start: '08:00', end: '20:00', bg: '#dcfce7', text: '#166534' }
];

let employees = JSON.parse(localStorage.getItem('shift_employees')) || DEFAULT_EMPLOYEES;
let shifts = JSON.parse(localStorage.getItem('shift_types')) || DEFAULT_SHIFTS;
let scheduleData = JSON.parse(localStorage.getItem('shift_schedule')) || {};

function displayTodayInfo() {
    const today = new Date();
    document.getElementById('today-text-display').innerText = `วันนี้: วัน${dayNamesTH[today.getDay()]}ที่ ${today.getDate()} ${monthNamesTH[today.getMonth()]} ${today.getFullYear() + 543}`;
}

function initRealtimeSync() {
    db.ref('employees').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            employees = Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
        }
        localStorage.setItem('shift_employees', JSON.stringify(employees));
        updateRosterView();
        if (!document.getElementById('tab-employees').classList.contains('hidden')) renderEmployeeTable();
    });

    db.ref('shifts').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            shifts = Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
        } else {
            db.ref('shifts').set(DEFAULT_SHIFTS);
            shifts = DEFAULT_SHIFTS;
        }
        localStorage.setItem('shift_types', JSON.stringify(shifts));
        updateRosterView();
    });

    db.ref('scheduleData').on('value', (snapshot) => {
        scheduleData = snapshot.val() || {};
        localStorage.setItem('shift_schedule', JSON.stringify(scheduleData));
        updateRosterView();
        if (!document.getElementById('tab-daily').classList.contains('hidden')) renderDailyOverview();
    });
}

function saveData() {
    db.ref('employees').set(employees);
    const shiftObj = {};
    shifts.forEach(s => { if (s && s.code) shiftObj[s.code] = s; });
    db.ref('shifts').set(shiftObj);
    localStorage.setItem('shift_employees', JSON.stringify(employees));
    localStorage.setItem('shift_types', JSON.stringify(shifts));
}

function saveScheduleOnly() {
    localStorage.setItem('shift_schedule', JSON.stringify(scheduleData));
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        db.ref('scheduleData').set(scheduleData);
    }, 300);
}

function showModal(title, message, onConfirm = null) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    const actions = document.getElementById('modal-actions');
    if (onConfirm) {
        actions.innerHTML = `
            <button onclick="closeModal()" class="btn-space-3d px-4 py-2 text-slate-300 rounded-xl text-xs font-bold border-slate-600">ยกเลิก</button>
            <button id="modal-confirm-btn" class="btn-space-3d px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-glow-rose border-rose-400/50">ยืนยัน</button>
        `;
        document.getElementById('modal-confirm-btn').onclick = () => { onConfirm(); closeModal(); };
    } else {
        actions.innerHTML = `<button onclick="closeModal()" class="btn-space-3d px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-glow-indigo border-indigo-400/50">ตกลง</button>`;
    }
    document.getElementById('app-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('app-modal').classList.add('hidden'); }
function openShiftSettingsModal() { renderShiftModalList(); document.getElementById('shift-settings-modal').classList.remove('hidden'); lucide.createIcons(); }
function closeShiftSettingsModal() { document.getElementById('shift-settings-modal').classList.add('hidden'); updateRosterView(); }

function switchTab(tabId) {
    ['roster', 'daily', 'employees'].forEach(t => {
        document.getElementById(`tab-${t}`).classList.add('hidden');
        document.getElementById(`nav-${t}`).className = "btn-space-3d w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-slate-300 hover:text-white border-slate-700/80";
    });
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    document.getElementById(`nav-${tabId}`).className = "btn-space-3d w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-glow-indigo border-indigo-400/50";

    const titles = { roster: 'ตารางงานรายเดือน', daily: 'สรุปรายวัน', employees: 'จัดการพนักงาน' };
    document.getElementById('page-title').innerText = titles[tabId];

    if (tabId === 'roster') updateRosterView();
    if (tabId === 'daily') renderDailyOverview();
    if (tabId === 'employees') renderEmployeeTable();
}

function initRosterSelectors() {
    const monthSelect = document.getElementById('roster-month');
    const yearSelect = document.getElementById('roster-year');
    const now = new Date();
    monthSelect.value = now.getMonth();
    yearSelect.innerHTML = '';
    for (let y = now.getFullYear() - 2; y <= now.getFullYear() + 2; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.innerText = y + 543;
        opt.className = "bg-slate-900";
        if (y === now.getFullYear()) opt.selected = true;
        yearSelect.appendChild(opt);
    }
}

function jumpToToday() {
    const now = new Date();
    document.getElementById('roster-month').value = now.getMonth();
    document.getElementById('roster-year').value = now.getFullYear();
    updateRosterView();

    requestAnimationFrame(() => {
        setTimeout(() => scrollToTodayColumn(), 50);
    });
}

function scrollToTodayColumn() {
    const todayCol = document.getElementById('today-col-header');
    const container = document.getElementById('roster-table-container');
    const stickyCol = document.querySelector('.emp-dark-col');

    if (todayCol && container) {
        const stickyWidth = stickyCol ? stickyCol.offsetWidth : 200;
        const targetLeft = todayCol.offsetLeft - stickyWidth;

        container.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: 'smooth'
        });
    }
}

function autoScrollToTodayOnLoad() {
    if (hasInitialAutoScrolled) return;
    const month = parseInt(document.getElementById('roster-month').value);
    const year = parseInt(document.getElementById('roster-year').value);
    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() === month) {
        setTimeout(() => { scrollToTodayColumn(); hasInitialAutoScrolled = true; }, 150);
    }
}

function updateRosterView() {
    const month = parseInt(document.getElementById('roster-month').value);
    const year = parseInt(document.getElementById('roster-year').value);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonthYear = (today.getFullYear() === year && today.getMonth() === month);
    const todayDate = today.getDate();

    document.getElementById('print-header-title').innerText = `ตารางปฏิบัติงานพนักงาน ประจำเดือน ${monthNamesTH[month]} พ.ศ. ${year + 543}`;

    document.getElementById('roster-legend').innerHTML = shifts.map(s => `
        <span class="inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-extrabold shadow-3d-sm transition-all hover:scale-105 cursor-pointer border border-white/20" style="background-color: ${s.bg}; color: ${s.text};">
            ${s.code}: ${s.name} (${s.start !== '-' ? s.start + '-' + s.end : 'หยุด'})
        </span>
    `).join('');

    let headHTML = `<tr><th class="py-2.5 px-3 emp-dark-col min-w-[200px] text-xs font-extrabold border-r border-slate-700">รหัสและรายชื่อพนักงาน</th>`;
    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
        const isToday = isCurrentMonthYear && (d === todayDate);
        let bgClass = isWeekend ? 'bg-rose-950/40 text-rose-300 font-semibold' : 'bg-slate-900 text-slate-300';
        if (isToday) bgClass = 'today-laser-column text-white font-extrabold';

        headHTML += `<th ${isToday ? 'id="today-col-header"' : ''} class="py-1.5 px-0 text-center border-r border-slate-800 w-[42px] min-w-[42px] max-w-[42px] ${bgClass}">
            <div class="text-[9px] ${isToday ? 'text-indigo-200 font-extrabold' : 'text-slate-400'} leading-none mb-0.5">${dayShortNamesTH[dateObj.getDay()]}</div>
            <div class="font-extrabold text-xs leading-none">${d}</div>
            ${isToday ? '<div class="text-[8px] leading-none mt-0.5 text-amber-300 font-extrabold no-print flex items-center justify-center gap-0.5"><span class="animate-star-twinkle">⭐</span> วันนี้</div>' : ''}
        </th>`;
    }
    headHTML += `<th class="py-2.5 px-2 text-center min-w-[60px] text-xs font-extrabold bg-slate-900 text-slate-200">รวมวัน</th></tr>`;
    document.getElementById('roster-thead').innerHTML = headHTML;

    const tbody = document.getElementById('roster-tbody');
    if (!employees || employees.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${daysInMonth + 2}" class="p-8 text-center text-slate-400">ยังไม่มีข้อมูลพนักงาน กรุณาเพิ่มพนักงานในเมนู "จัดการพนักงาน"</td></tr>`;
        return;
    }

    let bodyHTML = '';
    employees.forEach((emp, index) => {
        if (!emp) return;
        let workDaysCount = 0;
        const roleStyle = getRoleBadgeStyle(emp.role);

        bodyHTML += `<tr class="hover:bg-indigo-950/30 transition-colors">`;
        bodyHTML += `<td class="py-2 px-3 emp-dark-col border-r border-slate-800">
            <div class="flex items-center justify-between gap-1">
                <div class="flex items-center space-x-2 overflow-hidden">
                    <span class="text-[9.5px] font-extrabold border px-1.5 py-0.5 rounded-md shrink-0 shadow-sm ${roleStyle.badgeClass}">[${emp.id}]</span>
                    <div class="overflow-hidden leading-tight">
                        <div class="text-slate-100 text-xs font-bold truncate max-w-[105px]" title="${emp.name}">${emp.name}</div>
                        <div class="text-[9.5px] font-medium truncate max-w-[105px] ${roleStyle.textClass}" title="${emp.role}">${emp.role}</div>
                    </div>
                </div>
                <div class="flex flex-col shrink-0 gap-0.5 no-print">
                    <button onclick="moveEmployee(${index}, -1)" ${index === 0 ? 'disabled class="opacity-30 cursor-not-allowed"' : ''} class="text-[9px] bg-slate-800 hover:bg-slate-700 text-indigo-300 px-1 rounded transition" title="เลื่อนขึ้น">▲</button>
                    <button onclick="moveEmployee(${index}, 1)" ${index === employees.length - 1 ? 'disabled class="opacity-30 cursor-not-allowed"' : ''} class="text-[9px] bg-slate-800 hover:bg-slate-700 text-indigo-300 px-1 rounded transition" title="เลื่อนลง">▼</button>
                </div>
            </div>
        </td>`;

        for (let d = 1; d <= daysInMonth; d++) {
            const currentShiftCode = scheduleData[`${year}_${month}_${emp.id}_${d}`] || 'OFF';
            const shiftObj = shifts.find(s => s.code === currentShiftCode) || shifts[0];
            if (currentShiftCode !== 'OFF') workDaysCount++;
            const isToday = isCurrentMonthYear && (d === todayDate);

            bodyHTML += `<td class="p-0.5 text-center border-r border-slate-800/80 h-[40px] ${isToday ? 'today-laser-column' : ''}">
                <select onchange="handleShiftChange('${emp.id}', ${year}, ${month}, ${d}, this)"
                    class="shift-select-badge-3d w-full h-[34px] text-center text-xs font-extrabold py-0 px-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none shadow-3d-sm"
                    style="background-color: ${shiftObj.bg}; color: ${shiftObj.text};">
                    ${shifts.map(s => `<option value="${s.code}" ${s.code === currentShiftCode ? 'selected' : ''} style="background: #0f172a; color: white; font-size: 12px; font-weight: 700;">${s.code}</option>`).join('')}
                </select>
            </td>`;
        }
        bodyHTML += `<td class="py-2 px-2 text-center font-extrabold text-white bg-slate-900/60 text-xs">${workDaysCount} วัน</td>`;
        bodyHTML += `</tr>`;
    });
    tbody.innerHTML = bodyHTML;
    autoScrollToTodayOnLoad();
}

function moveEmployee(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= employees.length) return;

    const temp = employees[index];
    employees[index] = employees[newIndex];
    employees[newIndex] = temp;

    saveData();
    updateRosterView();
    if (!document.getElementById('tab-employees').classList.contains('hidden')) {
        renderEmployeeTable();
    }
}

function handleShiftChange(empId, year, month, day, selectElement) {
    scheduleData[`${year}_${month}_${empId}_${day}`] = selectElement.value;
    const shiftObj = shifts.find(s => s.code === selectElement.value) || shifts[0];
    selectElement.style.backgroundColor = shiftObj.bg;
    selectElement.style.color = shiftObj.text;
    saveScheduleOnly();
}

function printRosterPDF() { window.print(); }

function resetMonthSchedule() {
    showModal('ยืนยันการล้างข้อมูล', 'คุณต้องการล้างตารางกะของเดือนนี้ทั้งหมดใช่หรือไม่?', () => {
        const month = parseInt(document.getElementById('roster-month').value);
        const year = parseInt(document.getElementById('roster-year').value);
        Object.keys(scheduleData).forEach(k => { if (k.startsWith(`${year}_${month}_`)) delete scheduleData[k]; });
        saveScheduleOnly();
        updateRosterView();
    });
}

function exportRosterExcel() {
    const month = parseInt(document.getElementById('roster-month').value);
    const year = parseInt(document.getElementById('roster-year').value);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let headerRow = ["รหัสพนักงาน", "ชื่อพนักงาน", "ตำแหน่ง"];
    for (let d = 1; d <= daysInMonth; d++) headerRow.push(`${dayShortNamesTH[new Date(year, month, d).getDay()]} ${d}`);
    headerRow.push("รวมวันปฏิบัติงาน");

    let excelData = [headerRow];
    employees.forEach(emp => {
        if (!emp) return;
        let row = [`[${emp.id}]`, emp.name, emp.role];
        let workDaysCount = 0;
        for (let d = 1; d <= daysInMonth; d++) {
            const code = scheduleData[`${year}_${month}_${emp.id}_${d}`] || 'OFF';
            row.push(code);
            if (code !== 'OFF') workDaysCount++;
        }
        row.push(workDaysCount);
        excelData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ตารางกะพนักงาน");
    XLSX.writeFile(wb, `ShiftRoster_${monthNamesTH[month]}_${year + 543}.xlsx`);
}

function initDailyPicker() {
    document.getElementById('daily-date-picker').value = new Date().toISOString().split('T')[0];
    renderDailyOverview();
}

function setDailyPickerToToday() {
    document.getElementById('daily-date-picker').value = new Date().toISOString().split('T')[0];
    renderDailyOverview();
}

function renderDailyOverview() {
    const dateVal = document.getElementById('daily-date-picker').value;
    if (!dateVal) return;
    const dateObj = new Date(dateVal);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();

    let html = '';
    let totalAssigned = 0;

    shifts.forEach(shift => {
        const assignedEmps = employees.filter(emp => emp && (scheduleData[`${year}_${month}_${emp.id}_${day}`] || 'OFF') === shift.code);
        if (shift.code !== 'OFF') totalAssigned += assignedEmps.length;

        html += `
            <div class="glass-panel-3d rounded-2xl overflow-hidden flex flex-col transition-all hover:scale-[1.01] shadow-3d-md border border-white/10">
                <div class="p-3 border-b border-white/10 flex items-center justify-between shadow-sm" style="background-color: ${shift.bg}; color: ${shift.text};">
                    <div class="font-bold flex items-center space-x-2 text-xs">
                        <span class="px-2.5 py-0.5 rounded-lg bg-white/90 text-xs font-extrabold shadow-3d-sm">${shift.code}</span>
                        <span class="text-xs tracking-tight font-extrabold">${shift.name}</span>
                    </div>
                    <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white/90 shadow-3d-sm">${assignedEmps.length} คน</span>
                </div>
                <div class="px-3 py-1.5 bg-slate-950/60 border-b border-slate-800 text-[10.5px] text-indigo-300 font-bold">
                    เวลาปฏิบัติงาน: ${shift.start !== '-' ? shift.start + ' - ' + shift.end : 'วันหยุด'}
                </div>
                <div class="p-3 flex-1 space-y-2" style="max-height: 280px; overflow-y: auto;">
                    ${assignedEmps.length === 0 ? `<p class="text-xs text-slate-500 italic text-center py-6">ไม่มีพนักงานในกะนี้</p>` : ''}
                    ${assignedEmps.map(emp => {
                        const roleStyle = getRoleBadgeStyle(emp.role);
                        return `
                            <div class="flex items-center justify-between p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 shadow-3d-sm">
                                <div>
                                    <div class="text-[10.5px] font-extrabold ${roleStyle.textClass}">[${emp.id}]</div>
                                    <div class="text-xs font-bold text-white">${emp.name}</div>
                                </div>
                                <span class="text-[9.5px] font-bold border px-2 py-0.5 rounded-lg ${roleStyle.badgeClass}">${emp.role}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });
    document.getElementById('daily-shift-cards').innerHTML = html;
    document.getElementById('daily-stats-summary').innerHTML = `<span class="bg-indigo-950/80 text-indigo-300 px-3.5 py-1.5 rounded-xl border border-indigo-700/50 font-extrabold text-xs shadow-3d-sm">ปฏิบัติงานรวม: ${totalAssigned} คน / ทั้งหมด ${employees.length} คน</span>`;
}

function handleAddEmployee(e) {
    e.preventDefault();
    const id = document.getElementById('emp-id').value.trim();
    const name = document.getElementById('emp-name').value.trim();
    const role = document.getElementById('emp-role').value.trim();
    if (employees.some(emp => emp && emp.id === id)) { showModal('ข้อผิดพลาด', 'รหัสพนักงานนี้มีอยู่ในระบบแล้ว'); return; }
    employees.push({ id, name, role });
    saveData();
    document.getElementById('add-employee-form').reset();
    renderEmployeeTable();
    showModal('สำเร็จ', 'เพิ่มพนักงานเรียบร้อยแล้ว');
}

function deleteEmployee(id) {
    showModal('ยืนยันการลบ', 'คุณต้องการลบพนักงานรายนี้ออกจากระบบใช่หรือไม่?', () => {
        employees = employees.filter(emp => emp && emp.id !== id);
        saveData();
        renderEmployeeTable();
        updateRosterView();
    });
}

function renderEmployeeTable() {
    const tbody = document.getElementById('employee-table-body');
    document.getElementById('emp-count').innerText = employees.length;
    if (!employees || employees.length === 0) { tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">ยังไม่มีข้อมูลพนักงาน</td></tr>`; return; }

    tbody.innerHTML = employees.map((emp, index) => {
        if (!emp) return '';
        const roleStyle = getRoleBadgeStyle(emp.role);
        return `
            <tr class="hover:bg-indigo-950/30 transition-colors">
                <td class="p-3 text-center font-bold text-indigo-300">${index + 1}</td>
                <td class="p-3 font-extrabold ${roleStyle.textClass}">[${emp.id}]</td>
                <td class="p-3 font-bold text-white">${emp.name}</td>
                <td class="p-3 font-semibold"><span class="px-2 py-0.5 rounded-lg border ${roleStyle.badgeClass}">${emp.role}</span></td>
                <td class="p-3 text-center space-x-1">
                    <button onclick="moveEmployee(${index}, -1)" ${index === 0 ? 'disabled class="opacity-30 cursor-not-allowed"' : ''} class="btn-space-3d px-2 py-1 text-xs bg-slate-800 text-indigo-300 rounded font-bold">▲ เลื่อนขึ้น</button>
                    <button onclick="moveEmployee(${index}, 1)" ${index === employees.length - 1 ? 'disabled class="opacity-30 cursor-not-allowed"' : ''} class="btn-space-3d px-2 py-1 text-xs bg-slate-800 text-indigo-300 rounded font-bold">▼ เลื่อนลง</button>
                </td>
                <td class="p-3 text-center">
                    <button onclick="deleteEmployee('${emp.id}')" class="btn-space-3d p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg transition-all border-rose-500/30" title="ลบพนักงาน">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    lucide.createIcons();
}

function handleSaveShift(e) {
    e.preventDefault();
    const code = document.getElementById('shift-code').value.trim().toUpperCase();
    const name = document.getElementById('shift-name').value.trim();
    const start = document.getElementById('shift-start').value;
    const end = document.getElementById('shift-end').value;
    const bg = document.getElementById('shift-bg-color').value;
    const text = document.getElementById('shift-text-color').value;
    const editCode = document.getElementById('shift-edit-code').value;

    if (editCode) {
        const idx = shifts.findIndex(s => s.code === editCode);
        if (idx !== -1) shifts[idx] = { code, name, start, end, bg, text };
    } else {
        if (shifts.some(s => s.code === code)) { showModal('ข้อผิดพลาด', 'รหัสกะเวลานี้มีอยู่ในระบบแล้ว'); return; }
        shifts.push({ code, name, start, end, bg, text });
    }
    saveData();
    resetShiftForm();
    renderShiftModalList();
    showModal('สำเร็จ', 'บันทึกข้อมูลกะเวลาเรียบร้อยแล้ว');
}

function editShift(code) {
    const shift = shifts.find(s => s.code === code);
    if (!shift) return;
    document.getElementById('shift-code').value = shift.code;
    document.getElementById('shift-code').disabled = true;
    document.getElementById('shift-name').value = shift.name;
    document.getElementById('shift-start').value = shift.start;
    document.getElementById('shift-end').value = shift.end;
    document.getElementById('shift-bg-color').value = shift.bg;
    document.getElementById('shift-text-color').value = shift.text;
    document.getElementById('shift-edit-code').value = shift.code;
    document.getElementById('shift-form-title').innerText = 'แก้ไขกะเวลา';
    document.getElementById('shift-submit-btn').innerText = 'อัปเดตกะ';
    document.getElementById('shift-cancel-btn').classList.remove('hidden');
}

function resetShiftForm() {
    document.getElementById('add-shift-form').reset();
    document.getElementById('shift-code').disabled = false;
    document.getElementById('shift-edit-code').value = '';
    document.getElementById('shift-form-title').innerText = 'เพิ่มกะเวลาใหม่';
    document.getElementById('shift-submit-btn').innerText = 'บันทึกกะ';
    document.getElementById('shift-cancel-btn').classList.add('hidden');
}

function deleteShift(code) {
    if (code === 'OFF') { showModal('ไม่สามารถลบได้', 'กะหยุด (OFF) เป็นค่าพื้นฐานของระบบ'); return; }
    showModal('ยืนยันการลบ', 'คุณต้องการลบกะเวลานี้ใช่หรือไม่?', () => {
        shifts = shifts.filter(s => s.code !== code);
        saveData();
        renderShiftModalList();
    });
}

function renderShiftModalList() {
    document.getElementById('shift-count').innerText = shifts.length;
    document.getElementById('shift-modal-list').innerHTML = shifts.map(shift => `
        <div class="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-3d-sm">
            <div>
                <div class="flex items-center space-x-2">
                    <span class="px-2 py-0.5 rounded-lg text-xs font-extrabold shadow-3d-sm border border-white/20" style="background-color: ${shift.bg}; color: ${shift.text};">${shift.code}</span>
                    <span class="text-xs font-bold text-white">${shift.name}</span>
                </div>
                <div class="text-[10px] text-slate-400 font-semibold mt-0.5">${shift.start !== '-' ? shift.start + ' - ' + shift.end : 'วันหยุด'}</div>
            </div>
            <div class="flex items-center space-x-1">
                <button onclick="editShift('${shift.code}')" class="btn-space-3d p-1 text-indigo-400 hover:bg-indigo-950 rounded-lg border-indigo-500/30" title="แก้ไข"><i data-lucide="edit-3" class="w-3.5 h-3.5"></i></button>
                ${shift.code !== 'OFF' ? `<button onclick="deleteShift('${shift.code}')" class="btn-space-3d p-1 text-rose-400 hover:bg-rose-950 rounded-lg border-rose-500/30" title="ลบ"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>` : ''}
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

// Initialize App & Smooth Transitions
window.onload = function() {
    initBackgroundParticles();
    initLegendSwimmingFish();
    displayTodayInfo();
    initRosterSelectors();
    initDailyPicker();
    updateRosterView();
    initRealtimeSync();
    lucide.createIcons();

    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.classList.add('fade-out');
            setTimeout(() => splash.remove(), 600);
        }
    }, 1200);
};
