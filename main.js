function createPetal() {
const petal=document.createElement('div');
  petal.className="petal";
  petal.style.left=Math.random()*100+"%";
  petal.style.top="-10vh";
  petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
   petal.style.animationDelay = Math.random() * 5  + 's';
  const size = Math.random()*10+10;
  petal.style.width = size + "px"
  petal.style.height = size + "px"
  
  
  document.getElementById("sakura-container").appendChild(petal);
  setTimeout(() => petal.remove(), 10000)
  
}

setInterval(createPetal, 300);
