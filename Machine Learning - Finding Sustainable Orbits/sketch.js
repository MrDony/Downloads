let numElectrons = 10;  // number of electrons
let electrons = [];       // array to store electron objects
const vlim=20;
let winnerVel;
let winnerPos;
let generation=0;
let _frameCount=0;
let maxFrameCount=200;
const positionRandom=500;
const velocityRandom=100;

function setup() {
  createCanvas(800, 800);
  
  

  // create electrons and add them to the array
  for (let i = 0; i < numElectrons; i++) {
    winnerVel=createVector(random(-1,1),random(-1,1));
    winnerPos=createVector(random(width),random(height)); 
    //console.log(i);
    //let x="wpos:"+floor(winnerPos.x)+","+floor(winnerPos.y)+" wvel:"+floor(winnerVel.x)+","+floor(winnerVel.y);
    //console.log(x);
    let e = new Electron(winnerPos.x,winnerPos.y,winnerVel.x,winnerVel.y);
    electrons.push(e);
  }
  let s="generation : "+generation+'\n'+"frameCount : "+_frameCount;
  
  //console.log("setup() done!")
}

function generate()
{
  //console.log("generation "+(generation+1));
  generation++;
  let expLife=electrons[0].life;
  let distExp=electrons[0].dist;
  let velExp=electrons[0].vel.x+electrons[0].vel.y;
  let index=0
  for(let i=0;i<numElectrons;i++)
    {
      //find winner
      //winner if who has the longest life expectancy
      //1. was farthest from the nucleus
      //2. had the highest speed
      if(electrons[i].life>expLife)
      {
        if(electrons[i].dist>distExp)
          if(electrons[i].vel.x+electrons[i].vel.y>velExp)
            {
              expLife=electrons[i].life;
              index=i;
            }
      }
    }
  winnerVel.x=electrons[index].ivel.x;
  winnerVel.y=electrons[index].ivel.y;
  
  winnerPos.x=electrons[index].ipos.x;
  winnerPos.y=electrons[index].ipos.y;
  
  if(electrons[index].dead==0)maxFrameCount+=100;
  else maxFrameCount-=50;
  if(maxFrameCount<100)maxFrameCount=100;
  
  //destroy previous sample
  electrons.splice(0,numElectrons);
  //generate new sample
  for (let i = 0; i < numElectrons; i++) {
    let tempPos=createVector(random(-10,10), random(-10,10));
    let tempVel=createVector(random(-10,10), random(-10,10));
    //console.log(winnerVel+" "+winnerPos);
    tempPos.x=winnerPos.x+(random(-positionRandom,positionRandom))*1/maxFrameCount;
    tempPos.y=winnerPos.y+(random(-positionRandom,positionRandom))*1/maxFrameCount;
    tempVel.x=winnerVel.x+(random(-velocityRandom,velocityRandom))*1/maxFrameCount;
    tempVel.y=winnerVel.y+(random(-velocityRandom,velocityRandom))*1/maxFrameCount;
    
    let e = new Electron(tempPos.x,tempPos.y,tempVel.x,tempVel.y);
    electrons.push(e);
  }
}

function draw() {
  
  if(_frameCount==maxFrameCount)//reproduce new
  {
    generate();
    _frameCount=0;
  }
  
  background(102,110,141);
  // draw bounds
  fill(200,200,200)
  ellipse(width / 2, height / 2, height/2);
  // draw nucleus
  fill(0);
  ellipse(width / 2, height / 2, 4);
  
  
  // draw electrons
  for (let i = 0; i < numElectrons; i++) {
    let e = electrons[i];
    if(e.dead==0)
      {
        e.update();
        e.display();
      }
    //kill if out of bounds
    if(e.dist<5 || e.dist>200){e.dead=1;}
  }
  
  let s="generation "+generation+"\nframeCount "+_frameCount+"<"+maxFrameCount;
  fill(50);
  text(s, 10, 10,40,80);
  _frameCount++;
}

// Electron class
class Electron {
  //let positions=[];
  constructor(wpx,wpy,wvx,wvy) {
    // set random initial position and velocity
    this.pos = createVector(wpx,wpy);
    this.vel = createVector(wvx,wvy);
    
    //learning variables
    this.ivel=createVector(wvx,wvy);
    this.ipos=createVector(wpx,wpy);
    this.life=0;
    this.dead=0;
    this.dist=dist(this.pos.x, this.pos.y, width / 2, height / 2);
    
    //trail
    this.poss = [10];
    this.posC=40;
    for(let i=0;i<this.posC;i++)
      {
        this.poss.push(createVector(this.pos.x,this.pos.x));
      }
    
  }

  update() {
    //inc life
    this.life++;
    
    //position velocity calculation
    let d = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    this.dist=d;
    let force = -500 / (d * d);
    let angle = atan2(this.pos.y - height / 2, this.pos.x - width / 2);
    this.vel.x += force * cos(angle);
    this.vel.y += force * sin(angle);
    
    //speed limit
    if(this.vel.x>vlim)this.vel.x=vlim;if(this.vel.x<-vlim)this.vel.x=-vlim;
    if(this.vel.y>vlim)this.vel.y=vlim;if(this.vel.y<-vlim)this.vel.y=-vlim;

    // update position based on velocity
    this.pos.add(this.vel);
    
    //add to trail
    this.poss.push(createVector(this.pos.x,this.pos.y));
    //cut off oldest trail element
    if(this.poss.length>this.posC)
      {
        this.poss.splice(0,1);
      }
    
  }

  display() {
    fill(0);
    //details
    let s = floor(this.pos.x)+","+floor(this.pos.y)+"("+this.life+")";
    fill(50);
    text(s, this.pos.x+2, this.pos.y+2,40,80);
    //electron
    ellipse(this.pos.x, this.pos.y, 5);
    //trail
    for(let i=0;i<this.poss.length;i++)
      {
        ellipse(this.poss[i].x,this.poss[i].y,2);
      }
  }
  printDesc()
  {
    let s=this.life+" "+this.dead+" "+this.ipos+" "+this.ivel;
    //onsole.log(s);
  }
}
