'use strict';
$(function() {
  const form = $('#form');
  const select = $('#form-players');
  const output_template = $('#output-template');
  const output = $('#output');
  let app_data = {};
     
  loadData();
  
  output.on('click','button.result-close', function () {    
    $(this).closest('.result').remove();
  });
  
  function initFormHander() {
    form.on('submit', function(e) {
      e.preventDefault();    
      randomize(parseInt(select.val()));
    });
  }
  function randomize(players) {
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
    
    addResult(selected_heroes, map);    
  }
  
  function addResult(heroes, map) {
    let result = $(output_template.html());
    
    let output_players = result.find('.output-players');
    let output_map = result.find('.output-map');
    for (let i = 0; i < heroes.length; i++) {
      let hero = heroes[i];
      let text = 'Career ' + (i+1) + ': ' + hero.career + ' (' +  hero.hero + ')';      
      output_players.append($('<li></li>').text(text));
    }
    
    output_map.text(map);
    
    output.append(result);
  }
  
  function loadData() {
    $.ajax({
      method: 'GET',
      url: 'data.json',
      dataType: 'json',
      success: function(data) {
        app_data = data;
        //initCheckboxes();
        initFormHander();
        form.find('button').prop('disabled',false);
      }
    });        
  }
  
  function getRndInteger(max) {
    return Math.floor(Math.random() * (max));
  }
});