function openTile() {
    // const openEl = document.querySelector(`[data-hidden-tile='6']`); 
  
    const tileUnlocked = document.querySelectorAll('.js-tile-unlocked');
    const tile = document.querySelectorAll('.js-tile');
    const arrayTileInfo = document.querySelectorAll('.js-tile-info');
  
    let indexTile, indexTileInfo, openContent;
  
    tile.forEach((item) => {
          if (item.classList.contains('js-tile-active')) {
            item.querySelector('.js-tile-default').classList.add('hide');
            item.querySelector('.js-tile-unlocked').classList.remove('hide');
          }
      })
  
    tileUnlocked.forEach((item, i) => {
      
      item.addEventListener('click', () => {
        indexTile = parseInt(tile[i].getAttribute('data-hidden-tile'))-1;
        indexTileInfo = parseInt(arrayTileInfo[i].getAttribute('data-hidden-tile-info'));
        if (indexTile < tileUnlocked.length-1) {
            if (!tile[indexTile].classList.contains('lastInBranch')) {
                tile[indexTile+1].classList.add('tile_active'); 
                tile[indexTile+1].classList.add('js-tile_active');
                tile[indexTile+1].querySelector('.js-tile-unlocked').classList.remove('hide');
                tile[indexTile+1].querySelector('.js-tile-default').classList.add('hide');
                arrayTileInfo[indexTileInfo].classList.remove('hide');
            }
            tile[indexTile].querySelector('.js-tile-unlocked').classList.add('hide');
            tile[indexTile].querySelector('.js-tile-received').classList.remove('hide');
        }
        else {
          tile[indexTile].querySelector('.js-tile-unlocked').classList.add('hide');
          tile[indexTile].querySelector('.js-tile-received').classList.remove('hide');
          openContent = tile[i].getAttribute('data-open-content');
          showContant(openContent)
          scrollToContent(openContent);
        }
      })
    })
  }