
// Флип-окно

$("#flip").on("click", function() {
  $(".flip-container").toggleClass("flip");

  $(".autorized-login__link").toggleClass("hide");

});

// Активное меню

$('#toggle').click(function() {
  $(this).toggleClass('active');
  $('#overlay').toggleClass('open');

  console.log("works!")
});

// Слайдер

// Анимация текста

var aviatitle = {
  generate : function (string, block) {
    var
        wordsArray = string.split(' '), // найти массив слов
        stringArray = string.split(''), // найти массив всех симовлов в строке
        sentence = [],
        word = '';

    block.text(''); // очищаем блок вывода

    wordsArray.forEach(function(currentWord) {
      var wordsArray = currentWord.split(''); // массив символов в слове

      wordsArray.forEach(function(letter) {
        var letterHtml = '<span class="letter-span">' + letter + '</span>';
        // каждую букву оборачиваем в свой span
        word += letterHtml;
      });
      // берем отдельное слово и оборачиваем его в класс
      var wordHTML = '<span class="letter-word">' + word + '</span>'
      // добавим в массив предложения
      sentence.push(wordHTML);
      word = '';
    });
    // добавим в блок сгенерированую разметку для предложения
    block.append(sentence.join(' '));

    // анимация появления
    var
        letters = block.find('.letter-span'), // найдем все наши буквы
        counter = 0,
        timer,
        duration = 500 / stringArray.length; // находим длительность для каждой буквы

    function showLetters() {
      var currentLetter = letters.eq(counter);

      currentLetter.addClass('active');
      counter++;

      if (typeof timer !== 'undefined') {
        clearTimeout(timer);
      }

      timer = setTimeout(showLetters, duration);
    }

    showLetters();

  }
};

// Сам слайдер

var Slider = function(container) {
  var
      nextBtn     = container.find('.works-slider__control-btn_left'),
      prevBtn     = container.find('.works-slider__control-btn_right'),
      items       = nextBtn.find('.works-slider__control-item'),
      display     = container.find('.works-slider__display'), // Витрина слайдера
      title       = container.find('.subtitle'),
      skills      = container.find('.works__content-desc'),
      link        = container.find('.works__content-view'),
      itemsLength = items.length,
      duration    = 500,
      flag        = true;

  var timeout;

  this.counter = 0;

  // private
  // Генерация разметки кнопки следующий слайд
  var generateMarkups = function() {
    var list = nextBtn.find('.works-slider__control-list'),
        markups = list.clone();

    prevBtn
        .append(markups)
        .find('.works-slider__control-item')
        .removeClass('active')
        .eq(this.counter + 1)
        .addClass('active');
  }
  // Вытащить данные из дата атрибутов для левой части слайдера
  var getDataArrays = function() {
    var dataObject = {
      pics : [],
      title : [],
      skills : [],
      link : []
    };

    $.each(items, function() {
      var $this = $(this);

      dataObject.pics.push($this.data('full'));
      dataObject.title.push($this.data('title'));
      dataObject.skills.push($this.data('skills'));
      dataObject.link.push($this.data('link'));
    });

    return dataObject;
  }

  var slideInLeftBtn = function(slide) {
    var
        reqItem = items.eq(slide - 1),
        activeItem = items.filter('.active');

    activeItem
        .stop(true, true)
        .animate({'top' : '120%'}, duration);

    reqItem
        .stop(true, true)
        .animate({'top' : '0%'}, duration, function () {
          $(this).addClass('active')
              .siblings().removeClass('active')
              .css('top', '-120%')
        });


  }

  var slideInRightBtn = function (slide) {
    var
        items = prevBtn.find('.works-slider__control-item'),
        activeItem = items.filter('.active'),
        reqSlide = slide + 1;

    if (reqSlide > itemsLength - 1) {
      reqSlide = 0;
    }

    var reqItem = items.eq(reqSlide);

    activeItem
        .stop(true, true)
        .animate({'top' : '-110%'}, duration);

    reqItem
        .stop(true, true)
        .animate({'top' : '0%'}, duration, function () {
          $(this).addClass('active')
              .siblings().removeClass('active')
              .css('top', '110%')
        });
  };

  var changeMainPicture = function(slide) {
    var image = display.find('.works-slider__display-pic');
    var data = getDataArrays();

    image
        .stop(true, true)
        .fadeOut(duration / 2, function() {
          image.attr('src', data.pics[slide]);
          $(this).fadeIn(duration / 2);
        });
  }

  var changeTextData = function(slide) {
    var data = getDataArrays();

    // название работы
    aviatitle.generate(data.title[slide], title, 'ru');

    // описание технологий
    aviatitle.generate(data.skills[slide], skills, 'en');

    // ссылка
    link.attr('href', data.link[slide]);
  }

  // public
  this.setDefaults = function() {
    var
        _that = this,
        data = getDataArrays();

    // создаем разметку
    generateMarkups();

    // левая кнопка
    nextBtn
        .find('.works-slider__control-item')
        .eq(_that.counter - 1)
        .addClass('active');

    // правая кнопка
    prevBtn
        .find('.works-slider__control-item')
        .eq(_that.counter + 1)
        .addClass('active');

    // основное изображение
    display
        .find('.works-slider__display-pic')
        .attr('src', data.pics[_that.counter]);

    // текстовые описания
    changeTextData(_that.counter);

  };

  this.moveSlide = function(direction) {
    var _that = this;
    // if (direction === "next") {
    //     if (_that.counter < itemsLength - 1) {
    //             _that.counter++;
    //         } else {
    //             _that.counter = 0;
    //         }
    // } else {
    //          if (_that.counter > 0) {
    //             _that.counter--;
    //         } else {
    //             _that.counter = itemsLength - 1;
    //         }
    // }

    var directions = {
      next : function() {
        // закольцовывание слайдера
        if (_that.counter < itemsLength - 1) {
          _that.counter++;
        } else {
          _that.counter = 0;
        }
      },

      prev : function () {
        if (_that.counter > 0) {
          _that.counter--;
        } else {
          _that.counter = itemsLength - 1;
        }
      }
    };

    directions[direction]();

    if (flag) {
      flag = false;

      if (typeof timeout != 'undefined') {
        clearTimeout(timeout);
      }

      timeout = setTimeout(function () {
        flag = true;
      }, duration + 50);

      slideInLeftBtn(_that.counter);
      slideInRightBtn(_that.counter);
      changeMainPicture(_that.counter);
      changeTextData(_that.counter);
    }
  };
};




var slider = new Slider($('.works'));
slider.setDefaults();

$('.works-slider__control-btn_left').on('click', function(e){
  e.preventDefault();
  slider.moveSlide('prev');
});

$('.works-slider__control-btn_right').on('click', function(e){
  e.preventDefault();
  slider.moveSlide('next');
});

console.dir(slider);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vLyDQpNC70LjQvy3QvtC60L3QvlxyXG5cclxuJChcIiNmbGlwXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgJChcIi5mbGlwLWNvbnRhaW5lclwiKS50b2dnbGVDbGFzcyhcImZsaXBcIik7XHJcblxyXG4gICQoXCIuYXV0b3JpemVkLWxvZ2luX19saW5rXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZVwiKTtcclxuXHJcbn0pO1xyXG5cclxuLy8g0JDQutGC0LjQstC90L7QtSDQvNC10L3RjlxyXG5cclxuJCgnI3RvZ2dsZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICQoJyNvdmVybGF5JykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgY29uc29sZS5sb2coXCJ3b3JrcyFcIilcclxufSk7XHJcblxyXG4vLyDQodC70LDQudC00LXRgFxyXG5cclxuLy8g0JDQvdC40LzQsNGG0LjRjyDRgtC10LrRgdGC0LBcclxuXHJcbnZhciBhdmlhdGl0bGUgPSB7XHJcbiAgZ2VuZXJhdGUgOiBmdW5jdGlvbiAoc3RyaW5nLCBibG9jaykge1xyXG4gICAgdmFyXHJcbiAgICAgICAgd29yZHNBcnJheSA9IHN0cmluZy5zcGxpdCgnICcpLCAvLyDQvdCw0LnRgtC4INC80LDRgdGB0LjQsiDRgdC70L7QslxyXG4gICAgICAgIHN0cmluZ0FycmF5ID0gc3RyaW5nLnNwbGl0KCcnKSwgLy8g0L3QsNC50YLQuCDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YHQuNC80L7QstC70L7QsiDQsiDRgdGC0YDQvtC60LVcclxuICAgICAgICBzZW50ZW5jZSA9IFtdLFxyXG4gICAgICAgIHdvcmQgPSAnJztcclxuXHJcbiAgICBibG9jay50ZXh0KCcnKTsgLy8g0L7Rh9C40YnQsNC10Lwg0LHQu9C+0Log0LLRi9Cy0L7QtNCwXHJcblxyXG4gICAgd29yZHNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGN1cnJlbnRXb3JkKSB7XHJcbiAgICAgIHZhciB3b3Jkc0FycmF5ID0gY3VycmVudFdvcmQuc3BsaXQoJycpOyAvLyDQvNCw0YHRgdC40LIg0YHQuNC80LLQvtC70L7QsiDQsiDRgdC70L7QstC1XHJcblxyXG4gICAgICB3b3Jkc0FycmF5LmZvckVhY2goZnVuY3Rpb24obGV0dGVyKSB7XHJcbiAgICAgICAgdmFyIGxldHRlckh0bWwgPSAnPHNwYW4gY2xhc3M9XCJsZXR0ZXItc3BhblwiPicgKyBsZXR0ZXIgKyAnPC9zcGFuPic7XHJcbiAgICAgICAgLy8g0LrQsNC20LTRg9GOINCx0YPQutCy0YMg0L7QsdC+0YDQsNGH0LjQstCw0LXQvCDQsiDRgdCy0L7QuSBzcGFuXHJcbiAgICAgICAgd29yZCArPSBsZXR0ZXJIdG1sO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8g0LHQtdGA0LXQvCDQvtGC0LTQtdC70YzQvdC+0LUg0YHQu9C+0LLQviDQuCDQvtCx0L7RgNCw0YfQuNCy0LDQtdC8INC10LPQviDQsiDQutC70LDRgdGBXHJcbiAgICAgIHZhciB3b3JkSFRNTCA9ICc8c3BhbiBjbGFzcz1cImxldHRlci13b3JkXCI+JyArIHdvcmQgKyAnPC9zcGFuPidcclxuICAgICAgLy8g0LTQvtCx0LDQstC40Lwg0LIg0LzQsNGB0YHQuNCyINC/0YDQtdC00LvQvtC20LXQvdC40Y9cclxuICAgICAgc2VudGVuY2UucHVzaCh3b3JkSFRNTCk7XHJcbiAgICAgIHdvcmQgPSAnJztcclxuICAgIH0pO1xyXG4gICAgLy8g0LTQvtCx0LDQstC40Lwg0LIg0LHQu9C+0Log0YHQs9C10L3QtdGA0LjRgNC+0LLQsNC90YPRjiDRgNCw0LfQvNC10YLQutGDINC00LvRjyDQv9GA0LXQtNC70L7QttC10L3QuNGPXHJcbiAgICBibG9jay5hcHBlbmQoc2VudGVuY2Uuam9pbignICcpKTtcclxuXHJcbiAgICAvLyDQsNC90LjQvNCw0YbQuNGPINC/0L7Rj9Cy0LvQtdC90LjRj1xyXG4gICAgdmFyXHJcbiAgICAgICAgbGV0dGVycyA9IGJsb2NrLmZpbmQoJy5sZXR0ZXItc3BhbicpLCAvLyDQvdCw0LnQtNC10Lwg0LLRgdC1INC90LDRiNC4INCx0YPQutCy0YtcclxuICAgICAgICBjb3VudGVyID0gMCxcclxuICAgICAgICB0aW1lcixcclxuICAgICAgICBkdXJhdGlvbiA9IDUwMCAvIHN0cmluZ0FycmF5Lmxlbmd0aDsgLy8g0L3QsNGF0L7QtNC40Lwg0LTQu9C40YLQtdC70YzQvdC+0YHRgtGMINC00LvRjyDQutCw0LbQtNC+0Lkg0LHRg9C60LLRi1xyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dMZXR0ZXJzKCkge1xyXG4gICAgICB2YXIgY3VycmVudExldHRlciA9IGxldHRlcnMuZXEoY291bnRlcik7XHJcblxyXG4gICAgICBjdXJyZW50TGV0dGVyLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgY291bnRlcisrO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0aW1lciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aW1lciA9IHNldFRpbWVvdXQoc2hvd0xldHRlcnMsIGR1cmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93TGV0dGVycygpO1xyXG5cclxuICB9XHJcbn07XHJcblxyXG4vLyDQodCw0Lwg0YHQu9Cw0LnQtNC10YBcclxuXHJcbnZhciBTbGlkZXIgPSBmdW5jdGlvbihjb250YWluZXIpIHtcclxuICB2YXJcclxuICAgICAgbmV4dEJ0biAgICAgPSBjb250YWluZXIuZmluZCgnLndvcmtzLXNsaWRlcl9fY29udHJvbC1idG5fbGVmdCcpLFxyXG4gICAgICBwcmV2QnRuICAgICA9IGNvbnRhaW5lci5maW5kKCcud29ya3Mtc2xpZGVyX19jb250cm9sLWJ0bl9yaWdodCcpLFxyXG4gICAgICBpdGVtcyAgICAgICA9IG5leHRCdG4uZmluZCgnLndvcmtzLXNsaWRlcl9fY29udHJvbC1pdGVtJyksXHJcbiAgICAgIGRpc3BsYXkgICAgID0gY29udGFpbmVyLmZpbmQoJy53b3Jrcy1zbGlkZXJfX2Rpc3BsYXknKSwgLy8g0JLQuNGC0YDQuNC90LAg0YHQu9Cw0LnQtNC10YDQsFxyXG4gICAgICB0aXRsZSAgICAgICA9IGNvbnRhaW5lci5maW5kKCcuc3VidGl0bGUnKSxcclxuICAgICAgc2tpbGxzICAgICAgPSBjb250YWluZXIuZmluZCgnLndvcmtzX19jb250ZW50LWRlc2MnKSxcclxuICAgICAgbGluayAgICAgICAgPSBjb250YWluZXIuZmluZCgnLndvcmtzX19jb250ZW50LXZpZXcnKSxcclxuICAgICAgaXRlbXNMZW5ndGggPSBpdGVtcy5sZW5ndGgsXHJcbiAgICAgIGR1cmF0aW9uICAgID0gNTAwLFxyXG4gICAgICBmbGFnICAgICAgICA9IHRydWU7XHJcblxyXG4gIHZhciB0aW1lb3V0O1xyXG5cclxuICB0aGlzLmNvdW50ZXIgPSAwO1xyXG5cclxuICAvLyBwcml2YXRlXHJcbiAgLy8g0JPQtdC90LXRgNCw0YbQuNGPINGA0LDQt9C80LXRgtC60Lgg0LrQvdC+0L/QutC4INGB0LvQtdC00YPRjtGJ0LjQuSDRgdC70LDQudC0XHJcbiAgdmFyIGdlbmVyYXRlTWFya3VwcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGxpc3QgPSBuZXh0QnRuLmZpbmQoJy53b3Jrcy1zbGlkZXJfX2NvbnRyb2wtbGlzdCcpLFxyXG4gICAgICAgIG1hcmt1cHMgPSBsaXN0LmNsb25lKCk7XHJcblxyXG4gICAgcHJldkJ0blxyXG4gICAgICAgIC5hcHBlbmQobWFya3VwcylcclxuICAgICAgICAuZmluZCgnLndvcmtzLXNsaWRlcl9fY29udHJvbC1pdGVtJylcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgLmVxKHRoaXMuY291bnRlciArIDEpXHJcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcbiAgLy8g0JLRi9GC0LDRidC40YLRjCDQtNCw0L3QvdGL0LUg0LjQtyDQtNCw0YLQsCDQsNGC0YDQuNCx0YPRgtC+0LIg0LTQu9GPINC70LXQstC+0Lkg0YfQsNGB0YLQuCDRgdC70LDQudC00LXRgNCwXHJcbiAgdmFyIGdldERhdGFBcnJheXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBkYXRhT2JqZWN0ID0ge1xyXG4gICAgICBwaWNzIDogW10sXHJcbiAgICAgIHRpdGxlIDogW10sXHJcbiAgICAgIHNraWxscyA6IFtdLFxyXG4gICAgICBsaW5rIDogW11cclxuICAgIH07XHJcblxyXG4gICAgJC5lYWNoKGl0ZW1zLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgIGRhdGFPYmplY3QucGljcy5wdXNoKCR0aGlzLmRhdGEoJ2Z1bGwnKSk7XHJcbiAgICAgIGRhdGFPYmplY3QudGl0bGUucHVzaCgkdGhpcy5kYXRhKCd0aXRsZScpKTtcclxuICAgICAgZGF0YU9iamVjdC5za2lsbHMucHVzaCgkdGhpcy5kYXRhKCdza2lsbHMnKSk7XHJcbiAgICAgIGRhdGFPYmplY3QubGluay5wdXNoKCR0aGlzLmRhdGEoJ2xpbmsnKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YU9iamVjdDtcclxuICB9XHJcblxyXG4gIHZhciBzbGlkZUluTGVmdEJ0biA9IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICB2YXJcclxuICAgICAgICByZXFJdGVtID0gaXRlbXMuZXEoc2xpZGUgLSAxKSxcclxuICAgICAgICBhY3RpdmVJdGVtID0gaXRlbXMuZmlsdGVyKCcuYWN0aXZlJyk7XHJcblxyXG4gICAgYWN0aXZlSXRlbVxyXG4gICAgICAgIC5zdG9wKHRydWUsIHRydWUpXHJcbiAgICAgICAgLmFuaW1hdGUoeyd0b3AnIDogJzEyMCUnfSwgZHVyYXRpb24pO1xyXG5cclxuICAgIHJlcUl0ZW1cclxuICAgICAgICAuc3RvcCh0cnVlLCB0cnVlKVxyXG4gICAgICAgIC5hbmltYXRlKHsndG9wJyA6ICcwJSd9LCBkdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAgICAgICAuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAgICAgICAuY3NzKCd0b3AnLCAnLTEyMCUnKVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICB2YXIgc2xpZGVJblJpZ2h0QnRuID0gZnVuY3Rpb24gKHNsaWRlKSB7XHJcbiAgICB2YXJcclxuICAgICAgICBpdGVtcyA9IHByZXZCdG4uZmluZCgnLndvcmtzLXNsaWRlcl9fY29udHJvbC1pdGVtJyksXHJcbiAgICAgICAgYWN0aXZlSXRlbSA9IGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpLFxyXG4gICAgICAgIHJlcVNsaWRlID0gc2xpZGUgKyAxO1xyXG5cclxuICAgIGlmIChyZXFTbGlkZSA+IGl0ZW1zTGVuZ3RoIC0gMSkge1xyXG4gICAgICByZXFTbGlkZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlcUl0ZW0gPSBpdGVtcy5lcShyZXFTbGlkZSk7XHJcblxyXG4gICAgYWN0aXZlSXRlbVxyXG4gICAgICAgIC5zdG9wKHRydWUsIHRydWUpXHJcbiAgICAgICAgLmFuaW1hdGUoeyd0b3AnIDogJy0xMTAlJ30sIGR1cmF0aW9uKTtcclxuXHJcbiAgICByZXFJdGVtXHJcbiAgICAgICAgLnN0b3AodHJ1ZSwgdHJ1ZSlcclxuICAgICAgICAuYW5pbWF0ZSh7J3RvcCcgOiAnMCUnfSwgZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgLmNzcygndG9wJywgJzExMCUnKVxyXG4gICAgICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHZhciBjaGFuZ2VNYWluUGljdHVyZSA9IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICB2YXIgaW1hZ2UgPSBkaXNwbGF5LmZpbmQoJy53b3Jrcy1zbGlkZXJfX2Rpc3BsYXktcGljJyk7XHJcbiAgICB2YXIgZGF0YSA9IGdldERhdGFBcnJheXMoKTtcclxuXHJcbiAgICBpbWFnZVxyXG4gICAgICAgIC5zdG9wKHRydWUsIHRydWUpXHJcbiAgICAgICAgLmZhZGVPdXQoZHVyYXRpb24gLyAyLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGltYWdlLmF0dHIoJ3NyYycsIGRhdGEucGljc1tzbGlkZV0pO1xyXG4gICAgICAgICAgJCh0aGlzKS5mYWRlSW4oZHVyYXRpb24gLyAyKTtcclxuICAgICAgICB9KTtcclxuICB9XHJcblxyXG4gIHZhciBjaGFuZ2VUZXh0RGF0YSA9IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICB2YXIgZGF0YSA9IGdldERhdGFBcnJheXMoKTtcclxuXHJcbiAgICAvLyDQvdCw0LfQstCw0L3QuNC1INGA0LDQsdC+0YLRi1xyXG4gICAgYXZpYXRpdGxlLmdlbmVyYXRlKGRhdGEudGl0bGVbc2xpZGVdLCB0aXRsZSwgJ3J1Jyk7XHJcblxyXG4gICAgLy8g0L7Qv9C40YHQsNC90LjQtSDRgtC10YXQvdC+0LvQvtCz0LjQuVxyXG4gICAgYXZpYXRpdGxlLmdlbmVyYXRlKGRhdGEuc2tpbGxzW3NsaWRlXSwgc2tpbGxzLCAnZW4nKTtcclxuXHJcbiAgICAvLyDRgdGB0YvQu9C60LBcclxuICAgIGxpbmsuYXR0cignaHJlZicsIGRhdGEubGlua1tzbGlkZV0pO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljXHJcbiAgdGhpcy5zZXREZWZhdWx0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyXHJcbiAgICAgICAgX3RoYXQgPSB0aGlzLFxyXG4gICAgICAgIGRhdGEgPSBnZXREYXRhQXJyYXlzKCk7XHJcblxyXG4gICAgLy8g0YHQvtC30LTQsNC10Lwg0YDQsNC30LzQtdGC0LrRg1xyXG4gICAgZ2VuZXJhdGVNYXJrdXBzKCk7XHJcblxyXG4gICAgLy8g0LvQtdCy0LDRjyDQutC90L7Qv9C60LBcclxuICAgIG5leHRCdG5cclxuICAgICAgICAuZmluZCgnLndvcmtzLXNsaWRlcl9fY29udHJvbC1pdGVtJylcclxuICAgICAgICAuZXEoX3RoYXQuY291bnRlciAtIDEpXHJcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAvLyDQv9GA0LDQstCw0Y8g0LrQvdC+0L/QutCwXHJcbiAgICBwcmV2QnRuXHJcbiAgICAgICAgLmZpbmQoJy53b3Jrcy1zbGlkZXJfX2NvbnRyb2wtaXRlbScpXHJcbiAgICAgICAgLmVxKF90aGF0LmNvdW50ZXIgKyAxKVxyXG4gICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgLy8g0L7RgdC90L7QstC90L7QtSDQuNC30L7QsdGA0LDQttC10L3QuNC1XHJcbiAgICBkaXNwbGF5XHJcbiAgICAgICAgLmZpbmQoJy53b3Jrcy1zbGlkZXJfX2Rpc3BsYXktcGljJylcclxuICAgICAgICAuYXR0cignc3JjJywgZGF0YS5waWNzW190aGF0LmNvdW50ZXJdKTtcclxuXHJcbiAgICAvLyDRgtC10LrRgdGC0L7QstGL0LUg0L7Qv9C40YHQsNC90LjRj1xyXG4gICAgY2hhbmdlVGV4dERhdGEoX3RoYXQuY291bnRlcik7XHJcblxyXG4gIH07XHJcblxyXG4gIHRoaXMubW92ZVNsaWRlID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XHJcbiAgICB2YXIgX3RoYXQgPSB0aGlzO1xyXG4gICAgLy8gaWYgKGRpcmVjdGlvbiA9PT0gXCJuZXh0XCIpIHtcclxuICAgIC8vICAgICBpZiAoX3RoYXQuY291bnRlciA8IGl0ZW1zTGVuZ3RoIC0gMSkge1xyXG4gICAgLy8gICAgICAgICAgICAgX3RoYXQuY291bnRlcisrO1xyXG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgX3RoYXQuY291bnRlciA9IDA7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICBpZiAoX3RoYXQuY291bnRlciA+IDApIHtcclxuICAgIC8vICAgICAgICAgICAgIF90aGF0LmNvdW50ZXItLTtcclxuICAgIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgIF90aGF0LmNvdW50ZXIgPSBpdGVtc0xlbmd0aCAtIDE7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICB2YXIgZGlyZWN0aW9ucyA9IHtcclxuICAgICAgbmV4dCA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vINC30LDQutC+0LvRjNGG0L7QstGL0LLQsNC90LjQtSDRgdC70LDQudC00LXRgNCwXHJcbiAgICAgICAgaWYgKF90aGF0LmNvdW50ZXIgPCBpdGVtc0xlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIF90aGF0LmNvdW50ZXIrKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgX3RoYXQuY291bnRlciA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJldiA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoX3RoYXQuY291bnRlciA+IDApIHtcclxuICAgICAgICAgIF90aGF0LmNvdW50ZXItLTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgX3RoYXQuY291bnRlciA9IGl0ZW1zTGVuZ3RoIC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZGlyZWN0aW9uc1tkaXJlY3Rpb25dKCk7XHJcblxyXG4gICAgaWYgKGZsYWcpIHtcclxuICAgICAgZmxhZyA9IGZhbHNlO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0aW1lb3V0ICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZmxhZyA9IHRydWU7XHJcbiAgICAgIH0sIGR1cmF0aW9uICsgNTApO1xyXG5cclxuICAgICAgc2xpZGVJbkxlZnRCdG4oX3RoYXQuY291bnRlcik7XHJcbiAgICAgIHNsaWRlSW5SaWdodEJ0bihfdGhhdC5jb3VudGVyKTtcclxuICAgICAgY2hhbmdlTWFpblBpY3R1cmUoX3RoYXQuY291bnRlcik7XHJcbiAgICAgIGNoYW5nZVRleHREYXRhKF90aGF0LmNvdW50ZXIpO1xyXG4gICAgfVxyXG4gIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG52YXIgc2xpZGVyID0gbmV3IFNsaWRlcigkKCcud29ya3MnKSk7XHJcbnNsaWRlci5zZXREZWZhdWx0cygpO1xyXG5cclxuJCgnLndvcmtzLXNsaWRlcl9fY29udHJvbC1idG5fbGVmdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICBzbGlkZXIubW92ZVNsaWRlKCdwcmV2Jyk7XHJcbn0pO1xyXG5cclxuJCgnLndvcmtzLXNsaWRlcl9fY29udHJvbC1idG5fcmlnaHQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgc2xpZGVyLm1vdmVTbGlkZSgnbmV4dCcpO1xyXG59KTtcclxuXHJcbmNvbnNvbGUuZGlyKHNsaWRlcik7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
