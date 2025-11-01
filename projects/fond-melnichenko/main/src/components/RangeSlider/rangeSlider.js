$(function () {
  $(".range-slider").slider({
    animate: 'slow',
    min: 1,
    max: 10,
    range: true,
    step: 1,
    values: [3, 8],
    start: function (event, ui) { }
  });
});

sliderDisable = () => {
  $(".range-slider").slider("option", "disabled", true);
}

resultScore = () => {
  const length = $(".range-slider").length;

  let result = 0;
  let avg = 0;

  $('.range-slider').each((idx) => {
    avg = $(".range-slider").eq(idx).slider("option", "values").reduce((a, b) => a + b, 0);
    result += (avg / 2) * 10;
    // console.log(avg, result);
  });

  result = Math.round(result / length);
  console.log(result);
  sliderDisable();

  $('.js-test-footer').hide();

  if (result <= 49) {
    $('.js-feedback-low').show()
  } else if (result > 50 && result < 75) {
    $('.js-feedback-med').show()
  } else if (result > 75) {
    $('.js-feedback-high').show();
  }
}

$('.accept').on('click', resultScore);
