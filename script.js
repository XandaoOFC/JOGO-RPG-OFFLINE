// RPG DIVINO OFFLINE FINAL - Épico com eventos diários
let player={name:'',level:1,xp:0,hp:120,maxHp:120,mp:60,maxMp:60,attack:16,defense:8,dailyBonus:null};
let pets=[],achievements=[],missions=[],lastMissionDate='';
let playerName=prompt("🌌 Bem-vindo ao RPG DIVINO! Qual é o seu nome?");
player.name=(playerName&&playerName.trim()!=='')?playerName.trim():'Jogador Divino';
const startBtn=document.getElementById('startBtn'),
gameSection=document.getElementById('game'),
menu=document.getElementById('menu'),
story=document.getElementById('story'),
hpFill=document.getElementById('hpFill'),
mpFill=document.getElementById('mpFill'),
playerLevelEl=document.getElementById('playerLevel'),
playerNameEl=document.getElementById('playerName'),
saveBtn=document.getElementById('saveBtn');

function updateBars(){
    hpFill.style.width=(player.hp/player.maxHp*100)+'%';
    mpFill.style.width=(player.mp/player.maxMp*100)+'%';
    playerLevelEl.innerText='Nível '+player.level;
    playerNameEl.innerText=player.name;
}
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function xpToNext(level){return Math.floor(50*Math.pow(level,2));}
function grantXP(amount){player.xp+=amount;story.innerText=`Ganhou ${amount} XP.`;while(player.xp>=xpToNext(player.level)){player.xp-=xpToNext(player.level);levelUp();}updateBars();}
function levelUp(){player.level+=1;player.maxHp+=18;player.maxMp+=8;player.attack+=4;player.defense+=2;player.hp=player.maxHp;player.mp=player.maxMp;story.innerText=`✨ SUBIU PARA O NÍVEL ${player.level}!`;saveProgressOffline();}
function saveProgressOffline(){localStorage.setItem('rpgDivinoPlayer',JSON.stringify({player,pets,achievements,missions,lastMissionDate}));}
function loadProgressOffline(){const data=localStorage.getItem('rpgDivinoPlayer');if(data){const d=JSON.parse(data);Object.assign(player,d.player);pets=d.pets||[];achievements=d.achievements||[];missions=d.missions||[];lastMissionDate=d.lastMissionDate||'';}}

function generateDailyMissionsEpic(){
    const today=new Date().toDateString();
    if(lastMissionDate===today)return;
    lastMissionDate=today;
    missions=[];
    const types=['Derrotar inimigos','Domar pets','Explorar'];
    for(let i=0;i<3;i++){
        const type=types[rand(0,types.length-1)];
        missions.push({type,target:rand(1,5),completed:0,rare:false});
    }
    if(Math.random()<0.2){
        const rareTypes=['Domar Ser Divino','Derrotar Monstro Épico','Encontrar Artefato Lendário'];
        const rareType=rareTypes[rand(0,rareTypes.length-1)];
        missions.push({type:rareType,target:1,completed:0,rare:true});
    }
}

function completeMissionEpic(index,amount){
    if(!missions[index])return;
    missions[index].completed+=amount;
    if(missions[index].completed>=missions[index].target){
        missions[index].completed=missions[index].target;
        if(missions[index].rare){
            story.innerText=`✨ MISSÃO ÉPICA CONCLUÍDA: ${missions[index].type}! ✨`;
            grantXP(60+rand(20,40));
            pets.push('Pet Lendário #'+rand(1,99));
        }else{
            story.innerText=`✅ Missão concluída: ${missions[index].type} (${missions[index].target})`;
            grantXP(30+rand(5,15));
        }
    }
    saveProgressOffline();
}

function dailyCosmicEvent(){
    const today=new Date().toDateString();
    const lastEventDate=localStorage.getItem('rpgDivinoLastEvent')||'';
    if(today===lastEventDate)return;
    localStorage.setItem('rpgDivinoLastEvent',today);
    const events=[
        {msg:"🌌 Um portal cósmico surge hoje!",bonus:"pet"},
        {msg:"✨ As estrelas brilham mais intensas, XP bônus!",bonus:"xp"},
        {msg:"⚡ Um artefato lendário aparece!",bonus:"item"}
    ];
    const event=events[rand(0,events.length-1)];
    story.innerText=event.msg;
    player.dailyBonus=event.bonus;
}

function applyDailyBonus(){
    if(!player.dailyBonus)return;
    if(player.dailyBonus==="pet"){
        pets.push("Pet Cósmico #"+rand(100,999));
        story.innerText+=" Você recebeu um Pet Cósmico!";
    }else if(player.dailyBonus==="xp"){
        grantXP(50+rand(10,30));
    }else if(player.dailyBonus==="item"){
        pets.push("Artefato Lendário #"+rand(1,99));
        story.innerText+=" Você encontrou um Artefato Lendário!";
    }
    player.dailyBonus=null;
    saveProgressOffline();
}

loadProgressOffline();
generateDailyMissionsEpic();
dailyCosmicEvent();
updateBars();

startBtn.onclick=()=>{menu.classList.add('hidden');gameSection.classList.remove('hidden');updateBars();};

document.getElementById('battleBtn').onclick=()=>{
    const dmg=rand(8,20);
    story.innerText=`Você derrotou inimigos e ganhou ${dmg} XP.`;
    grantXP(dmg);
    missions.forEach((m,i)=>{if(m.type==='Derrotar inimigos')completeMissionEpic(i,1);});
    applyDailyBonus();
};

document.getElementById('exploreBtn').onclick=()=>{
    story.innerText='Explorando...';
    const found=Math.random()<0.3;
    if(found){
        const item='Artefato '+rand(1,99);
        pets.push(item);
        story.innerText=`Você encontrou e domou: ${item}!`;
        missions.forEach((m,i)=>{if(m.type==='Domar pets')completeMissionEpic(i,1);});
        applyDailyBonus();
    }else story.innerText='Nada encontrado.';
    saveProgressOffline();
};

saveBtn.onclick=()=>{saveProgressOffline();story.innerText='Progresso salvo!';};
