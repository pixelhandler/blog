export const removePreloadClass: ()=>void =
  function () {
    var staticContent = document.querySelectorAll('.preload');
    for (var i = 0; i < staticContent.length; i++) {
      staticContent[i].classList.remove('preload');
    }
  };