import React, { useEffect, useState } from 'react';
import * as C from './AppStyles';

import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { GridItem } from './components/GridItem';

import RestartIcon from './svgs/restart.svg';

import { GridItemType } from './types/GridItemType';
import { items } from './data/items';

import { formatTimeElapsed } from './helpers/formatTimeElapsed';
 

function App() {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);

  useEffect(()=>{
    //controls the timer 
    let timer = setInterval(() => {
      if(playing) {
        setTimeElapsed(timeElapsed + 1);
      }
    } ,1000);

    return () => clearInterval(timer);
  }, [playing, timeElapsed])

  useEffect(() => {
    if(shownCount === 2 ) {
      let opened = gridItems.filter(item => item.shown === true); 
      if(opened.length === 2) {
        
        if(opened[0].item === opened[1].item) {
          //v1 - if both are equals, make every 'shown' permanent
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShownCount(0);
        } else {
          //v2 - if they are not equal , close all 'shown'
          setTimeout(()=> {
            let tmpGrid = [...gridItems]
            for(let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }, 1000)
          
        }
        setMoveCount(moveCount => moveCount + 1);
      }
      
    }

  } ,[shownCount, gridItems])

  useEffect(() => {
    //check if the game is over
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems])


  const resetAndCreateGrid = () => {
    //reset the game and create a new grid
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);
    
    let tmpGrid: GridItemType[] = [];

    for(let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
          item: null,
          shown: false,
          permanentShown: false
        })
    }

    for(let w = 0; w < 2; w++){
      for(let i= 0; i < items.length; i++) {
        let pos = -1; 
        while(pos < 0 || tmpGrid[pos].item !== null) {
         pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }

    setGridItems(tmpGrid);

    setPlaying(true);
  }
  
  const handleItemClick = (index: number) => {
    if(playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];
      
      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }
      setGridItems(tmpGrid);
    }
  }

  return (
   <C.Container>
    <C.Info>
      <C.Title>Memory Game</C.Title>
      <C.InfoArea>
        <InfoItem label='Time' value={formatTimeElapsed(timeElapsed)}/>
        <InfoItem label='Moves' value={`${moveCount}`} />
      </C.InfoArea>
      <Button label='Restart' click={resetAndCreateGrid} icon={RestartIcon} />
    </C.Info>
    <C.GridArea>
      <C.Grid>
        {gridItems.map((e, index) => (
          <GridItem 
            key={index}
            item={e}
            onClick={() => handleItemClick(index)}
          />
        ) 
        )}
      </C.Grid>
    </C.GridArea>
   </C.Container>
  );
}

export default App;
