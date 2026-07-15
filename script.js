const MENU = [
    {
        kategori: "☕ Coffee",
        items: [
            { id: 1, nama: "Espresso", harga: 12000 },
            { id: 2, nama: "Americano", harga: 15000 },
            { id: 3, nama: "Cappuccino", harga: 18000 },
            { id: 4, nama: "Cafe Latte", harga: 18000 },
            { id: 5, nama: "Mochaccino", harga: 20000 },
            { id: 6, nama: "Caramel Latte", harga: 20000 },
            { id: 7, nama: "Vanilla Latte", harga: 20000 },
            { id: 8, nama: "Kopi Susu Gula Aren", harga: 18000 },
            { id: 9, nama: "V60", harga: 20000 },
            { id: 10, nama: "Vietnam Drip", harga: 16000 }
        ]
    },
    {
        kategori: "🥤 Non Coffee",
        items: [
            { id: 11, nama: "Matcha Latte", harga: 18000 },
            { id: 12, nama: "Chocolate", harga: 18000 },
            { id: 13, nama: "Red Velvet", harga: 18000 },
            { id: 14, nama: "Taro Latte", harga: 18000 },
            { id: 15, nama: "Thai Tea", harga: 15000 },
            { id: 16, nama: "Lemon Tea", harga: 10000 },
            { id: 17, nama: "Es Teh Manis", harga: 5000 }
        ]
    },
    {
        kategori: "🍜 Main Course",
        items: [
            { id: 18, nama: "Nasi Goreng", harga: 20000 },
            { id: 19, nama: "Mie Goreng", harga: 15000 },
            { id: 20, nama: "Mie Rebus", harga: 15000 },
            { id: 21, nama: "Nasi Ayam Geprek", harga: 20000 },
            { id: 22, nama: "Nasi Ayam Crispy", harga: 22000 },
            { id: 23, nama: "Rice Bowl Chicken", harga: 22000 },
            { id: 24, nama: "Rice Bowl Beef", harga: 25000 }
        ]
    },
    {
        kategori: "🍟 Snack",
        items: [
            { id: 25, nama: "Kentang Goreng", harga: 15000 },
            { id: 26, nama: "Chicken Wings", harga: 22000 },
            { id: 27, nama: "Sosis Bakar", harga: 12000 },
            { id: 28, nama: "Cireng", harga: 10000 },
            { id: 29, nama: "Siomay Dimsum", harga: 15000 },
            { id: 30, nama: "Mix Platter", harga: 30000 },
            { id: 31, nama: "Onion Ring", harga: 15000 }
        ]
    }
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

function semuaItem() {
    let hasil = [];
    MENU.forEach(kategori => {
        hasil = hasil.concat(kategori.items);
    });
    return hasil;
}

function renderMenu() {
    const wrap = document.getElementById('menuList');
    wrap.innerHTML = '';
    MENU.forEach(kategori => {
        const judul = document.createElement('div');
        judul.className = 'menu-category-title';
        judul.textContent = kategori.kategori;
        wrap.appendChild(judul);

        kategori.items.forEach(item => {
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
    semuaItem().forEach(item => {
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
    totalRow.className = 'tape-line';
    totalRow.style.fontWeight='700';
    totalRow.innerHTML = `<span>TOTAL</span><span>${formatRupiah(totalBayar)}</span>`;
    body.appendChild(totalRow);
    document.getElementById('totalLabel').textContent = formatRupiah(totalBayar);
}

function hitungBayar() {
    if (orderList.length === 0) return;
    const input = document.getElementById('bayarInput');
    const angkaBersih = input.value.replace(/\./g, '').replace(/,/g, '');
    const uangBayar = parseInt(angkaBersih, 10);
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
    bayarRow.className='tape-line';
    bayarRow.innerHTML = `<span>BAYAR</span><span>${formatRupiah(uangBayar)}</span>`;
    body.appendChild(bayarRow);

    const kembalianRow = document.createElement('div');
    kembalianRow.className='tape-line';
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