game.GameTimerManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;

    },
    update: function() {
        this.now = new Date().getTime();
        
        this.goldTimerCheck();
        
        this.creepTimerCheck();
        
        return true;
    },
/*
     *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
     *--------------------------- Da Timer Checks ------------------------------
     *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
     */
   goldTimerCheck: function(){
        if (Math.round(this.now / 1000) % 12 === 0 && (this.now - this.lastCreep >= 1000)) {
            game.data.gold += (game.data.exp1 + 1);
            console.log("Current gold: " + game.data.gold);
        }
        
   },
   
   creepTimerCheck: function(){
       if (Math.round(this.now / 1000) % 6 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creep = me.pool.pull("EnemyCreep", 4600, 0, {});
            me.game.world.addChild(creep, 6);
        }
   }
});

game.HeroDeathManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
    },
    
    update: function(){
        if(game.data.player.dead){
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);
        }
        return true;
    }
});

game.ExperienceManager = Object.extend({
    init:  function(x, y, settings){
    this.alwaysUpdate = true;
    this.gameover = false;
    },
    
    update: function(){
        if(game.data.win === true && !this.gameover){
            this.gameOver(true);
        }else if(game.data.win === false && !this.gameover){
             this.gameOver(false);
        }
        
        return true;
    }, 
    
    gameOver: function(win){
        
        if(win){
            game.data.exp += 100;
        }else{
            game.data.exp += 1;
        }
            
           this.gameover = true;
            me.save.exp = game.data.exp;
            console.log(me.save.exp);
            me.save.exp2 = 4;
    }
    
   
});

game.SpendGold = Object.extend({
    init:  function(x, y, settings){
      this.now = new Date().getTime();
        this.lastBuy = new Date().getTime();
        this.updateWhenPaused = true;
        this.paused = false;
        this.alwaysUpdate = true;
        this.buying = false;
    }, 
    
    update: function(){
        this.now = new Date().getTime();
        if(me.input.isKeyPressed("buy")){
            console.log(this.now-this.lastBuy);
        }
        if(me.input.isKeyPressed("buy") && this.now-this.lastBuy >= 1000){
            console.log(this.buying);
            this.lastBuy = this.now;
            if(!this.buying){
                this.startBuying();
            }else{
                this.stopBuying();
            }
            
        }
        this.checkBuyKeys();
        
        return true;
    },
    
    startBuying: function(){
        this.buying = true;
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('gold-screen'));
        game.data.buyscreen.updateWhenPaused = true;
        game.data.buyscreen.setOpacity(0.8);
        me.game.world.addChild(game.data.buyscreen, 34);
        game.data.player.body.setVelocity(0, 0);
        me.state.pause(me.state.PLAY);
        me.input.bindKey(me.input.KEY.F1, "F1", true);
        me.input.bindKey(me.input.KEY.F2, "F2", true);
        me.input.bindKey(me.input.KEY.F3, "F3", true);
        me.input.bindKey(me.input.KEY.F4, "F4", true);
        me.input.bindKey(me.input.KEY.F5, "F5", true);
        me.input.bindKey(me.input.KEY.F6, "F6", true);
        
        this.setBuyText();
        
    },
    
    setBuyText: function(){
        game.data.buytext = new (me.Renderable.extend({
                   init: function(){
                       this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 1, 1]);
                       this.font = new me.Font("Arial", 46, "white");
                       this.updateWhenPaused = true;
                       this.alwaysUpdate = true;
                   },
                   
                   draw: function(renderer){
                       this.font.draw(renderer.getContext(), "#~Aw-sean-auts~#" + game.data.gold, this.pos.x, this.pos.y);
                       this.font.draw(renderer.getContext(), "Current Gold: ", this.pos.x + 700, this.pos.y);
                       this.font.draw(renderer.getContext(), "Damage: "+ game.data.skill1, "Cost: "+ ((game.data.skill1)* 10) , this.pos.x + 320, this.pos.y + 80);
                       this.font.draw(renderer.getContext(), "Speed: "+ game.data.skill2, "Cost: "+ ((game.data.skill2)* 10), this.pos.x + 320, this.pos.y + 160);
                       this.font.draw(renderer.getContext(), "Health: "+ game.data.skill3, "Cost: "+ ((game.data.skill3)* 10), this.pos.x + 320, this.pos.y + 240);
                       this.font.draw(renderer.getContext(), "U ~ Speed Burst: "+ game.data.ability1, "Cost: "+ ((game.data.ability1)*10), this.pos.x + 320, this.pos.y + 320);
                       this.font.draw(renderer.getContext(), "I ~ Eat Creep"+ game.data.ability2, "Cost: "+ ((game.data.ability2)* 10), this.pos.x + 320, this.pos.y+ 400);
                       this.font.draw(renderer.getContext(), "O ~ Throw Spear"+ game.data.ability3, "Cost: "+ ((game.data.ability3)* 10), this.pos.x + 320, this.pos.y + 480);
                       
                      
                       
                   }
                   
                
               }));
               
               me.game.world.addChild(game.data.buytext, 35);
    },
    
    stopBuying: function(){
        this.buying = false;
        me.state.resume(me.state.PLAY);
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.world.removeChild(game.data.buyscreen);
        
        me.input.unbindKey(me.input.KEY.F1, "F1", true);
        me.input.unbindKey(me.input.KEY.F2, "F2", true);
        me.input.unbindKey(me.input.KEY.F3, "F3", true);
        me.input.unbindKey(me.input.KEY.F4, "F4", true);
        me.input.unbindKey(me.input.KEY.F5, "F5", true);
        me.input.unbindKey(me.input.KEY.F6, "F6", true);
        
        me.game.world.removeChild(game.data.buytext);
    },
    
    ckeckBuyKeys: function(){
        if(me.input.isKeyPressed("F1")){
            if(this.checkCost(1)){
                this.makePurchase(1);
            }
        }else if(me.input.isKeyPressed("F2")){
            if(this.checkCost(2)){
                this.makePurchase(2);
            }
        }else if(me.input.isKeyPressed("F3")){
            if(this.checkCost(3)){
                this.makePurchase(3);
            }
        }else if(me.input.isKeyPressed("F4")){
            if(this.checkCost(4)){
                this.makePurchase(4);
            }
        }else if(me.input.isKeyPressed("F5")){
            if(this.checkCost(5)){
                this.makePurchase(5);
            }
        }else if(me.input.isKeyPressed("F6")){
            if(this.checkCost(6)){
                this.makePurchase(6);
            }
        }
    },
    
    checkCost: function(skill){
        if(skill===1 && (game.data.gold >= ((game.data.skill1)* 10))){
            return true;
        }else if(skill===2 && (game.data.gold >= ((game.data.skill2)* 10))){
            return true;
        }else if(skill===3 && (game.data.gold >= ((game.data.skill3)* 10))){
            return true;
        }else if(skill===4 && (game.data.gold >= ((game.data.ability1)* 10))){
            return true;
        }else if(skill===5 && (game.data.gold >= ((game.data.ability2)* 10))){
            return true;
        }else if(skill===6 && (game.data.gold >= ((game.data.ability3)* 10))){
            return true;
        }else{
            return false;
        }
    },
    
    makePurchase: function(skill){
        if(skill===1){
            game.data.gold -= ((game.data.skill1 +1)* 10);
            game.data.skill1 += 1;
            game.data.playerAttack += 1;
        }else if(skill === 2){
            game.data.gold -= ((game.data.skill2 +1)* 10);
            game.data.skill2 += 1;
        }else if(skill === 3){
            game.data.gold -= ((game.data.skill3 +1)* 10);
            game.data.skill3 += 1;
        }else if(skill === 4){
            game.data.gold -= ((game.data.ability1 +1)* 10);
            game.data.ability1 += 1;
        }else if(skill === 5){
            game.data.gold -= ((game.data.ability2 +1)* 10);
            game.data.ability2 += 1;
        }else if(skill === 6){
            game.data.gold -= ((game.data.ability3 +1)* 10);
            game.data.ability3 += 1;
        }
    }
});