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
    <div class="card mb-3" data-namasurah="${q.title.toLowerCase()}">
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
            <div class="ayahs-container">${q}</div>
          </div>
        </div>
      </div>
    </div>`;
}

// Buat tampilan ayat-ayat Quran
function arabayahs(q) {
  return `<div class="card card-ayat">
            <div class="card-body d-flex-column">
              <h5 class="card-title d-flex justify-content-end">{${q.nomor}} ${q.ar}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${q.tr}</h6>
              <p class="card-text">${q.id}</p>
            </div>
          </div>`;
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

// mencari dan menampilkan surah dengan menggunakan kotak input

const btnSearch = document.getElementById("tombol");
btnSearch.addEventListener("click", async function () {
  //variabel input
  const inputKeyword = document.querySelector(".input-keyword").value;
  const inputKeywordLower = String(inputKeyword).toLowerCase();
  // variabel data
  const listDaftarSurah = await getDataQuran();
  const daftarSurah = listDaftarSurah.map((data) => data.nama.toLowerCase());
  const filteredSurahs = daftarSurah.filter((item) => item.includes(inputKeywordLower));
  // //variabel element target surah yang dicari
  const container = document.querySelector(".search-result-container");
  if (filteredSurahs == inputKeywordLower) {
    scrollpage(inputKeywordLower);
  } else if (filteredSurahs.length > 0) {
    let count = 0;
    const arraySurah = [];
    const batas = filteredSurahs.length;
    for (let i = 0; i < batas; i++) {
      const surah = filteredSurahs[count];
      arraySurah.push(surah);
      count += 1;
    }

    container.innerHTML = "<h2>hasil yang kami temukan : </h2>";
    arraySurah.forEach((surah) => {
      const template = `
        <div class="col-6 mb-1">
        <div class="card card-body">
          <a onclick="scrollpage('${surah}')" class="btn btn-success txt-white">${surah}</a><br>
        </div>
        </div> `;
      container.innerHTML += template;
    });
  } else {
    container.innerHTML = "<h1>surat Tidak ditemukan</h1>";
  }
});

function scrollpage(v) {
  const targetElement = document.querySelector(`[data-namasurah="${v}"]`);
  targetElement.scrollIntoView({ behavior: "smooth" });
  targetElement.style.border = "solid green 5px";
}
