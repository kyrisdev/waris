const MENU = [
    { id: 1, nama: "Mie goreng", harga: 15000 },
    { id: 2, nama: "Jus", harga: 10000 },
    { id: 3, nama: "Nasi uduk", harga: 12000 },
    { id: 4, nama: "Nasi goreng", harga: 18000 },
    { id: 5, nama: "Siomay dimsum", harga: 20000 }
];

let qtyState = {};
let orderList = [];
let totalBayar = 0;
let selesai = false;

function formatRupiah(n) {
    return "Rp." + n.toLocaleString('id-ID');
}

function renderJam() {
    const now = new Date();
    document.getElementById('jam').textContent = now.toLocaleTimeString('id-ID');
}
renderJam();
setInterval(renderJam, 1000);

function renderMenu() {
    const wrap = document.getElementById('menuList');
    wrap.innerHTML = '';
    MENU.forEach(item => {
        if (!(item.id in qtyState)) qtyState[item.id] = 0;
        const row = document.createElement('div');
        row.className = 'menu-item';
        row.innerHTML = `
            <div class="menu-info">
                <div class="menu-name">${item.nama}</div>
                <div class="menu-price">${formatRupiah(item.harga)}</div>
            </div>
            <div class="qty-control">
                <button class="qty-btn minus" onclick="ubahQty(${item.id}, -1)">−</button>
                <span class="qty-val" id="qty-${item.id}">${qtyState[item.id]}</span>
                <button class="qty-btn plus" onclick="ubahQty(${item.id}, 1)">+</button>
            </div>
        `;
        wrap.appendChild(row);
    });
}

function ubahQty(id, delta) {
    if (selesai) return;
    const next = (qtyState[id] || 0) + delta;
    qtyState[id] = Math.max(0, next);
    document.getElementById('qty-' + id).textContent = qtyState[id];
}

function tambahKeStruk() {
    if (selesai) return;
    let adaYangDitambah = false;
    MENU.forEach(item => {
        const porsi = qtyState[item.id];
        if (porsi > 0) {
            const subtotal = item.harga * porsi;
            orderList.push({ menu: item.nama, porsi, subtotal });
            totalBayar += subtotal;
            qtyState[item.id] = 0;
            adaYangDitambah = true;
        }
    });
    if (!adaYangDitambah) return;
    renderMenu();
    renderTape();
}

function renderTape() {
    const body = document.getElementById('tapeBody');
    if (orderList.length === 0) {
        body.innerHTML = '<div class="tape-empty">belum ada pesanan...</div>';
        document.getElementById('totalLabel').textContent = formatRupiah(0);
        return;
    }
    body.innerHTML = '';
    orderList.forEach(item => {
        const line = document.createElement('div');
        line.className = 'tape-line';
        line.innerHTML = `<span class="nm">${item.menu} x${item.porsi}</span><span>${formatRupiah(item.subtotal)}</span>`;
        body.appendChild(line);
    });
    const totalRow = document.createElement('div');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `<span>TOTAL</span><span>${formatRupiah(totalBayar)}</span>`;
    body.appendChild(totalRow);
    document.getElementById('totalLabel').textContent = formatRupiah(totalBayar);
}

function hitungBayar() {
    if (orderList.length === 0) return;
    const input = document.getElementById('bayarInput');
    const uangBayar = parseInt(input.value, 10);
    const warn = document.getElementById('warnText');

    if (isNaN(uangBayar)) {
        warn.textContent = 'masukkan nominal uang yang valid';
        warn.classList.add('show');
        return;
    }
    if (uangBayar < totalBayar) {
        const kurang = totalBayar - uangBayar;
        warn.textContent = `uang kurang, kurang ${formatRupiah(kurang)}`;
        warn.classList.add('show');
        return;
    }
    warn.classList.remove('show');

    const kembalian = uangBayar - totalBayar;
    const nama = document.getElementById('namaPembeli').value || '-';
    const meja = document.getElementById('nomorMeja').value || '-';

    const body = document.getElementById('tapeBody');
    const info = document.createElement('div');
    info.className = 'tape-line';
    info.style.flexDirection = 'column';
    info.innerHTML = `<span>nama : ${nama}</span><span>meja : ${meja}</span>`;
    body.insertBefore(info, body.firstChild);

    const hr = document.createElement('hr');
    hr.className = 'dash';
    body.appendChild(hr);

    const bayarRow = document.createElement('div');
    bayarRow.className = 'sub-row';
    bayarRow.innerHTML = `<span>BAYAR</span><span>${formatRupiah(uangBayar)}</span>`;
    body.appendChild(bayarRow);

    const kembalianRow = document.createElement('div');
    kembalianRow.className = 'sub-row';
    kembalianRow.style.fontWeight = '700';
    kembalianRow.style.color = 'var(--ink)';
    kembalianRow.innerHTML = `<span>KEMBALIAN</span><span>${formatRupiah(kembalian)}</span>`;
    body.appendChild(kembalianRow);

    selesai = true;
    document.getElementById('tambahBtn').disabled = true;
    document.getElementById('hitungBtn').style.display = 'none';
    input.disabled = true;
    document.getElementById('resetBtn').classList.add('show');
}

function resetTransaksi() {
    qtyState = {};
    orderList = [];
    totalBayar = 0;
    selesai = false;
    document.getElementById('bayarInput').value = '';
    document.getElementById('bayarInput').disabled = false;
    document.getElementById('warnText').classList.remove('show');
    document.getElementById('tambahBtn').disabled = false;
    document.getElementById('hitungBtn').style.display = 'block';
    document.getElementById('resetBtn').classList.remove('show');
    renderMenu();
    renderTape();
}

renderMenu();
renderTape();
