'use strict';

(function () {

  var data = window.data;
  var pin = window.pin;
  var backend = window.backend;
  var renderPin = pin.render;
  var fragment = document.createDocumentFragment();
  var similarPinList = document.querySelector('.map__pins');
  var form = document.querySelector('.ad-form');
  var fieldsets = document.querySelectorAll('[disabled]:not(option)');
  var address = form.querySelector('#address');

  // Активируем страницу
  var activatePage = function () {

    // Убираем атрибуты disabled, заполняем адрес
    address.value = Math.round((parseInt(mainPin.style.left, 10)) + data.MAIN_PIN.width / 2) + ', ' + (parseInt(mainPin.style.top, 10) + (data.MAIN_PIN.height + data.MAIN_PIN.tip));
    pin.mapItem.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    fieldsets.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });

    // Отрисовываем пины
    var onLoadSuccess = function (ads) {
      data.ads = ads;
      for (var j = 0; j < data.MAX_ADS; j++) {
        if (data.ads[j].offer) {
          var pinItem = renderPin(ads[j], ads);
          pinItem.setAttribute('data-pin-number', j);
          fragment.appendChild(pinItem);
        }
      }
      similarPinList.appendChild(fragment);
    };

    if (data.loadingFlag === false) {
      data.loadingFlag = true;
      backend.load(onLoadSuccess, backend.onLoadError);
    }
  };

  // Перемещение пина
  var mainPin = document.querySelector('.map__pin--main');
  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === data.KeyCodes.ENTER) {
      activatePage();
    }
  });
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      activatePage();

      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      var mapWidth = pin.mapItem.offsetWidth - mainPin.offsetWidth;
      if (newCoords.x > mapWidth) {
        newCoords.x = mapWidth;
      } else if (newCoords.x < 0) {
        newCoords.x = 0;
      }

      if (newCoords.y > data.PIN.max.y - (data.MAIN_PIN.height + data.MAIN_PIN.tip)) {
        newCoords.y = data.PIN.max.y - (data.MAIN_PIN.height + data.MAIN_PIN.tip);
      } else if (newCoords.y < data.PIN.min.y - (data.MAIN_PIN.height + data.MAIN_PIN.tip)) {
        newCoords.y = data.PIN.min.y - (data.MAIN_PIN.height + data.MAIN_PIN.tip);
      }

      mainPin.style.top = newCoords.y + 'px';
      mainPin.style.left = newCoords.x + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  window.map = {
    mainPin: mainPin,
    address: address,
    fieldsets: fieldsets,
    similarPinList: similarPinList,
    fragment: fragment
  };
})();
