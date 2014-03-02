// GLOBALS  
var moduleDelay = 0.4,
	pageData = {
		fold: undefined,
		resizeReInitTO: undefined,
		modules: [],
		hiddenModules: []

	},

	isTouch = Modernizr.touch,

	DOMeles = {
		win: undefined,
		body: undefined,
		wrapper: undefined
	},

	bowie = [
		'london boy',
		'space oddity',
		'the man who sold the world',
		'hunky dory',
		'the rise and fall of ziggy stardust and the spiders from mars',
		'aladdin sane',
		'pin ups',
		'diamond dogs',
		'david live: at the tower theatre philadelphia',
		'young americans',
		'station to station',
		'low',
		'heroes',
		'stage',
		'lodger',
		'scary monsters',
		'let\'s dance',
		'tonight',
		'never let me down',
		'black tie white noise',
		'outside',
		'earthling',
		'hours',
		'heathen',
		'reality',
		'the next day',
		'david bowie',
		'tin machine'
	];


// OBJECTS 

	var Page_helper = {

		Init: function(){
			//cache jq selectors for popular elements
			DOMeles.win = $(window);
			DOMeles.body = $('body');
			DOMeles.wrapper = $('#wrapper');
			DOMeles.footer = $('#footer');

			//set global stats
			pageData.fold = DOMeles.win.height();


			//We need to set a height on the dummy footer
			$('#footer-spacer').height( DOMeles.footer.outerHeight() );


			// -- init and collect data on modules -- //

			//init first module
			Module.Intro.Init( $('#sec-intro') );

			//collect position data etc
			$('section.section').each(function(i){

				var posT = $(this).offset().top,
					id = $(this).attr('id'), 
					shouldShow = ( $(this).offset().top <= pageData.fold + DOMeles.win.scrollTop() || isTouch );


				//add data to modules array
				pageData.modules.push( {id: id, pos: posT, showing: false} );

				//if not above fold add to hidden array
				if(!shouldShow)
					pageData.hiddenModules.push( {id: id, pos: posT} );

				//Init
				Module.Init( $(this), shouldShow );

			});



			// -- Bind Events -- //

			DOMeles.win.scroll(function(){

				if(!isTouch){

					var sT = $(this).scrollTop(),
						hiddenMs = pageData.hiddenModules,
						fold = pageData.fold + sT;

					//loop through currently hidden modules
					for(i in hiddenMs){

					 	//if module comes above fold. run it's start function
					 	if(hiddenMs[i].pos <= fold){

					 		//show module
							Module.Start(hiddenMs[i].id);	
							//remove from array
							pageData.hiddenModules.splice(i, 1);	 		
					 	}

					}

				}

			})

			.resize(function(){
				//clear any resize events called in the last 200ms
		        clearTimeout(pageData.resizeReInitTO);

		     		pageData.resizeReInitTO = setTimeout(function(){ 

		            Page_helper.Kill(true);

		        },200);

			});

		},

		Start: function(){



		},

		Kill: function(restart){

			//kill and sections that need it
			Module.Intro.Kill($('#sec-intro'));

			//clear mod arrays
			pageData.modules = [];
			pageData.hiddenModules = [];

			//clear event bindings
			DOMeles.win.unbind('scroll');

			if(restart)
				Page_helper.Init();

		}

	} 


	var Module = {

		Init: function(module, startAfter){

			//bind events


			//if above the fold, start
			if(startAfter)
				Module.Start(module);
		},

		Start: function(module){
			//an id(Str) might be passed instead on a JQ obj. if so, build object
			if(typeof module === 'string')
				module = $('#'+module);

			var showModules = new TimelineLite();

			showModules.to(module, .15, {autoAlpha: 1});

			showModules.to(module, .3, {y: 0, ease:Power1.easeOut, onComplete: function(){

				//set global to showing
				var id = module.attr('id'),
				index = getIndexIfObjWithAttr(pageData.modules, 'id', id);

				pageData.modules[index].showing = true;

				module.removeClass('hide');

				//functions for specific module types
				if(id == 'sec-intro'){

					Module.Intro.Init(module, true);
				}else if(id == 'sec-skills'){

					Module.Skills.Init(module, true);
				}else if(id == 'sec-work'){

					Module.Work.Init(module, true);
				}else if(id == 'sec-contact'){

					Module.Contact.Init(module, true);
				}
	

				}
			}, '-=0.15');

		},

		Pause: function(module){

		},

		Stop: function(module){

		},

		Kill: function(module){

		},

		Intro: {

			Init: function(module, startAfter){

				module.height( pageData.fold );

				//set text in middle
				var hello = module.children('p.largest'),
					imNathan = module.children('h1');


				//find height of copy in intro sec
				hello.css('padding-top', 0);
				var textH = hello.outerHeight(true) + imNathan.outerHeight(true),
					paddingT = ((pageData.fold - textH) / 2)* 0.95;

				hello.css('padding-top', paddingT);

				if(startAfter)
					Module.Intro.Start(module);
			},

			Start: function(module){

				var introAni = new TimelineLite();

				introAni.to(module.children('p.largest'), .5, {opacity: 1, y: 0});

				introAni.to(module.children('h1'), .5, {opacity: 1, y: 0}, '+=0.4');

			},

			Kill: function(module){

				//reset Title state
				//TweenLite.to(module.children('p.largest'), 0, {paddingTop: 0});

			}

		},

		Skills: {

			Init: function(module, startAfter){

				if(startAfter)
					Module.Skills.Start(module);
			},

			Start: function(module){

				var skillsAni = new TimelineLite(),
					d = 0.1;

				skillsAni.pause();

				module.children('ul.skills-grid').children('li').each(function(i){

					var offset = (i == 0)? '' : '-='+d;

					skillsAni.to($(this), .2, {opacity: 1, scale: 1, ease: Power2.easeOut},offset);

				});

				skillsAni.play();
			}

		},

		Work: {

			Init: function(module, startAfter){

				//bind events
				module.children('ul.work-grid').on({
					mouseenter: function () {

						var rO = $(this).children('a.work-hero').children('span.rollover');

						var workOver = new TimelineLite();
						
						workOver.to(rO, .3, {opacity: 1, scale: 1, ease: Power2.easeOut});
						
						workOver.to(rO.children('span'), .2, {y: 0, opacity: 1, ease: Power2.easeOut},'-=0.1');

					},

					mouseleave: function () {

						var rO = $(this).children('a.work-hero').children('span.rollover');

						var workOut = new TimelineLite();
						
						workOut.to(rO.children('span'), .2, {y: '20px', opacity: 0, ease: Power2.easeOut});
						
						workOut.to(rO, .3, {opacity: 0, scale: 0.7, ease: Power2.easeOut}, '-=0.1');

					}

				},'li');


				if(startAfter)
					Module.Work.Start(module);
			},

			Start: function(module){

				var workAni = new TimelineLite(),
					d = 0.1;

				workAni.pause();

				module.children('ul.work-grid').children('li').each(function(i){

					var offset = (i == 0)? '' : '-='+d;

					workAni.to($(this), .3, {opacity: 1, scale: 1, ease: Power2.easeOut},offset);

				});

				workAni.play();
			}

		},


		Contact: {

			Init: function(module, startAfter){

				//bind events
				var form = $('#contact-form');
				
				form.on('focus', 'input, textarea', function(){

					var $input = $(this);
					
					if( $input.val() == '' ){

						var $label = $input.siblings('label'),
							offsetT = ( $input.is('input') )? '-30px' : '-34px',
							offsetL = ( $input.is('input') )? '-2px' : '-5px',
							focusAni = new TimelineLite();

						//test questions need different offset
						if($input.is('#form-test')){
							offsetL = '-10px';
						}


						focusAni.to($label, .1, {opacity: 0, onComplete: function(){
								//get label ready for second half on animation
								TweenLite.to($label, 0, {scale: 0.85, x: offsetL});
							}
						});

						focusAni.to($label, .25, {y: offsetT, opacity: 1, color: '#42B69A'});

					}

				})
				.on('blur', 'input, textarea', function(){

					var $input = $(this);
					
					if( $input.val() == '' ){

						var $label = $input.siblings('label');

						var blurAni = new TimelineLite();

						blurAni.to($label, .25, {y: 0, color: '#BFBEBF', opacity: 0, onComplete: function(){
							//get label ready for second half on animation
							TweenLite.to($label, 0, {x: 0, scale: 1});
						}});

						blurAni.to($label, .15, {opacity: 1});


					}

				});

				$('#form-send').click(function(e){
					e.preventDefault();

					var formArgs = {
						name: form.find('#form-name').val(),
						email: form.find('#form-email').val(),
						msg: form.find('#form-msg').val(),
						test: form.find('#form-test').val() 
					};

					Module.Contact.Validate_form(formArgs);

				});

				if(startAfter)
					Module.Contact.Start(module);
			},

			Start: function(module){


			},

			Validate_form: function(formArgs){

	            $('input.error, textarea.error').removeClass('error');

	            var error = false;

	            if( formArgs.name == '' ){
	            	error = true;
	                $('#form-name').addClass('error');
	            }

	            if( formArgs.email == '' || !validateEmail( formArgs.email ) ){
	            	error = true;
	                $('#form-email').addClass('error');
	            }

	            if( formArgs.msg == '' ){
	            	error = true;
	                $('#form-msg').addClass('error');
	            }


	            if( formArgs.test == '' || bowie.indexOf( formArgs.test.toLowerCase() ) == -1 ){
	               	error = true;
	                $('#form-test').addClass('error');
	            }


	            if( !error){

	                Module.Contact.Post_form(formArgs);
	            }else{
	                return false;
	            }
			},

			Post_form: function(formArgs){

				$.post(
					window.baseUrl+'contact.php',
					{
						'contact-name': formArgs.name,
						'contact-email': formArgs.email,
						'contact-message': formArgs.msg
					},
					function(){

						$('#contact-form').children('p.notif').show();

					}
				);


			}

		}


	};



function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function getIndexIfObjWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i++) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



$(document).ready(function(){

	//looks a bit nicer on mobile if you wait a little
	var initTO = (isTouch)? 500 : 0;
	
	setTimeout(function(){
		Page_helper.Init();
	},initTO);

});



// ----- ANGULAR ----- //

var app = angular.module('nathanApp', [])

app.controller('projectsController', function($scope){

	$scope.projects = [
		{'id': 1, 'name': 'Draftfcb', 'url': 'http://draftfcb.co.uk/', 'img': 'assets/img/work/draft.jpg'},
		{'id': 2, 'name': 'Lovespace', 'url': 'http://Lovespace.co.uk/', 'img': 'assets/img/work/lovespace.jpg'},
		{'id': 3, 'name': 'The Guardian #localshopping', 'url': 'http://www.theguardian.com/lifeandstyle/interactive/2012/dec/08/local-shopping-map-photos-twitter-instagram', 'img': 'assets/img/work/localshopping.jpg'},
		{'id': 4, 'name': 'Guardian #gdngig', 'url': 'http://www.theguardian.com/music/interactive/2012/nov/23/live-music-map-gig-photos-twitter', 'img': 'assets/img/work/gdngig.jpg'},
		{'id': 5, 'name': 'Victorian Woodworks', 'url': 'http://victorianwoodworks.co.uk/', 'img': 'assets/img/work/vw.jpg'},
		{'id': 6, 'name': 'Cogs Agency', 'url': 'http://www.cogsagency.com/', 'img': 'assets/img/work/cogs.jpg'},
		{'id': 7, 'name': 'The Creative Directory', 'url': 'http://thecreativedirectory.com/', 'img': 'assets/img/work/tcd.jpg'},
		{'id': 8, 'name': 'Jaguar Desire Poster Competion', 'url': 'http://postercompetition.f-type.com/en_GB/', 'img': 'assets/img/work/jaguar.jpg'},
		{'id': 9, 'name': 'Action for Happines', 'url': 'http://actionforhappiness.org/', 'img': 'assets/img/work/action-for-happiness.jpg'}

	];

});

