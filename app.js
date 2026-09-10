const API_URL="http://127.0.0.1:8000";
let mode="general",history=[];
const chat=document.getElementById("chat"),input=document.getElementById("input"),title=document.getElementById("title");
const titles={general:"How can I help?",school:"Let's learn something.",programming:"Let's build something."};

function add(role,text){
  const x=document.createElement("div");
  x.className="message";
  const avatar=document.createElement("div");
  avatar.className="avatar"; avatar.textContent=role==="user"?"You":"E";
  const bubble=document.createElement("div");
  bubble.className="bubble"; bubble.textContent=text;
  x.append(avatar,bubble); chat.appendChild(x); chat.scrollTop=chat.scrollHeight;
}
function reset(){history=[];chat.innerHTML="";title.textContent=titles[mode]}

document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>{
  mode=b.dataset.mode;
  document.querySelectorAll(".mode").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); title.textContent=titles[mode];
});
document.querySelectorAll(".chips button").forEach(b=>b.onclick=()=>{input.value=b.dataset.p;input.focus()});
document.getElementById("newChat").onclick=reset;
document.getElementById("clear").onclick=reset;

input.oninput=()=>{
  input.style.height="auto";
  input.style.height=Math.min(input.scrollHeight,180)+"px";
};

document.getElementById("form").onsubmit=async e=>{
  e.preventDefault();
  const message=input.value.trim();
  if(!message)return;
  document.querySelector(".welcome")?.remove();
  add("user",message);
  history.push({role:"user",content:message});
  input.value="";

  add("assistant","Thinking…");
  const thinking=chat.lastElementChild;

  try{
    const r=await fetch(API_URL+"/chat",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message,mode,history:history.slice(-20)})
    });
    const data=await r.json();
    thinking.remove();
    if(!r.ok)throw new Error(data.detail||"Request failed");
    add("assistant",data.reply);
    history.push({role:"assistant",content:data.reply});
  }catch(err){
    thinking.remove();
    add("assistant","I couldn't connect to the Ethan AI backend. "+err.message);
  }
};
