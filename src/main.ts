
function log(content: string) {
  console.log(`%c[WotLifeRecentBattles]: ${content}`, 'color: #4a92b7; font-weight: bold');
}

log('The extension is enabled!');


const path = location.pathname;

if (!path.startsWith('/eu/player/')) throw new Error('Invalid page');

const playerIdWithName = path
  .replace('/eu/player/', '')
  .replace(/\//g, '');


let id = ''
for (let i = playerIdWithName.length - 1; i >= 0; i--) {
  if (playerIdWithName[i] === '-') break;

  id = playerIdWithName[i] + id;
}

type TankStats = {
  battles: number;
  wn8: number;
  id: number;
  dpg: number;
}

(async () => {
  log(`Fetching data for player id ${id}`);

  try {
    const result = await fetch(`https://api.tomato.gg/dev/api-v2/recents/eu/${id}`, {
      method: 'GET',
      cache: 'force-cache',
    });

    if (result.ok === false) throw new Error('Fetch failed');

    const {data} = await result.json();

    log('Data fetched!');
    console.log(data);

    // const table = document.querySelector('#tanks');

    // const tRow = table?.querySelector('thead tr')!;

    const {recent30days: {tankStats}} = data;
    
    for (const tank of tankStats as TankStats[]) {
      const tankClass = `tank${tank.id}`;

      const tankSpan = document.querySelector(`.${tankClass}`);

      const tankRow = tankSpan?.closest('tr')!;

      const pixels = 10;

      tankRow.innerHTML += `
        <td>${tank.battles}</td>
      `;

      if (tank.battles > 60) {
        tankRow!.style.borderLeft! = `${pixels}px solid #83579d`;
      } else if (tank.battles > 30) {
        tankRow!.style.borderLeft! = `${pixels}px solid #83579dad`;
      } else if (tank.battles > 10) {
        tankRow!.style.borderLeft! = `${pixels}px solid #83579d7a`;
      } else {
        tankRow!.style.borderLeft! = `${pixels}px solid #83579d2b`;
      }
    }
  } catch(err) {
    console.log(err);
  }
})();
