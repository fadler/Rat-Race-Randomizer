'use strict';
$(function() {
  const form = $('#form');
  const select = $('#form-players');
  const output_players = $('#output-players');
  const output_map = $('#output-map');
  const output = $('#output');
  let app_data = {};
     
  loadData();
  function initFormHander() {
    form.on('submit', function(e) {
      e.preventDefault();    
      randomize(parseInt(select.val()));
    });
  }
  function randomize(players) {
    output.prop('hidden',true);
    let heroes = app_data.heroes.slice(0);
    let selected_heroes = [];
    
    // select heroes for players
    for (let i = 0; i < players; i++) {
      // select a hero
      let h = getRndInteger(heroes.length);      
      let hero = heroes[h];
      //remove from array
      heroes.splice(h, 1);
      
      // select a carrer
      let c = getRndInteger(3);
      let career = hero.careers[c];      
      selected_heroes.push({hero: hero.hero, career: career});
    }    
    //select a map
    let m = getRndInteger(app_data.maps.length);
    let map = app_data.maps[m];
    
    renderResults(selected_heroes, map);    
  }
  
  function renderResults(heroes, map) {
    output_players.html('');    
    for (let i = 0; i < heroes.length; i++) {
      let hero = heroes[i];
      let text = 'Career ' + (i+1) + ': ' + hero.career + ' (' +  hero.hero + ')';      
      output_players.append($('<li></li>').text(text));
    }
    
    output_map.text(map);
    output.prop('hidden',false);
  }
  
  function loadData() {
    $.ajax({
      method: 'GET',
      url: 'data.json',
      dataType: 'json',
      success: function(data) {
        app_data = data;
        console.log(app_data);
        initFormHander();
      }
    })
  }
  
  function getRndInteger(max) {
    return Math.floor(Math.random() * (max));
  }
});