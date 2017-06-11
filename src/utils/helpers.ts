export const removePreloadClass: ()=>void =
  function () {
    const staticContent = document.querySelectorAll('.preload');
    for (let i = 0; i < staticContent.length; i++) {
      staticContent[i].classList.remove('preload');
    }
  };