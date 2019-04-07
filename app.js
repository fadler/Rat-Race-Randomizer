'use strict';
$(function() {
  const form = $('#form');
  const form_maps = $('#form-maps');
  const form_players = $('#form-players');
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
      randomize(parseInt(form_players.val()));
    });
  }
  
  function initCheckboxes() {
    let cb_template = $('#map-cb-template');   
    for (let i = 0; i < app_data.maps.length; i++) {
      let map = app_data.maps[i];
      let cb = $(cb_template.html());      
      let id = 'map-' + i;
      cb.find('input').attr('id', id).attr('value', i);      
      cb.find('label').attr('for', id).text(map);
      form_maps.append(cb);
    }      
    
    $('#form-maps-check-all, #form-maps-uncheck-all').on('click', function(e) {
      e.preventDefault();
      let cbs = form_maps.find('input[name=map]');
      let checked = ($(this).attr('id') == 'form-maps-check-all' ? true : false);
      for (let i = 0; i < cbs.length; i++) {
        $(cbs[i]).prop('checked',checked);
      }
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
    // get checked maps
    let map_cbs = form_maps.find('input[name=map]');
    let whitelist = [];
    for (let i = 0; i < map_cbs.length; i++) {
      let map_cb = $(map_cbs[i]);
      if (map_cb.prop('checked')) {
        whitelist.push(map_cb.val());
      }
    }                   
    if (whitelist.length == 0) {
      console.error('No map selected');
      return;
    }
    
    let m = getRndInteger(whitelist.length);
    let map_index = whitelist[m]; 
    let map = app_data.maps[map_index];
    
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
        initCheckboxes();
        initFormHander();
        form.find('button').prop('disabled',false);
      }
    });        
  }
  
  function getRndInteger(max) {
    return Math.floor(Math.random() * (max));
  }
});