import $ from 'jquery';

import siiimpleToast from 'siiimple-toast';

var Prev_Selected_CardsNum = 0;

const CardsControl_Action = () => {

  let checked = 0;

  $('.custom_checkbox').each(function () {
    if ($(this).prop('checked') == true) {
      checked += 1;
    }
  });

  if (checked == 1) {
    // 이전값이 현재 값보다 클 경우 2->1이 된 경우
    if (Prev_Selected_CardsNum > checked) {
      $('#control_cards_btn').queue(function (next) {
        $(this).addClass('toktok');
        next();
      }).delay(100).queue(function (next) {
        $(this).removeClass('toktok');
        next();
      });
    } else {
      $('.cards_control_conntainer').addClass('active');

      $('#control_cards_btn').queue(function (next) {
        $(this).addClass('tiktok');
        next();
      }).delay(100).queue(function (next) {
        $(this).addClass('active');
        $(this).removeClass('tiktok');
        next();
      });
    }
  } else if (checked > 1) {
    $('#control_cards_btn').queue(function (next) {
      $(this).addClass('toktok');
      next();
    }).delay(100).queue(function (next) {
      $(this).removeClass('toktok');
      next();
    });
  } else {
    $('#control_cards_btn').queue(function (next) {
      $(this).removeClass('active');
      $(this).removeClass('toktok');
      next();
    }).delay(100).queue(function (next) {
      $(this).siblings('.control_btn_list').removeClass('active');
      next();
    }).queue(function (next) {
      $(this).children('i').removeClass('rotate');
      $('.cards_control_conntainer').removeClass('active');
      next();
    });
  }

  //이전 체크값 저장
  Prev_Selected_CardsNum = checked;

  $(window).trigger('resize');

  return checked;
}


// controller 버튼 이동
const CardsControl_Move = (e) => {

  let top = e.pageY - 75;
  let left = e.pageX + 20;

  $('.cards_control_conntainer').queue(function (next) {
    $(this).addClass('automove');
    next();
  }).delay(250).queue(function (next) {
    $(this).css({
      'top': top + 'px',
      'left': left + 'px'
    });
    next();
  }).delay(250).queue(function (next) {
    $(this).removeClass('automove');
    next();
  }).delay(250).queue(function (next) {
    $(this).clearQueue();
    next();
  });

  $(e.target).parents('.card').toggleClass('selected');
  $(e.target).siblings('.custom_checkbox').trigger('click');
  $(e.target).parents('.checkbox').toggleClass('active');
}


//이미지 모달 관련 함수
//return 다음 혹은 이전 사진 src 
const Slider = (img, type) => {

  let cardNum = $('.card').length;

  let returnImg = img;

  $('.card').each(function (i) {
    if (img == $(this).children('img').attr('src')) {
      if (type == "prev") {
        if (i === 0)
          returnImg = $('.card').eq(cardNum - 1).children('img').attr('src');
        else
          returnImg = $('.card').eq(i - 1).children('img').attr('src');
      } else if (type == "next") {
        if (i === cardNum - 1)
          returnImg = $('.card').eq(0).children('img').attr('src');
        else
          returnImg = $('.card').eq(i + 1).children('img').attr('src');
      }
    }
  });

  return returnImg;
}

//원본이미지
const GetRealImg = (img) => {

  img = img.replace("small-", "");
  img = img.replace("medium-", "");

  return img;
}

// X축 스크롤
function scrollX(e) {

  $.extend($.easing, {
    easeOutQuint: function (x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    }
  });

  e = window.event || e;

  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

  $('.wrapper').stop().animate({
    scrollLeft: $(this).scrollLeft() - (delta * 450)
  }, 1000, 'easeOutQuint', function () { });

  e.preventDefault();
}


const Resize = () => {
  setTimeout(function () {
    $('.card').each(function () {
      let width = $(this).find('img').width();
      let height = $(this).find('img').height();

      let ratio = width / height;

      let cardWidth = ratio * $(this).height();

      $(this).width(cardWidth);
    });
  }, 100);

  $('.wrapper').height($(this).height() - $('#header').outerHeight() - 55);
}

const ajax = ({
  url,
  method = 'GET',
  data = {},
  dataType = 'text',
  contentType = 'application/x-www-form-urlencoded; charset=utf-8',
  _callback,
  _failCallback = (request) => {
    new siiimpleToast().alert(request.responseText);
  }
}) => {
  $.ajax({
    url: url,
    type: method,
    data: data,
    dataType: dataType,
    contentType: contentType,
  })
    .done(_callback)
    .fail(_failCallback);
}


export { Resize, CardsControl_Action, CardsControl_Move, scrollX, GetRealImg, Slider, ajax }