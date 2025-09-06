document.addEventListener('DOMContentLoaded', function() {
  var ADS = window.sampleAds || [];
  var TBODY = document.getElementById('ads-tbody');

  var DETAIL_OVERLAY = document.getElementById('detail-overlay');
  var DETAIL_BODY = document.getElementById('detail-body');
  var CLOSE_DETAIL_BTN = document.getElementById('close-detail-btn');

  var PHOTO_MODAL = document.getElementById('photo-modal');
  var PHOTO_BIG = document.getElementById('photo-big');
  var CLOSE_PHOTO_BTN = document.getElementById('close-photo-btn');

  for (var i = 0; i < ADS.length; i++) {
    var ad = ADS[i];
    var tr = document.createElement('tr');
    tr.setAttribute('data-index', i);

    var values = [
      ad.fecha_publicacion || '-',
      ad.fecha_entrega || '-',
      ad.comuna || '-',
      ad.sector || '-',
      (ad.cantidad != null) ? String(ad.cantidad) : '-',
      ad.tipo || '-',
      ad.edad || '-',
      ad.nombre || '-',
      ad.contacto || '-',
      (Array.isArray(ad.fotos) ? String(ad.fotos.length) : String(ad.total_fotos || 0))
    ];

    for (var c = 0; c < values.length; c++) {
      var td = document.createElement('td');
      td.innerText = values[c];
      tr.appendChild(td);
    }

    tr.addEventListener('click', function() {
      var idx = this.getAttribute('data-index');
      showDetail(parseInt(idx, 10));
    });

    TBODY.appendChild(tr);
  }

  function showDetail(index) {
    var ad = ADS[index];
    if (!ad) return;
    DETAIL_BODY.innerHTML = '';

    var campos = [
      ['ID', ad.id || '-'],
      ['Fecha publicación', ad.fecha_publicacion || '-'],
      ['Fecha entrega', ad.fecha_entrega || '-'],
      ['Comuna', ad.comuna || '-'],
      ['Sector', ad.sector || '-'],
      ['Cantidad', (ad.cantidad != null) ? ad.cantidad : '-'],
      ['Tipo', ad.tipo || '-'],
      ['Edad', ad.edad || '-'],
      ['Nombre', ad.nombre || '-'],
      ['Contacto', ad.contacto || '-'],
      ['Total fotos', Array.isArray(ad.fotos) ? ad.fotos.length : (ad.total_fotos || 0)],
      ['Descripción', ad.descripcion || '-']
    ];

    for (var k = 0; k < campos.length; k++) {
      var fila = document.createElement('div');
      fila.className = 'detail-row';

      var label = document.createElement('div');
      label.className = 'label';
      label.innerText = campos[k][0];

      var valor = document.createElement('div');
      valor.className = 'value';
      valor.innerText = String(campos[k][1]);

      fila.appendChild(label);
      fila.appendChild(valor);
      DETAIL_BODY.appendChild(fila);
    }

    var fotosCont = document.createElement('div');
    fotosCont.className = 'detail-photos';

    if (Array.isArray(ad.fotos) && ad.fotos.length > 0) {
      for (var f = 0; f < ad.fotos.length; f++) {
        var img = document.createElement('img');
        img.src = ad.fotos[f];
        img.alt = (ad.nombre ? ad.nombre + ' foto ' + (f+1) : 'foto ' + (f+1));

        img.addEventListener('click', function(evt) {
          evt.stopPropagation();
          PHOTO_BIG.src = this.src;
          PHOTO_MODAL.style.display = 'flex';
        });

        fotosCont.appendChild(img);
      }
    } else {
      var p = document.createElement('p');
      p.innerText = 'Sin fotos';
      fotosCont.appendChild(p);
    }

    DETAIL_BODY.appendChild(fotosCont);

    DETAIL_OVERLAY.style.display = 'flex';
  }

  function closeDetail() {
    DETAIL_OVERLAY.style.display = 'none';
    DETAIL_BODY.innerHTML = '';
  }

  function closePhoto() {
    PHOTO_BIG.src = '';
    PHOTO_MODAL.style.display = 'none';
  }

  if (CLOSE_DETAIL_BTN) CLOSE_DETAIL_BTN.addEventListener('click', closeDetail);
  DETAIL_OVERLAY.addEventListener('click', function(e) {
    if (e.target === DETAIL_OVERLAY) closeDetail();
  });

  if (CLOSE_PHOTO_BTN) CLOSE_PHOTO_BTN.addEventListener('click', closePhoto);
  PHOTO_MODAL.addEventListener('click', function(e) {
    if (e.target === PHOTO_MODAL) closePhoto();
  });
});
