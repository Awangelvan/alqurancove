// Ambil data Quran
async function getDataQuran() {
  const response = await fetch("https://api.npoint.io/99c279bb173a6e28359c/data");
  return response.json();
}

// Ambil ayat-ayat dalam sebuah surat berdasarkan ID
async function getDataSurah(id) {
  const response = await fetch(`https://api.npoint.io/99c279bb173a6e28359c/surat/${id}`);
  return response.json();
}

// Ambil detail surat berdasarkan ID
async function getDetailSurah(id) {
  const response = await fetch(`https://api.npoint.io/99c279bb173a6e28359c/data/${id - 1}`);
  return response.json();
}

// Buat tampilan thumbnail untuk daftar surat
function thumbnail(q) {
  return `
    <div class="card">
      <div class="card-header">Surah: ${q.id}</div>
      <div class="card-body">
        <h5 class="card-title">${q.title} | ${q.arabtitle}</h5>
        <p class="card-text">${q.translate} | ${q.ayahsum} ayat | ${q.region}</p>
        <a href="surah.html?id=${q.id}" class="btn btn-success txt-white">Baca</a>
      </div>
    </div>`;
}

// Buat tampilan detail surat
function text(v, q) {
  return `
    <div class="container-surah container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="list-group text-center">
            <h1 class="title bg-success text-white">${v.nama} | ${v.asma}</h1>
            <h2>${v.arti} | ${v.ayat} ayah</h2>
            <hr />
            <div class="ayahs-container mb-2">${q}</div>
          </div>
        </div>
      </div>
    </div>`;
}

// Buat tampilan ayat-ayat Quran
function arabayahs(q) {
  return `
    <h3>${q.ar} {${q.nomor}}</h3>
    <p>Arti: ${q.id}</p>`;
}

// Tampilkan daftar surat di halaman index.html
async function displaySurah() {
  const data = await getDataQuran();
  const dataQuran = data.map((quran) => ({
    id: quran.nomor,
    title: quran.nama,
    arabtitle: quran.asma,
    translate: quran.arti,
    region: quran.type,
    ayahsum: quran.ayat,
  }));

  let card = ``;
  dataQuran.forEach((q) => {
    card += thumbnail(q);
  });
  const container = document.querySelector(".list-surah");
  container.innerHTML = card;
}

// Tampilkan detail surat di halaman surat.html
async function displayDetailSurah() {
  const urlParams = new URLSearchParams(window.location.search);
  const surahID = urlParams.get("id");

  if (!surahID) {
    document.body.innerHTML = "<h1>Surat tidak ditemukan</h1>";
    return;
  }

  const datasurah = await getDataSurah(surahID);
  const finaldata = await getDetailSurah(surahID);

  let surah = ``;
  datasurah.forEach((q) => {
    surah += arabayahs(q);
  });

  const display = document.querySelector(".modal-display");
  display.innerHTML = text(finaldata, surah);
  document.title = `Al-Quran | COVE | ${finaldata.nama}`;
}

// Tentukan halaman mana yang aktif
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".list-surah")) {
    displaySurah();
  } else if (document.querySelector(".modal-display")) {
    displayDetailSurah();
  }
});
