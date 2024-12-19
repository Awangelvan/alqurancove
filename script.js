function getDataQuran() {
  return fetch("https://api.npoint.io/99c279bb173a6e28359c/data")
    .then((response) => response.json())
    .then((response) => response);
}

function thumbnail(q) {
  return `<div class="card">
            <div class="card-header">Surah : ${q.id}</div>
            <div class="card-body">
              <h5 class="card-title">${q.title} | ${q.arabtitle}</h5>
              <p class="card-text">${q.translate} | ${q.ayahsum} ayat | ${q.region}</p>
              <a href='#surahpage' class="modal-button-info btn btn-success txt-white" data-idsurah= ${q.id}>baca</a>
            </div>
          </div>`;
}

//display a surah

function text(v, q) {
  return `
  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  <divclass="container-surah container-fluid">
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

function arabayahs(q) {
  return ` <h3>${q.ar} {${q.nomor}}</h3>
            <br>arti : ${q.id}
  `;
}

function getDataSurah(id) {
  const data = fetch("https://api.npoint.io/99c279bb173a6e28359c/surat/" + id)
    .then((response) => response.json())
    .then((response) => response);
  return data;
}

function getDetailSurah(id) {
  return fetch("https://api.npoint.io/99c279bb173a6e28359c/data/" + (id - 1))
    .then((response) => response.json())
    .then((response) => response);
}

const display = document.querySelector(".modal-display");
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-button-info")) {
    const surahID = e.target.dataset.idsurah;
    const datasurah = await getDataSurah(surahID);
    const finaldata = await getDetailSurah(surahID);
    console.log(finaldata);
    const ayahs = datasurah;
    let surah = ``;
    // loop ayat quran
    ayahs.forEach((q) => {
      surah += arabayahs(q);
    });

    display.innerHTML = text(finaldata, surah);
    // menutup jendela surat
    const btnModalClose = document.querySelector(".btn-close");
    btnModalClose.addEventListener("click", () => {
      display.innerHTML = ``;
    });
  }
});

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

document.addEventListener("DOMContentLoaded", displaySurah());
