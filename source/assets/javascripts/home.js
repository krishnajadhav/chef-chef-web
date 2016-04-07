$(document).ready(function() {
  var $titles = $(".learn-section-title a");
  var $description = $(".lg-description");

  $titles.hover( 
    function() {
      $titles.find(".learn-section-icon").removeClass("fade-in"); 

      if ($(window).width() > 800) {
        var $this = $(this);

        if ( $(this).parents(".tutorials-title").length)  {
          $description.removeClass("skills-active docs-active training-active")
            .addClass("tutorials-active");

        } else if ( $(this).parents(".skills-title").length) {
          $description.removeClass("tutorials-active docs-active training-active")
            .addClass("skills-active");

        } else if ( $(this).parents(".docs-title").length) {
          $description.removeClass("skills-active tutorials-active training-active")
            .addClass("docs-active");

        } else if ( $(this).parents(".training-title").length) {
          $description.removeClass("skills-active docs-active tutorials-active")
            .addClass("training-active");

        }
      }
  }, function() {

  });
});