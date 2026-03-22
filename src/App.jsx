import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, onValue, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDMvxscY5eikwure1_msdPmmFdmfPGS8Hc",
  authDomain: "valorant-spy.firebaseapp.com",
  databaseURL: "https://valorant-spy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "valorant-spy",
  storageBucket: "valorant-spy.firebasestorage.app",
  messagingSenderId: "873001446",
  appId: "1:873001446:web:e3e355343203b74009e627",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const AGENTS = [
  { name:"Jett",      img:"https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png" },
  { name:"Reyna",     img:"https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png" },
  { name:"Phoenix",   img:"https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png" },
  { name:"Yoru",      img:"https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png" },
  { name:"Neon",      img:"https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png" },
  { name:"Iso",       img:"https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/displayicon.png" },
  { name:"Clove",     img:"https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eca86b79/displayicon.png" },
  { name:"Brimstone", img:"https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png" },
  { name:"Omen",      img:"https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png" },
  { name:"Viper",     img:"https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png" },
  { name:"Astra",     img:"https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/displayicon.png" },
  { name:"Harbor",    img:"https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png" },
  { name:"Gekko",     img:"https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png" },
  { name:"Breach",    img:"https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png" },
  { name:"Sova",      img:"https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png" },
  { name:"Fade",      img:"https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png" },
  { name:"Skye",      img:"https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png" },
  { name:"KAY/O",     img:"https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png" },
  { name:"Chamber",   img:"https://media.valorant-api.com/agents/22697054-9a45-d716-3bc1-0fbd81ae3f1b/displayicon.png" },
  { name:"Cypher",    img:"https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png" },
  { name:"Sage",      img:"https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png" },
  { name:"Killjoy",   img:"https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png" },
  { name:"Deadlock",  img:"https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/displayicon.png" },
  { name:"Vyse",      img:"https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae976b373d/displayicon.png" },
  { name:"Tejo",      img:"https://media.valorant-api.com/agents/b444168c-4b85-d812-b3f5-9aae8c9c7a53/displayicon.png" },
  { name:"Waylay",    img:"https://media.valorant-api.com/agents/df1cb487-4902-6f8a-4979-b38b8c30d7f9/displayicon.png" },
];

const WEAPONS = [
  { name:"Vandal",   img:"https://media.valorant-api.com/weapons/9c82e19d-4575-0200-1a81-3eacf00cf872/displayicon.png" },
  { name:"Phantom",  img:"https://media.valorant-api.com/weapons/ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a/displayicon.png" },
  { name:"Operator", img:"https://media.valorant-api.com/weapons/a03b24d3-4319-996d-0f8c-94bbfba1dfc7/displayicon.png" },
  { name:"Odin",     img:"https://media.valorant-api.com/weapons/63e6c2b6-4a8e-869c-3d4c-e38355226584/displayicon.png" },
  { name:"Ares",     img:"https://media.valorant-api.com/weapons/55d8a0f4-4274-ca67-fe2c-06ab45efdf58/displayicon.png" },
  { name:"Sheriff",  img:"https://media.valorant-api.com/weapons/e336c6b8-418d-9340-d77f-7a9e4cfe0702/displayicon.png" },
  { name:"Ghost",    img:"https://media.valorant-api.com/weapons/1baa85b4-4c70-1284-64bb-8481d3a3c79c/displayicon.png" },
  { name:"Frenzy",   img:"https://media.valorant-api.com/weapons/44d4e95c-4157-0037-81b2-17841bf2e8e3/displayicon.png" },
  { name:"Classic",  img:"https://media.valorant-api.com/weapons/29a0cfab-485b-f5d5-779a-b59f85e204a8/displayicon.png" },
  { name:"Bulldog",  img:"https://media.valorant-api.com/weapons/ae3de142-4d85-2547-dd26-4e90bed35cf7/displayicon.png" },
  { name:"Guardian", img:"https://media.valorant-api.com/weapons/4ade7faa-4cf1-8376-95ef-39884480959b/displayicon.png" },
  { name:"Marshal",  img:"https://media.valorant-api.com/weapons/c4883e50-4494-202c-3ec3-6b8a9284f00b/displayicon.png" },
  { name:"Stinger",  img:"https://media.valorant-api.com/weapons/f7e1b454-4ad4-1063-ec0a-159e56b58941/displayicon.png" },
  { name:"Spectre",  img:"https://media.valorant-api.com/weapons/462080d1-4035-2937-7c09-27aa2a5c27a7/displayicon.png" },
  { name:"Bucky",    img:"https://media.valorant-api.com/weapons/910be174-449b-c412-ab22-d0873436b21b/displayicon.png" },
  { name:"Judge",    img:"https://media.valorant-api.com/weapons/ec845bf4-4f79-ddda-a3da-0db3d5af23b5/displayicon.png" },
  { name:"Shorty",   img:"https://media.valorant-api.com/weapons/42da8ccc-40d5-affc-beec-15aa47b42eda/displayicon.png" },
  { name:"Knife",    img:"https://media.valorant-api.com/weapons/2f59173c-4bed-b6c3-2191-dea9b58be9c7/displayicon.png" },
];

const HINT_EMOJIS = [
  "🔥","💧","⚡","🌀","🌑","🌈","👁️","💀","🎯","🛡️",
  "⚔️","🔫","💣","🧪","🌿","❄️","🌊","🏃","🦊","🐺",
  "🦅","🤖","👻","🕵️","💥","✨","🎪","🎭","🌙","☀️",
  "🔮","💎","🗡️","🪄","🧲","🪖","🎖️","🏹","🐍","🦁",
  "🌪️","⭐","🔴","🟡","🟢","🟣","🩸","🫧","🕶️","🎮",
];

const ALL_ITEMS = [
  ...AGENTS.map(a => ({ ...a, category:"agent" })),
  ...WEAPONS.map(w => ({ ...w, category:"weapon" })),
];

function getItemData(name) { return ALL_ITEMS.find(i => i.name === name) || null; }
function getCategoryItems(cat) { return cat === "agent" ? AGENTS : WEAPONS; }
function randId(len=6) { return Math.random().toString(36).slice(2,2+len).toUpperCase(); }
function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
async function roomGet(code) {
  const snap = await get(ref(db,`rooms/${code}`));
  return snap.exists() ? snap.val() : null;
}

function useTimer(room) {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (!room?.timerEnd || room?.state !== "game") { setTimeLeft(null); return; }
    const tick = () => setTimeLeft(Math.max(0, Math.ceil((room.timerEnd - Date.now()) / 1000)));
    tick();
    const iv = setInterval(tick, 500);
    return () => clearInterval(iv);
  }, [room?.timerEnd, room?.state]);
  return timeLeft;
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body,input,button,span,div,p{font-family:'Noto Sans Thai','Inter',sans-serif;}
  body{background:#0b0b12;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#ff4655;border-radius:2px;}
  input,button{outline:none;}
  .btn-p{display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ff4655,#c43030);border:none;color:#fff;padding:14px 30px;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:17px;font-weight:700;cursor:pointer;transition:all .2s;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);}
  .btn-p:hover{filter:brightness(1.15);transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,70,85,.35);}
  .btn-p:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}
  .btn-g{display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1.5px solid rgba(255,70,85,.5);color:#ff4655;padding:12px 24px;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:16px;font-weight:600;cursor:pointer;transition:all .2s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);}
  .btn-g:hover{background:rgba(255,70,85,.1);border-color:#ff4655;}
  .btn-g:disabled{opacity:.4;cursor:not-allowed;}
  .btn-von{display:inline-flex;align-items:center;justify-content:center;background:rgba(255,70,85,.18);border:1.5px solid #ff4655;color:#ff8a94;padding:12px 24px;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:16px;font-weight:600;cursor:pointer;transition:all .2s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);}
  .btn-von:hover{background:rgba(255,70,85,.28);}
  .inp{width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-bottom:2px solid #ff4655;color:#f0ece4;padding:14px 16px;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:17px;font-weight:500;transition:.2s;}
  .inp:focus{background:rgba(255,70,85,.05);border-bottom-color:#ff8a94;}
  .inp::placeholder{color:rgba(255,255,255,.2);font-weight:400;}
  .card{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);padding:22px;}
  .lbl{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:10px;font-weight:600;font-family:'Inter','Noto Sans Thai',sans-serif;}
  .glow{text-shadow:0 0 30px rgba(255,70,85,.5),0 0 60px rgba(255,70,85,.2);}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
  @keyframes scaleIn{from{opacity:0;transform:scale(.92);}to{opacity:1;transform:scale(1);}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.35;}}
  @keyframes popIn{0%{opacity:0;transform:scale(.5);}70%{transform:scale(1.08);}100%{opacity:1;transform:scale(1);}}
  @keyframes timerWarn{0%,100%{color:#ff4655;}50%{color:#ff8a94;}}
  .au{animation:fadeUp .4s cubic-bezier(.2,.8,.3,1) forwards;}
  .ai{animation:scaleIn .3s cubic-bezier(.2,.8,.3,1) forwards;}
  .pop{animation:popIn .4s cubic-bezier(.34,1.56,.64,1) forwards;}
  .bubble-slot{height:90px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:8px;}
  .bubble{background:rgba(255,255,255,.95);color:#111;border-radius:12px;padding:7px 10px;font-size:13px;font-weight:600;position:relative;max-width:96px;min-width:48px;text-align:center;word-break:break-word;line-height:1.4;box-shadow:0 4px 16px rgba(0,0,0,.5);font-family:'Noto Sans Thai','Inter',sans-serif;}
  .bubble::after{content:'';position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:rgba(255,255,255,.95);}
  .avatar{width:50px;height:50px;border-radius:6px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:22px;color:rgba(255,255,255,.45);transition:.25s;}
  .avatar.on{border-color:#ff4655;box-shadow:0 0 0 3px rgba(255,70,85,.2),0 0 20px rgba(255,70,85,.4);}
  .pname{font-size:12px;text-align:center;margin-top:5px;max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'Noto Sans Thai','Inter',sans-serif;}
  .emoji-grid{display:grid;grid-template-columns:repeat(10,1fr);gap:4px;max-height:130px;overflow-y:auto;}
  .ec{cursor:pointer;border:2px solid transparent;border-radius:6px;padding:5px 3px;font-size:20px;text-align:center;background:rgba(255,255,255,.04);transition:.15s;}
  .ec:hover,.ec.sel{border-color:#ff4655;background:rgba(255,70,85,.12);transform:scale(1.1);}
  .spy-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-height:360px;overflow-y:auto;}
  .sc{cursor:pointer;border:2px solid rgba(255,255,255,.08);border-radius:8px;padding:10px 6px;background:rgba(255,255,255,.03);display:flex;flex-direction:column;align-items:center;gap:5px;transition:.2s;font-family:'Noto Sans Thai','Inter',sans-serif;}
  .sc:hover{border-color:#ff4655;background:rgba(255,70,85,.1);transform:translateY(-2px);box-shadow:0 6px 16px rgba(255,70,85,.2);}
  .sc img{width:46px;height:46px;object-fit:contain;}
  .sc span{font-size:13px;color:rgba(255,255,255,.7);text-align:center;font-family:'Noto Sans Thai','Inter',sans-serif;}
  .vr{background:rgba(255,255,255,.03);border:1.5px solid rgba(255,255,255,.08);padding:13px 16px;margin-bottom:8px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:.2s;}
  .vr:hover{background:rgba(255,70,85,.07);border-color:rgba(255,70,85,.35);}
  .vr.picked{background:rgba(255,70,85,.14);border-color:#ff4655;}
  .hr{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);}
  .tb{flex:1;padding:12px 8px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);color:rgba(255,255,255,.45);font-family:'Inter','Noto Sans Thai',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:.2s;border-radius:2px;}
  .tb:hover{background:rgba(255,70,85,.08);border-color:rgba(255,70,85,.3);color:rgba(255,255,255,.7);}
  .tb.sel{background:rgba(255,70,85,.15);border-color:#ff4655;color:#fff;}
  .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,70,85,.3),transparent);margin:20px 0;}
  .tp{display:inline-flex;align-items:center;gap:6px;background:rgba(255,70,85,.15);border:1px solid rgba(255,70,85,.4);padding:5px 14px;font-size:14px;font-weight:600;color:#ff8a94;border-radius:20px;font-family:'Noto Sans Thai','Inter',sans-serif;}
`;

export default function App() {
  const [myId] = useState(() => randId(8));
  const [myName, setMyName] = useState("");
  const [screen, setScreen] = useState("enter-name");
  const [roomCode, setRoomCode] = useState("");
  const [joinInput, setJoinInput] = useState("");
  const [room, setRoom] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [hint, setHint] = useState("");
  const [hintEmoji, setHintEmoji] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [voted, setVoted] = useState(null);
  const [error, setError] = useState("");
  const [roundMins, setRoundMins] = useState(3);
  const unsubRef = useRef(null);
  const timeLeft = useTimer(room);

  useEffect(() => {
    if (!roomCode) return;
    unsubRef.current = onValue(ref(db,`rooms/${roomCode}`), snap => {
      if (snap.exists()) setRoom(snap.val());
    });
    return () => unsubRef.current && unsubRef.current();
  }, [roomCode]);

  useEffect(() => {
    if (!room?.assignments?.[myId]) return;
    setMyRole(room.assignments[myId]);
  }, [room?.assignments, myId]);

  useEffect(() => {
    if (room?.state === "game") {
      setVoted(null); setHint(""); setHintEmoji(""); setShowEmoji(false);
    }
  }, [room?.round]);

  useEffect(() => {
    if (!room || room.state !== "game" || room.host !== myId || timeLeft === null) return;
    if (timeLeft === 0) update(ref(db,`rooms/${roomCode}`), { state:"vote", votes:{} });
  }, [timeLeft]);

  function goChoose() {
    if (!myName.trim()) { setError("กรุณาใส่ชื่อของคุณ"); return; }
    setError(""); setScreen("choose");
  }

  async function createRoom() {
    const code = randId(4);
    await set(ref(db,`rooms/${code}`), {
      code, host:myId,
      players:{ [myId]:{ id:myId, name:myName } },
      state:"lobby", assignments:{}, hints:{}, votes:{}, voteRequests:{},
      winner:null, answer:null, spyId:null, category:null,
      turnOrder:[], currentTurn:0, round:0, roundMins, timerEnd:null, spyGuess:null,
    });
    setRoomCode(code); setError(""); setScreen("lobby");
  }

  async function joinRoom() {
    if (!joinInput.trim()) { setError("กรุณาใส่รหัสห้อง"); return; }
    const code = joinInput.trim().toUpperCase();
    const r = await roomGet(code);
    if (!r) { setError("ไม่พบห้องนี้ครับ"); return; }
    await update(ref(db,`rooms/${code}/players`), { [myId]:{ id:myId, name:myName } });
    setRoomCode(code); setError(""); setScreen("lobby");
  }

  async function startGame() {
    const r = await roomGet(roomCode);
    const players = Object.keys(r.players||{});
    if (players.length < 2) { setError("ต้องมีผู้เล่นอย่างน้อย 2 คน"); return; }
    const picked = ALL_ITEMS[Math.floor(Math.random()*ALL_ITEMS.length)];
    const pool = ALL_ITEMS.filter(i=>i.category===picked.category&&i.name!==picked.name);
    const decoy = pool[Math.floor(Math.random()*pool.length)];
    const shuffled = shuffle(players);
    const spyId = shuffled[0];
    const assignments = {};
    players.forEach(pid => {
      assignments[pid] = { word:pid===spyId?decoy.name:picked.name, isSpy:pid===spyId, category:picked.category };
    });
    const timerEnd = Date.now()+(r.roundMins||3)*60*1000;
    await set(ref(db,`rooms/${roomCode}`), {
      ...r, state:"game", assignments, hints:{}, votes:{}, voteRequests:{},
      winner:null, answer:picked.name, spyId, category:picked.category,
      turnOrder:shuffled, currentTurn:0, round:(r.round||0)+1, timerEnd, spyGuess:null,
    });
  }

  async function submitHint() {
    if (!hint.trim()&&!hintEmoji) { setError("พิมพ์คำใบ้หรือเลือก emoji ก่อน"); return; }
    const r = await roomGet(roomCode);
    const totalP = r.turnOrder.length;
    if (r.turnOrder[r.currentTurn%totalP] !== myId) { setError("ยังไม่ใช่ตาของคุณ"); return; }
    await update(ref(db,`rooms/${roomCode}`), {
      [`hints/${myId}`]:{ text:hint.trim(), emoji:hintEmoji||null },
      currentTurn:r.currentTurn+1,
    });
    setHint(""); setHintEmoji(""); setShowEmoji(false); setError("");
  }

  async function toggleVoteReq() {
    const r = await roomGet(roomCode);
    if (r.voteRequests?.[myId]) {
      await remove(ref(db,`rooms/${roomCode}/voteRequests/${myId}`));
    } else {
      await update(ref(db,`rooms/${roomCode}/voteRequests`), { [myId]:true });
      const r2 = await roomGet(roomCode);
      const total = Object.keys(r2.players||{}).length;
      const reqs = Object.keys(r2.voteRequests||{}).length;
      if (reqs > total/2) await update(ref(db,`rooms/${roomCode}`), { state:"vote", votes:{} });
    }
  }

  async function castVote(targetId) {
    const r = await roomGet(roomCode);
    if (r.votes?.[myId]===targetId) {
      await remove(ref(db,`rooms/${roomCode}/votes/${myId}`));
      setVoted(null); return;
    }
    setVoted(targetId);
    const updatedVotes = { ...(r.votes||{}), [myId]:targetId };
    const total = Object.keys(r.players||{}).length;
    if (Object.keys(updatedVotes).length >= total) {
      const tally={};
      Object.values(updatedVotes).forEach(v=>{ tally[v]=(tally[v]||0)+1; });
      const max = Math.max(...Object.values(tally));
      const accused = Object.keys(tally).filter(k=>tally[k]===max);
      const newState = accused.length===1&&accused[0]===r.spyId ? "spyguess":"result";
      await update(ref(db,`rooms/${roomCode}`), { votes:updatedVotes, state:newState, winner:newState==="result"?"spy":null });
    } else {
      await update(ref(db,`rooms/${roomCode}/votes`), { [myId]:targetId });
    }
  }

  async function spyGuess(guessName) {
    const r = await roomGet(roomCode);
    const correct = guessName===r.answer;
    await update(ref(db,`rooms/${roomCode}`), { spyGuess:guessName, winner:correct?"spy":"players", state:"result" });
  }

  async function leaveRoom() {
    if (unsubRef.current) unsubRef.current();
    const r = await roomGet(roomCode);
    if (r) {
      const rem = Object.keys(r.players||{}).filter(id=>id!==myId);
      if (rem.length===0) await remove(ref(db,`rooms/${roomCode}`));
      else {
        await remove(ref(db,`rooms/${roomCode}/players/${myId}`));
        if (r.host===myId) await update(ref(db,`rooms/${roomCode}`), { host:rem[0] });
      }
    }
    setRoom(null); setRoomCode(""); setMyRole(null); setVoted(null); setScreen("choose");
  }

  const isHost = room?.host===myId;
  const totalP = Object.keys(room?.players||{}).length;
  const curIdx = (room?.currentTurn||0) % (room?.turnOrder?.length||1);
  const curPid = room?.turnOrder?.[curIdx];
  const myTurn = room?.state==="game" && curPid===myId;
  const isSpyGuess = room?.state==="spyguess" && room?.spyId===myId;
  const vreqCount = Object.keys(room?.voteRequests||{}).length;
  const myVreq = room?.voteRequests?.[myId];
  const players = Object.values(room?.players||{});
  const ps = { minHeight:"100vh", background:"linear-gradient(160deg,#0b0b12 0%,#180808 55%,#080b18 100%)", fontFamily:"'Noto Sans Thai','Inter',sans-serif", color:"#f0ece4" };

  const H = () => (
    <div style={{ textAlign:"center", marginBottom:32, paddingTop:20 }}>
      <div style={{ fontSize:10, letterSpacing:6, color:"#ff4655", fontWeight:700, marginBottom:6, fontFamily:"'Inter',sans-serif" }}>VALORANT</div>
      <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, letterSpacing:5, lineHeight:1, color:"#fff" }} className="glow">SPY FALL</h1>
      <div style={{ fontSize:11, letterSpacing:3, color:"rgba(255,255,255,.2)", marginTop:4 }}>WHO IS THE IMPOSTOR? BY ไอ่ดุ่ย</div>
    </div>
  );
  const Err = () => error ? <div style={{ background:"rgba(255,70,85,.1)", border:"1px solid rgba(255,70,85,.4)", padding:"10px 14px", marginBottom:14, fontSize:15, color:"#ff8a94" }}>⚠ {error}</div> : null;
  const W = (ch) => <div style={{ maxWidth:560, margin:"0 auto", padding:"24px 16px" }} className="au">{ch}</div>;

  if (screen==="enter-name") return <div style={ps}><style>{CSS}</style>{W(<>
    <H/><Err/>
    <div className="card" style={{ marginBottom:14 }}>
      <div className="lbl">ชื่อผู้เล่นของคุณ</div>
      <input className="inp" placeholder="ใส่ชื่อ..." value={myName} onChange={e=>setMyName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&goChoose()} autoFocus/>
    </div>
    <button className="btn-p" style={{ width:"100%" }} onClick={goChoose}>ถัดไป →</button>
    <div className="divider"/>
    <div style={{ padding:"16px", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", fontSize:15, color:"rgba(255,255,255,.38)", lineHeight:2.2 }}>
      <div className="lbl">วิธีเล่น</div>
      <div>◆ ผู้เล่นทุกคนได้รับคำจาก Valorant (Agent / อาวุธ)</div>
      <div>◆ <span style={{color:"#ff8a94"}}>SPY</span> 1 คน ได้คำต่าง แต่อยู่ในหมวดเดียวกัน</div>
      <div>◆ ผลัดกันพูดคำใบ้ ส่ง emoji ได้ — วนไปจนหมดเวลา</div>
      <div>◆ กด "เสนอโหวต" เกินครึ่ง = โหวต SPY ทันที</div>
      <div>◆ โหวตถูก → SPY เดาคำ | เดาถูก = <span style={{color:"#ff4655"}}>SPY ชนะ!</span></div>
    </div>
  </>)}</div>;

  if (screen==="choose") return <div style={ps}><style>{CSS}</style>{W(<>
    <H/><Err/>
    <div style={{ textAlign:"center", marginBottom:24 }}>
      <div style={{ fontSize:15, color:"rgba(255,255,255,.4)" }}>ยินดีต้อนรับ</div>
      <div style={{ fontSize:26, fontWeight:700, color:"#fff", marginTop:4 }}>{myName}</div>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
      {[{e:"🏠",l:"สร้างห้อง",s:"เริ่มเกมใหม่",to:"create-room",hb:"#ff4655",db:"rgba(255,70,85,.2)"},
        {e:"🔗",l:"เข้าร่วมห้อง",s:"ใส่รหัสห้อง",to:"join-room",hb:"#4db8ff",db:"rgba(255,255,255,.08)"}].map(x=>(
        <div key={x.to} className="card" style={{ cursor:"pointer", textAlign:"center", padding:"28px 16px", transition:".2s", borderColor:x.db }}
          onClick={()=>{setError("");setScreen(x.to);}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=x.hb}
          onMouseLeave={e=>e.currentTarget.style.borderColor=x.db}>
          <div style={{ fontSize:34, marginBottom:10 }}>{x.e}</div>
          <div style={{ fontWeight:700, fontSize:18, marginBottom:4 }}>{x.l}</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,.35)" }}>{x.s}</div>
        </div>
      ))}
    </div>
    <button className="btn-g" style={{ width:"100%" }} onClick={()=>setScreen("enter-name")}>← เปลี่ยนชื่อ</button>
  </>)}</div>;

  if (screen==="create-room") return <div style={ps}><style>{CSS}</style>{W(<>
    <H/><Err/>
    <div className="card" style={{ marginBottom:14 }}>
      <div className="lbl">⏱ เวลาต่อรอบ (นาที)</div>
      <div style={{ display:"flex", gap:8 }}>
        {[1,2,3,5,10].map(m=><button key={m} className={`tb ${roundMins===m?"sel":""}`} onClick={()=>setRoundMins(m)}>{m}</button>)}
      </div>
      <div style={{ marginTop:10, fontSize:14, color:"rgba(255,255,255,.3)" }}>เมื่อหมดเวลาจะเข้าสู่การโหวต SPY อัตโนมัติ</div>
    </div>
    <button className="btn-p" style={{ width:"100%", marginBottom:10 }} onClick={createRoom}>สร้างห้องเลย!</button>
    <button className="btn-g" style={{ width:"100%" }} onClick={()=>setScreen("choose")}>← กลับ</button>
  </>)}</div>;

  if (screen==="join-room") return <div style={ps}><style>{CSS}</style>{W(<>
    <H/><Err/>
    <div className="card" style={{ marginBottom:14 }}>
      <div className="lbl">รหัสห้อง</div>
      <input className="inp" placeholder="เช่น AB12" value={joinInput} onChange={e=>setJoinInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&joinRoom()} autoFocus/>
    </div>
    <button className="btn-p" style={{ width:"100%", marginBottom:10 }} onClick={joinRoom}>เข้าร่วม</button>
    <button className="btn-g" style={{ width:"100%" }} onClick={()=>setScreen("choose")}>← กลับ</button>
  </>)}</div>;

  return (
    <div style={ps}><style>{CSS}</style>
    <div style={{ maxWidth:560, margin:"0 auto", padding:"20px 16px" }}>
      <H/>
      {error&&<div style={{ background:"rgba(255,70,85,.1)", border:"1px solid rgba(255,70,85,.4)", padding:"10px 14px", marginBottom:14, fontSize:15, color:"#ff8a94" }}>⚠ {error}</div>}

      {room?.state==="lobby"&&(
        <div className="au">
          <div className="card" style={{ textAlign:"center", marginBottom:14, borderColor:"rgba(255,70,85,.25)" }}>
            <div className="lbl">รหัสห้อง</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:68, letterSpacing:12, color:"#ff4655", lineHeight:1 }} className="glow">{roomCode}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.25)", letterSpacing:2, marginTop:4 }}>แชร์ให้เพื่อน • {room.roundMins} นาที / รอบ</div>
          </div>
          <div className="card" style={{ marginBottom:14 }}>
            <div className="lbl">ผู้เล่น ({totalP}/8)</div>
            {players.map(p=>(
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                <div style={{ width:6, height:6, background:p.id===room.host?"#ff4655":"#4db8ff", transform:"rotate(45deg)", flexShrink:0 }}/>
                <span style={{ fontWeight:600, fontSize:18 }}>{p.name}</span>
                {p.id===room.host&&<span style={{ fontSize:9, color:"#ff4655", letterSpacing:2 }}>HOST</span>}
                {p.id===myId&&<span style={{ fontSize:9, color:"rgba(255,255,255,.25)", letterSpacing:2 }}>YOU</span>}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {isHost
              ? <button className="btn-p" onClick={startGame} disabled={totalP<2} style={{ flex:1 }}>{totalP<2?"รอผู้เล่น...":"เริ่มเกม!"}</button>
              : <div style={{ flex:1, fontSize:15, color:"rgba(255,255,255,.35)", paddingTop:12, animation:"pulse 2s infinite", textAlign:"center" }}>รอ Host เริ่มเกม...</div>
            }
            <button className="btn-g" onClick={leaveRoom}>ออก</button>
          </div>
        </div>
      )}

      {room?.state==="game"&&myRole&&(
        <div className="au">
          <div style={{ display:"flex", gap:10, marginBottom:12 }}>
            <div className="card" style={{ flexShrink:0, textAlign:"center", padding:"12px 18px" }}>
              <div className="lbl" style={{ margin:"0 0 4px" }}>เวลา</div>
              <div style={{
                fontFamily:"'Bebas Neue',sans-serif", fontSize:40, letterSpacing:2, lineHeight:1,
                color:timeLeft!==null&&timeLeft<=30?"#ff4655":"#ffaa44",
                animation:timeLeft!==null&&timeLeft<=10?"timerWarn .6s infinite":"none",
              }}>
                {timeLeft!==null?`${Math.floor(timeLeft/60)}:${String(timeLeft%60).padStart(2,"0")}`:"--:--"}
              </div>
            </div>
            {/* Word card — always visible, no role reveal */}
            <div style={{ flex:1, textAlign:"center", padding:"14px", background:"rgba(0,180,255,.07)", border:"1.5px solid #4db8ff" }}>
              <div className="lbl" style={{ margin:"0 0 6px" }}>คำของคุณ</div>
              {getItemData(myRole.word)&&(
                <img src={getItemData(myRole.word).img} alt=""
                  style={{ width:40, height:40, objectFit:"contain", display:"block", margin:"0 auto 6px" }}
                  onError={e=>{e.target.style.display="none";}}/>
              )}
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:2, color:"#4db8ff" }}>{myRole.word}</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div className="lbl" style={{ margin:0 }}>ผู้เล่น</div>
              <div className="tp">⚡ {myTurn?"ตาคุณ!":room.players?.[curPid]?.name||"?"}</div>
            </div>
            <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4, justifyContent:players.length<=4?"center":"flex-start" }}>
              {players.map(p=>{
                const h = room.hints?.[p.id];
                return (
                  <div key={p.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:64 }}>
                    {/* Fixed-height slot — all bubbles bottom-aligned */}
                    <div className="bubble-slot">
                      {h&&(
                        <div className="bubble pop">
                          {h.emoji&&<div style={{ fontSize:22, lineHeight:1, marginBottom:h.text?3:0 }}>{h.emoji}</div>}
                          {h.text&&<div>{h.text}</div>}
                        </div>
                      )}
                    </div>
                    <div className={`avatar ${curPid===p.id?"on":""}`}>{p.name[0].toUpperCase()}</div>
                    <div className="pname" style={{ color:p.id===myId?"#ff8a94":"rgba(255,255,255,.4)" }}>
                      {p.name}{p.id===myId?" ★":""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {myTurn?(
            <div className="card" style={{ marginBottom:12, borderColor:"rgba(255,70,85,.3)" }}>
              <div className="lbl" style={{ color:"#ff8a94" }}>⚡ ตาของคุณ!</div>
              <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                <input className="inp" placeholder="คำใบ้ (ห้ามพูดชื่อตรงๆ)..." value={hint} onChange={e=>setHint(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitHint()} style={{ flex:1 }}/>
                <button className="btn-g" onClick={()=>setShowEmoji(!showEmoji)} style={{ flexShrink:0, padding:"11px 14px", fontSize:20 }}>😀</button>
              </div>
              {hintEmoji&&(
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, padding:"6px 12px", background:"rgba(255,70,85,.08)", border:"1px solid rgba(255,70,85,.25)" }}>
                  <span style={{ fontSize:24 }}>{hintEmoji}</span>
                  <span style={{ fontSize:15 }}>เลือก emoji แล้ว</span>
                  <button onClick={()=>setHintEmoji("")} style={{ marginLeft:"auto", background:"none", border:"none", color:"#ff4655", cursor:"pointer", fontSize:18 }}>✕</button>
                </div>
              )}
              {showEmoji&&(
                <div style={{ marginBottom:10 }}>
                  <div className="lbl">เลือก Emoji</div>
                  <div className="emoji-grid">
                    {HINT_EMOJIS.map(em=>(
                      <div key={em} className={`ec ${hintEmoji===em?"sel":""}`} onClick={()=>{setHintEmoji(em);setShowEmoji(false);}}>{em}</div>
                    ))}
                  </div>
                </div>
              )}
              <button className="btn-p" onClick={submitHint}>ส่งคำใบ้ →</button>
            </div>
          ):(
            <div style={{ textAlign:"center", fontSize:15, color:"rgba(255,255,255,.3)", marginBottom:12, animation:"pulse 2s infinite" }}>
              รอ <strong style={{ color:"rgba(255,255,255,.6)" }}>{room.players?.[curPid]?.name}</strong> พูด...
            </div>
          )}

          <div style={{ display:"flex", gap:10, padding:"14px", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", alignItems:"center" }}>
            {myVreq
              ? <button className="btn-von" onClick={toggleVoteReq} style={{ flex:1 }}>✓ เสนอแล้ว — กดยกเลิก</button>
              : <button className="btn-g" onClick={toggleVoteReq} style={{ flex:1 }}>🗳 เสนอโหวต SPY</button>
            }
            <div style={{ fontSize:14, color:"rgba(255,255,255,.35)", textAlign:"right", lineHeight:1.5 }}>
              {vreqCount}/{totalP}<br/><span style={{ fontSize:12 }}>เสนอ</span>
            </div>
          </div>
        </div>
      )}

      {room?.state==="vote"&&(
        <div className="au">
          <div className="card">
            <div className="lbl">🗳 โหวตหา SPY!</div>
            <p style={{ fontSize:15, color:"rgba(255,255,255,.4)", marginBottom:14 }}>กดซ้ำเพื่อยกเลิกโหวต • โหวตผิด = SPY ชนะทันที!</p>
            {players.filter(p=>p.id!==myId).map(p=>(
              <div key={p.id} className={`vr ${voted===p.id?"picked":""}`} onClick={()=>castVote(p.id)}>
                <div style={{ width:6, height:6, background:"#ff4655", transform:"rotate(45deg)", flexShrink:0 }}/>
                <span style={{ fontWeight:700, fontSize:20 }}>{p.name}</span>
                {voted===p.id&&<span style={{ marginLeft:"auto", color:"#ff4655", fontSize:12, letterSpacing:2 }}>VOTED ✓</span>}
              </div>
            ))}
            <div style={{ fontSize:14, color:"rgba(255,255,255,.25)", marginTop:8 }}>
              โหวตแล้ว {Object.keys(room.votes||{}).length}/{totalP} คน
            </div>
          </div>
        </div>
      )}

      {room?.state==="spyguess"&&(
        <div className="au">
          <div className="card" style={{ textAlign:"center" }}>
            <div style={{ fontSize:10, letterSpacing:4, color:"#ff4655", marginBottom:8 }}>SPY LAST CHANCE</div>
            <div style={{ fontFamily:"'Noto Sans Thai','Inter',sans-serif", fontSize:20, fontWeight:700, marginBottom:14 }}>
              {isSpyGuess?"คุณถูกจับได้! เดาคำที่ทุกคนได้...":"รอ SPY เดาคำ..."}
            </div>
            {isSpyGuess?(
              <>
                <div style={{ fontSize:15, color:"rgba(255,255,255,.4)", marginBottom:14 }}>
                  หมวด: <strong style={{ color:"#ffaa44" }}>{room.category==="agent"?"AGENT":"WEAPON"}</strong>
                </div>
                <div className="spy-grid">
                  {getCategoryItems(myRole?.category||room.category).map(item=>(
                    <div key={item.name} className="sc" onClick={()=>spyGuess(item.name)}>
                      <img src={item.img} alt={item.name} onError={e=>{e.target.style.display="none";}}/>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ):(
              <div style={{ fontSize:16, color:"rgba(255,255,255,.35)", animation:"pulse 2s infinite", padding:"28px 0" }}>กำลังรอ SPY เดา...</div>
            )}
          </div>
        </div>
      )}

      {room?.state==="result"&&(
        <div className="au">
          <div style={{
            textAlign:"center", padding:"28px 24px", marginBottom:14,
            background:room.winner==="spy"?"rgba(255,70,85,.1)":"rgba(0,200,100,.08)",
            border:`1.5px solid ${room.winner==="spy"?"#ff4655":"#00c864"}`
          }}>
            <div style={{ fontSize:10, letterSpacing:4, color:room.winner==="spy"?"#ff4655":"#00c864", marginBottom:10 }}>
              {room.winner==="spy"?"SPY WINS":"PLAYERS WIN"}
            </div>
            <div style={{ lineHeight:1.2, marginBottom:22 }} className="glow">
              <span style={{ fontSize:42 }}>{room.winner==="spy"?"🕵️":"🎉"}</span>
              <span style={{ fontFamily:"'Noto Sans Thai','Inter',sans-serif", fontSize:44, fontWeight:700, display:"block", marginTop:6 }}>
                {room.winner==="spy"?"SPY ชนะ!":"จับ SPY ได้!"}
              </span>
            </div>
            <div style={{ background:"rgba(0,0,0,.3)", padding:"16px", marginBottom:12 }}>
              <div className="lbl">คำที่ทุกคนได้</div>
              {getItemData(room.answer)&&<img src={getItemData(room.answer).img} alt="" style={{ width:60, height:60, objectFit:"contain", display:"block", margin:"0 auto 8px" }} onError={e=>{e.target.style.display="none";}}/>}
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:38, color:"#ffaa44", letterSpacing:3 }}>{room.answer}</div>
            </div>
            <div style={{ background:"rgba(0,0,0,.3)", padding:"14px 16px", marginBottom:20 }}>
              <div className="lbl">SPY คือ</div>
              <div style={{ fontSize:26, fontWeight:700, color:"#ff4655" }}>{room.players?.[room.spyId]?.name}</div>
              <div style={{ fontSize:14, color:"rgba(255,255,255,.35)", marginTop:4 }}>ได้คำว่า: <strong>{room.assignments?.[room.spyId]?.word}</strong></div>
              {room.spyGuess&&(
                <div style={{ marginTop:6, fontSize:15 }}>
                  เดาว่า: <strong style={{ color:room.winner==="spy"?"#00c864":"#ff4655" }}>{room.spyGuess}</strong>
                  {room.winner==="spy"?" ✓ ถูก!":" ✗ ผิด!"}
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              {isHost
                ? <button className="btn-p" onClick={startGame}>เล่นอีกรอบ!</button>
                : <div style={{ fontSize:15, color:"rgba(255,255,255,.35)", paddingTop:8 }}>รอ Host เริ่มรอบใหม่...</div>
              }
              <button className="btn-g" onClick={leaveRoom}>ออกจากห้อง</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign:"center", marginTop:24, fontSize:10, color:"rgba(255,255,255,.08)", letterSpacing:2 }}>
        VALORANT SPY HUNT · NOT AFFILIATED WITH RIOT GAMES
      </div>
    </div>
    </div>
  );
}