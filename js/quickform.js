/*********************************************************************
**																	**
**	Description:													**
**		QuickForms - jQuery plugin for creating quick and easy		**
**		online forms or pages. Includes Easy navigation via			**
**		links or breadcrumbs system, printing and minor	field		**
**		validation plus more...										**
**																	**
**	Author:															**
**		James Cox       											**
**																	**
**	Version:														**
**		v1.1														**
**																	**
*********************************************************************/

(function( $ ){
	var methods = {
		settings: {
					'header':			true,																	// 0
					'formTitle':		'myForm',																// 1
					'pageMenu':			true,																	// 2
					'nextTxt':			'Next',																	// 3
					'prevTxt':			'Previous',																// 4
					'submitTxt':		'Submit',																// 5
					'navTxt':			'Page',																	// 6
					'pageWidth':		'700px',																// 7
					'pageHeight':		'400px',																// 8
					'FXSpeed':			500,																	// 9
					'submitForm':		'thisForm',																// 10
					'breadcrumb':		false,																	// 11
					'breadcrumbTxt':	'Page',																	// 12
					'submitYN':			true,																	// 13
					'radioYesTxt':		'Yes',																	// 14
					'radioNoTxt':		'No',																	// 15
					'autoHeight':		false,																	// 16
					'footer':			true,																	// 17
					'menuNav':			false,																	// 18
					'report':			false,																	// 19
					'reportSectioned':	false,																	// 20
					'reportPrint':		false,																	// 21
					'reportPrintTxt':	'Print',																// 22
					'reportNavTxt':		'Report',																// 23
					'mobilePageW':		'',																		// 24
					'mobilePageH':		'',																		// 25
					'mobileCSS':		'css/quickFormsMobile.css',												// 26
					'desktopCSS':		'css/quickFormsDesktop.css',											// 27
					'autoRun':			false,																	// 28
					'autoRunDelay':		3000,																	// 29
					'footerType':		'nav',																	// 30
					'footerContent':	'<p>QuickForms by James Cox</p>'                                		// 31
		},
		init: function( option ){
			return this.each(function(){
				//Plugin Variables
				var settingsExt = $.extend(methods.settings, option);
				var mySettings = $.map(settingsExt, function(key, value){ return key; });
				var $this = $(this);
				var divs = $this.children('div');
				var divLen = divs.length;
				var reportLen = parseInt(divs.length) + 1;
				var subPage = $this.find('.QFsubPage');
				var spLength = subPage.length;
				var isMobile = {
					Android: function() {
						return navigator.userAgent.match(/Android/i);
					},
					BlackBerry: function() {
						return navigator.userAgent.match(/BlackBerry/i);
					},
					iOS: function() {
						return navigator.userAgent.match(/iPhone|iPad|iPod/i);
					},
					Opera: function() {
						return navigator.userAgent.match(/Opera Mini/i);
					},
					Windows: function() {
						return navigator.userAgent.match(/IEMobile/i);
					},
					any: function() {
						return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
					}
				};
				var ie = (function(){
					var undef;
					var v = 3;
					var div = document.createElement('div');
					var all = div.getElementsByTagName('i');
					while (
						div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
						all[0]
					);
					return v > 4 ? v : undef;
                }());
                var getUrl = function(){
                    var vars = [], hash;
                    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                    for(var i = 0; i < hashes.length; i++){
                        hash = hashes[i].split('=');
                        vars.push(hash[0]);
                        vars[hash[0]] = hash[1];
                    }
                    return vars;
                }
				
				//Setup Page
				if(mySettings[0] == true){
					if(mySettings[21] == false){
						$this.prepend('<div id="QFTitle"><h1>' + mySettings[1] + '</h1></div>');
					} else {
						$this.prepend('<div id="QFTitle"><h1>' + mySettings[1] + '</h1><p class="QFPrint">' + mySettings[22] + '</p></div>');
					}
					if(mySettings[2] == true){
						if(mySettings[11] == false){
							$('#QFTitle').append('<ul id="QFNav"></ul>');
							divs.each(function(index, value){
								if(!$(this).attr('title')){
									var QFNavTitle = mySettings[6] + ' ' + parseInt(index + 1);
								} else {
									var QFNavTitle = $(this).attr('title');
								}
								if(index == 0){
									$('#QFNav').append('<li id="QFMenu0" class="firstMenu menuActive QFMenu"><p>' + QFNavTitle + '</p></li>');
								} else {
									if(index == parseInt(divLen - 1)){
										if(mySettings[19] == false){
											$('#QFNav').append('<li id="QFMenu' + index + '" class="lastMenu QFMenu"><p>' + QFNavTitle + '</p></li>');
										} else {
											$('#QFNav').append('<li id="QFMenu' + index + '" class="QFMenu"><p>' + QFNavTitle + '</p></li>');
										}
									} else {
										$('#QFNav').append('<li id="QFMenu' + index + '" class="QFMenu"><p>' + QFNavTitle + '</p></li>');
									}
								}
							});
							if(mySettings[19] == true){
								$('#QFNav').append('<li id="QFMenu' + divLen + '" class="QFMenu lastMenu"><p>' + mySettings[23] + '</p></li>');
							}
						} else {
							if(mySettings[19] == false){
								$('#QFTitle').append('<p id="QFbreadcrumbs">' + mySettings[12] + ' <span class="QFbreadcrumbs">1</span> of ' + divLen);
							} else {
								$('#QFTitle').append('<p id="QFbreadcrumbs">' + mySettings[12] + ' <span class="QFbreadcrumbs">1</span> of ' + reportLen);
							}
						}
					}
				}
				if(mySettings[19] == false){
					if(mySettings[18] == false || getUrl()["page"] == '' || getUrl()["page"] == 'undefined' || getUrl()["page"] == null){
						divs.each(function(index, value){
							if(index == 0){
								$(this).addClass('firstPage QFActive QFPage QFPage0');
							} else {
								$(this).addClass('QFPage QFPage' + index);
								$(this).css('display', 'none');
							}
							if(index == parseInt(divLen - 1)){
								$(this).addClass('lastPage');
							}
						});
					} else {
						divs.each(function(index, value){
							if(index == 0){
								$(this).addClass('firstPage QFActive QFPage QFPage0');
								$(this).css('display', 'none');
							} else {
								$(this).addClass('QFPage QFPage' + index);
								$(this).css('display', 'none');
							}
							if(index == parseInt(divLen - 1)){
								$(this).addClass('lastPage');
							}
						});
					}
				} else {
					$this.append('<div title="' + mySettings[23] + '" class="QFPage QFPage' + divLen + ' lastPage reportPage"></div>');
					if(mySettings[18] == false || getUrl()["page"] == ''){
						divs.each(function(index, value){
							if(index == 0){
								$(this).addClass('firstPage QFActive QFPage QFPage0');
							} else {
								$(this).addClass('QFPage QFPage' + index);
								$(this).css('display', 'none');
							}
						});
					} else {
						divs.each(function(index, value){
							if(index == 0){
								$(this).addClass('firstPage QFActive QFPage QFPage0');
								$(this).css('display', 'none');
							} else {
								$(this).addClass('QFPage QFPage' + index);
								$(this).css('display', 'none');
							}
						});
					}
					$('.reportPage').css('display', 'none');
				}
				if(mySettings[17] == true){
					if(mySettings[30] == 'nav'){
						$this.append('<div id="QFButtons"><p id="QFPrev">' + mySettings[4] + '</p><p id="QFNext">' + mySettings[3] + '</p><p id="QFSubmit">' + mySettings[5] + '</p></div>');
					}
					if(mySettings[30] == 'desc'){
						$this.append('<div id="QFButtons">' + mySettings[31] + '</div>');
					}
				}
				
				methods.recall.call(this, option);
				
				if(mySettings[19] == true){
					if(mySettings[20] == false){
						var fields = $this.find('label');
						$('.reportPage').append('<table id="reportTable"></table>');
						fields.each(function(index){
							if($(this).attr('for') != 'QFsubPageRadio'){
								var myID = $(this).attr('for');
								$('#reportTable').append('<tr><td><p>' + $(this).text() + '</p></td><td><p id="' + myID + '1"></p></td></tr>');
							}
						});
					} else {
						divs.each(function(){
							$('.reportPage').append('<table class="reportTable activeReportTable"></table>');
							$('.activeReportTable').append('<tr><td colspan="2"><h1>' + $(this).attr('title') + '</h1></td></tr>');
							var fields = $(this).find('label');
							fields.each(function(index){
								if($(this).attr('for') != 'QFsubPageRadio' && $(this).attr('for') != null){
									var myID = $(this).attr('for');
									$('.activeReportTable').append('<tr><td><p>' + $(this).text() + '</p></td><td><p id="' + myID + '1"></p></td></tr>');
								}
							});
							$('.activeReportTable').removeClass('activeReportTable');
						});
					}
				}
				
				if(mySettings[18] == true){
					$('.QFMenu').css('cursor', 'pointer');
					$('.QFMenu').click(function(){
						var hash = $(this).text().replace(/\s+/g, '');
						var hash = hash.replace(/[^a-zA-Z 0-9]+/g, '');
						if(!$(this).hasClass('menuActive')){
							if($(this).hasClass('lastMenu')){
								if(mySettings[19] == false){
									if(!ie){
										history.pushState({page: hash}, hash, "?page=" + hash);
									}
									var id = $(this).attr('id').split('QFMenu');
									$('.QFActive').hide('fade', {}, mySettings[9]).removeClass('QFActive');
									$this.find('.QFPage' + id[1]).delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
									$('.menuActive').removeClass('menuActive');
									$(this).addClass('menuActive');
									if($('#QFNext').css('display', 'block')){
										$('#QFNext').hide('fade', {}, mySettings[9]);
									}
									if($('#QFSubmit').css('display', 'none')){
										$('#QFSubmit').delay(mySettings[9]).show('fade', {}, mySettings[9]);
									}
									if($('#QFPrev').css('display', 'none')){
										$('#QFPrev').delay(mySettings[9]).show('fade', {}, mySettings[9]);
									}
								} else {
									if(!ie){
										history.pushState({page: hash}, hash, "?page=" + hash);
									}
									var labels = $this.find('label');
									labels.each(function(){
										var myID = $(this).attr('for');
										$('.' + myID).each(function(){
											if($(this).attr('type') == 'radio' && $(this).is(':checked')){
												var myVal = $(this).val();
												if($('#' + myID + '1').is(':empty')){
													$('#' + myID + '1').text(myVal);
												} else {
													var currentTxt = $('#' + myID + '1').text();
													$('#' + myID + '1').text(currentTxt + ' ' + myVal);
												}
											}
											if($(this).attr('type') == 'checkbox' && $(this).is(':checked')){
												var myVal = $(this).val();
												if($('#' + myID + '1').is(':empty')){
													$('#' + myID + '1').text(myVal);
												} else {
													var currentTxt = $('#' + myID + '1').text();
													$('#' + myID + '1').text(currentTxt + ' ' + myVal);
												}
											}
											if($(this).attr('type') != 'radio'){
												var myVal = $(this).val();
												if($('#' + myID + '1').is(':empty')){
													$('#' + myID + '1').text(myVal);
												} else {
													var currentTxt = $('#' + myID + '1').text();
													$('#' + myID + '1').text(currentTxt + ' ' + myVal);
												}
											}
										});
									});
									var id = $(this).attr('id').split('QFMenu');
									$('.QFActive').hide('fade', {}, mySettings[9]).removeClass('QFActive');
									$this.find('.QFPage' + id[1]).delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
									$('.menuActive').removeClass('menuActive');
									$(this).addClass('menuActive');
									if($('#QFNext').css('display', 'block')){
										$('#QFNext').hide('fade', {}, mySettings[9]);
									}
									if($('#QFSubmit').css('display', 'none')){
										$('#QFSubmit').delay(mySettings[9]).show('fade', {}, mySettings[9]);
									}
									if($('#QFPrev').css('display', 'none')){
										$('#QFPrev').delay(mySettings[9]).show('fade', {}, mySettings[9]);
									}
								}
							}
							if($(this).hasClass('firstMenu')){
								if(!ie){
									history.pushState({page: hash}, hash, "?page=" + hash);
								}
								var id = $(this).attr('id').split('QFMenu');
								$('.QFActive').hide('fade', {}, mySettings[9]).removeClass('QFActive');
								$this.find('.QFPage' + id[1]).delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
								$('.menuActive').removeClass('menuActive');
								$(this).addClass('menuActive');
								if($('#QFSubmit').css('display', 'block')){
									$('#QFSubmit').hide('fade', {}, mySettings[9]);
								}
								if($('#QFNext').css('display', 'none')){
									$('#QFNext').delay(mySettings[9]).show('fade', {}, mySettings[9]);
								}
								if($('#QFPrev').css('display', 'block')){
									$('#QFPrev').hide('fade', {}, mySettings[9]);
								}
							}
							if(!$(this).hasClass('firstMenu') && !$(this).hasClass('lastMenu')){
								if(!ie){
									history.pushState({page: hash}, hash, "?page=" + hash);
								}
								var id = $(this).attr('id').split('QFMenu');
								$('.QFActive').hide('fade', {}, mySettings[9]).removeClass('QFActive');
								$this.find('.QFPage' + id[1]).delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
								$('.menuActive').removeClass('menuActive');
								$(this).addClass('menuActive');
								if($('#QFSubmit').css('display', 'block')){
									$('#QFSubmit').hide('fade', {}, mySettings[9]);
								}
								if($('#QFNext').css('display', 'none')){
									$('#QFNext').delay(mySettings[9]).show('fade', {}, mySettings[9]);
								}
								if($('#QFPrev').css('display', 'none')){
									$('#QFPrev').delay(mySettings[9]).show('fade', {}, mySettings[9]);
								}
							}
						}
					});
					
					// function getUrl(){
					// 	var vars = [], hash;
					// 	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
					// 	for(var i = 0; i < hashes.length; i++){
					// 		hash = hashes[i].split('=');
					// 		vars.push(hash[0]);
					// 		vars[hash[0]] = hash[1];
					// 	}
					// 	return vars;
					// }
					
					if(getUrl()["page"]){
						loadPage();
					}
					
					if(!ie){
						window.onpopstate = function(e){
							if(e.state){
								if(getUrl()["page"] != '' || getUrl()["page"] != 'undefined' || getUrl()["page"] != null){
									loadPage();
								}
							} else {
								if(!getUrl()["page"]){
									if($('.firstPage').css('display') != 'block'){
										var title = $('.firstPage').attr('title').replace(/\s+/g, '');
										var title = title.replace(/[^a-zA-Z 0-9]+/g, '');
										$('.QFActive').hide('fade', {}, mySettings[9]).removeClass('QFActive');
										$('.firstPage').delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
										$('.menuActive').removeClass('menuActive');
										$.each($('.QFMenu'), function(index2, value2){
											var title2 = $(value2).text().replace(/\s+/g, '');
											var title2 = title2.replace(/[^a-zA-Z 0-9]+/g, '');
											if(title == title2){
												$(value2).addClass('menuActive');
											}
										});
										if($('#QFSubmit').css('display', 'block')){
											$('#QFSubmit').hide('fade', {}, mySettings[9]);
										}
										if($('#QFNext').css('display', 'none')){
											$('#QFNext').delay(mySettings[9]).show('fade', {}, mySettings[9]);
										}
										if($('#QFPrev').css('display', 'block')){
											$('#QFPrev').hide('fade', {}, mySettings[9]);
										}
									}
								}
							}
						}
					}
					
					function loadPage(){
						var nav = getUrl()["page"];
						$.each($('.QFPage'), function(index, value){
							var title = $(value).attr('title').replace(/\s+/g, '');
							var title = title.replace(/[^a-zA-Z 0-9]+/g, '');
							if(nav == title){
								$('.QFActive').hide('fade', {}, mySettings[9]).removeClass('QFActive');
								$(value).delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
								$('.menuActive').removeClass('menuActive');
								$.each($('.QFMenu'), function(index2, value2){
									var title2 = $(value2).text().replace(/\s+/g, '');
									var title2 = title2.replace(/[^a-zA-Z 0-9]+/g, '');
									if(nav == title2){
										$(value2).addClass('menuActive');
									}
								});
								if($(value).hasClass('firstPage')){
									if($('#QFSubmit').css('display', 'block')){
										$('#QFSubmit').hide('fade', {}, mySettings[9]);
									}
									if($('#QFNext').css('display', 'none')){
										$('#QFNext').delay(mySettings[9]).show('fade', {}, mySettings[9]);
									}
									if($('#QFPrev').css('display', 'block')){
										$('#QFPrev').hide('fade', {}, mySettings[9]);
									}
								}
								if($(value).hasClass('lastPage')){
									if($('#QFSubmit').css('display', 'none')){
										$('#QFSubmit').show('fade', {}, mySettings[9]);
									}
									if($('#QFNext').css('display', 'block')){
										$('#QFNext').delay(mySettings[9]).hide('fade', {}, mySettings[9]);
									}
									if($('#QFPrev').css('display', 'none')){
										$('#QFPrev').show('fade', {}, mySettings[9]);
									}
								}
								if(!$(value).hasClass('firstPage') && !$(value).hasClass('lastPage')){
									if($('#QFSubmit').css('display', 'block')){
										$('#QFSubmit').hide('fade', {}, mySettings[9]);
									}
									if($('#QFNext').css('display', 'none')){
										$('#QFNext').delay(mySettings[9]).show('fade', {}, mySettings[9]);
									}
									if($('#QFPrev').css('display', 'none')){
										$('#QFPrev').delay(mySettings[9]).show('fade', {}, mySettings[9]);
									}
								}
							}
						});
					}
				}
				
				if(mySettings[28] == true){
					playLoop();
				}
				function playLoop(){
					setTimeout(function(){
						autoPlay();
					}, mySettings[29]);
				}
				function autoPlay(){
					methods.next.call(this, option);
					if(!$('.QFActive').hasClass('lastPage')){
						playLoop();
					} else {
						setTimeout(function(){
							$('.QFActive').hide('fade', {}, mySettings[9]).removeClass('QFActive');
							$this.find('.QFPage0').delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
							$('.menuActive').removeClass('menuActive');
							if(mySettings[11] == false){
								$('#QFMenu0').addClass('menuActive');
							} else {
								$('.QFbreadcrumbs').text('1');
							}
							if($('#QFSubmit').css('display', 'block')){
								$('#QFSubmit').hide('fade', {}, mySettings[9]);
							}
							if($('#QFNext').css('display', 'none')){
								$('#QFNext').delay(mySettings[9]).show('fade', {}, mySettings[9]);
							}
							if($('#QFPrev').css('display', 'block')){
								$('#QFPrev').hide('fade', {}, mySettings[9]);
							}
							playLoop();
						}, mySettings[29]);
					}
				}
				
				$('.QFvalidate').focus(function(){
					$(this).removeClass('validateFail QFvalidateError');
				});
				$('#QFNext').click(function(){
					methods.next.call(this, option);
				});
				$('#QFPrev').click(function(){
					methods.prev.call(this, option);
				});
				$('#QFSubmit').click(function(){
					methods.submit.call(this, option);
				});
				$('.QFPrint').click(function(){
					window.print();
				});

				//CSS
				if(!isMobile.any()){
					if(document.createStyleSheet){
						document.createStyleSheet(mySettings[27])
					} else {
						$("<link/>", {
						   rel: "stylesheet",
						   type: "text/css",
						   href: mySettings[27]
						}).appendTo("head");
					}
					$this.css({'position': 'relative', 'margin': '0px auto 0', 'width': mySettings[7]});
					$('#QFButtons').css({'height': '50px', 'width': mySettings[7], 'margin-top': '30px'});
					$('#QFPrev').css({'float': 'left', 'display': 'none'});
					$('#QFNext').css({'float': 'right'});
					$('#QFSubmit').css({'float': 'right', 'display': 'none'});
					$('.QFPrint').css({'float': 'right', 'z-index': '100'});
					if(mySettings[14] == false){
						$('.QFPage').css({'height': mySettings[8], 'width': mySettings[7]});
					} else {
						$('.QFPage').css({'min-height': mySettings[8], 'width': mySettings[7]});
					}
				} else {
					if(document.createStyleSheet){
						document.createStyleSheet(mySettings[26])
					} else {
						$("<link/>", {
						   rel: "stylesheet",
						   type: "text/css",
						   href: mySettings[26]
						}).appendTo("head");
					}
					$this.css({'position': 'relative', 'margin': '0px auto 0', 'width': mySettings[24]});
					$('#QFButtons').css({'height': '50px', 'width': mySettings[24], 'margin-top': '30px'});
					$('#QFPrev').css({'float': 'left', 'display': 'none'});
					$('#QFNext').css({'float': 'right'});
					$('#QFSubmit').css({'float': 'right', 'display': 'none'});
					$('.QFPrint').css({'float': 'right', 'z-index': '100'});
					$('.QFPage').css({'height': mySettings[25], 'width': mySettings[24]});
				}
			});
		},
		next: function( option ){
			var settingsExt = $.extend(methods.settings, option);
			var mySettings = $.map(settingsExt, function(key, value){ return key; });
			if($('.QFActive').hasClass('firstPage')){
				if($('.QFActive').find('.QFvalidate').length){
					$('.QFActive').find('.QFvalidate').addClass('testValidate');
					$('.testValidate').each(function(){
						if($(this).val() == ''){
							$(this).addClass('QFvalidateError');
							$(this).effect("pulsate", { times: 5 }, 100);
							$(this).addClass('validateFail');
						}
					});
					if(!$('.QFActive').find('.QFvalidate').hasClass('validateFail')){
						if(!$('.QFActive').hasClass('lastPage')){
							if(mySettings[19] == true){
								var myTitle = $('.QFActive').attr('title');
								var labels = $('.QFActive').find('label');
								var QFTable = $('.QFActive').find('.QFTable');
								labels.each(function(){
									if($(this).attr('type') == 'radio'){
										if($(this).is(':checked')){
											var myID = $(this).attr('for');
										}
									} else {
										var myID = $(this).attr('for');
									}
									$('.' + myID).each(function(){
										if($(this).attr('type') == 'radio' && $(this).is(':checked')){
											var myVal = $(this).val();
											if($('#' + myID + '1').is(':empty')){
												$('#' + myID + '1').text(myVal);
											} else {
												var currentTxt = $('#' + myID + '1').text();
												$('#' + myID + '1').text(currentTxt + ' ' + myVal);
											}
										}
										if($(this).attr('type') == 'checkbox' && $(this).is(':checked')){
											var myVal = $(this).val();
											if($('#' + myID + '1').is(':empty')){
												$('#' + myID + '1').text(myVal);
											} else {
												var currentTxt = $('#' + myID + '1').text();
												$('#' + myID + '1').text(currentTxt + ' ' + myVal);
											}
										}
										if($(this).attr('type') != 'radio' && $(this).attr('type') != 'checkbox'){
											var myVal = $(this).val();
											if($('#' + myID + '1').is(':empty')){
												$('#' + myID + '1').text(myVal);
											} else {
												var currentTxt = $('#' + myID + '1').text();
												$('#' + myID + '1').text(currentTxt + ' ' + myVal);
											}
										}
									});
								});
								if(QFTable.length){
									var clone = QFTable.clone();
									if($('.reportTable').length){
										$('.reportTable').each(function(){
											var h1 = $(this).find('h1').text();
											if(h1 == myTitle){
												$(this).after(clone.removeClass().addClass('repSubTable currentSubTable'));
												var curInput = $('.currentSubTable').find('input');
												curInput.each(function(){
													var val = $(this).val();
													$(this).after('<p>' + val + '</p>');
													$(this).remove();
												});
											}
										});
									}
								}
							}
							var pageCount = parseInt($('.QFbreadcrumbs').text()) + 1;
							$('#QFPrev').show('fade', {}, mySettings[9]);
							$('.QFActive').removeClass('QFActive').hide('fade', {}, mySettings[9]).next('.QFPage').delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
							$('.menuActive').removeClass('menuActive').next('.QFMenu').addClass('menuActive');
							$('.QFbreadcrumbs').text(pageCount);
							$('.testValidate').removeClass('testValidate');
							if($('.QFActive').hasClass('lastPage')){
								$('#QFNext').hide('fade', {}, mySettings[9]);
								if(mySettings[13] == true){
									$('#QFSubmit').after(mySettings[9]).show('fade', {}, mySettings[9]);
								}
							}
						}
					}
				} else {
					if(!$('.QFActive').hasClass('lastPage')){
						if(mySettings[19] == true){
							var myTitle = $('.QFActive').attr('title');
							var labels = $('.QFActive').find('label');
							var QFTable = $('.QFActive').find('.QFTable');
							labels.each(function(){
								if($(this).attr('type') == 'radio'){
									if($(this).is(':checked')){
										var myID = $(this).attr('for');
									}
								} else {
									var myID = $(this).attr('for');
								}
								$('.' + myID).each(function(){
									if($(this).attr('type') == 'radio' && $(this).is(':checked')){
										var myVal = $(this).val();
										if($('#' + myID + '1').is(':empty')){
											$('#' + myID + '1').text(myVal);
										} else {
											var currentTxt = $('#' + myID + '1').text();
											$('#' + myID + '1').text(currentTxt + ' ' + myVal);
										}
									}
									if($(this).attr('type') == 'checkbox' && $(this).is(':checked')){
										var myVal = $(this).val();
										if($('#' + myID + '1').is(':empty')){
											$('#' + myID + '1').text(myVal);
										} else {
											var currentTxt = $('#' + myID + '1').text();
											$('#' + myID + '1').text(currentTxt + ' ' + myVal);
										}
									}
									if($(this).attr('type') != 'radio' && $(this).attr('type') != 'checkbox'){
										var myVal = $(this).val();
										if($('#' + myID + '1').is(':empty')){
											$('#' + myID + '1').text(myVal);
										} else {
											var currentTxt = $('#' + myID + '1').text();
											$('#' + myID + '1').text(currentTxt + ' ' + myVal);
										}
									}
								});
							});
							if(QFTable.length){
								var clone = QFTable.clone();
								if($('.reportTable').length){
									$('.reportTable').each(function(){
										var h1 = $(this).find('h1').text();
										if(h1 == myTitle){
											$(this).after(clone.removeClass().addClass('repSubTable currentSubTable'));
											var curInput = $('.currentSubTable').find('input');
											curInput.each(function(){
												var val = $(this).val();
												$(this).after('<p>' + val + '</p>');
												$(this).remove();
											});
										}
									});
								}
							}
						}
						var pageCount = parseInt($('.QFbreadcrumbs').text()) + 1;
						$('#QFPrev').show('fade', {}, mySettings[9]);
						$('.QFActive').hide('fade', {}, mySettings[9]).removeClass('QFActive').next('.QFPage').delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
						$('.menuActive').removeClass('menuActive').next('.QFMenu').addClass('menuActive');
						$('.QFbreadcrumbs').text(pageCount);
						if($('.QFActive').hasClass('lastPage')){
							$('#QFNext').hide('fade', {}, mySettings[9]);
							if(mySettings[13] == true){
								$('#QFSubmit').after(mySettings[9]).show('fade', {}, mySettings[9]);
							}
						}
					}
				}
			} else {
				if($('.QFActive').find('.QFvalidate').length){
					$('.QFActive').find('.QFvalidate').addClass('testValidate');
					$('.testValidate').each(function(){
						if($(this).val() == ''){
							$(this).addClass('QFvalidateError');
							$(this).effect("pulsate", { times: 5 }, 100);
							$(this).addClass('validateFail');
						}
					});
					if(!$('.QFActive').find('.QFvalidate').hasClass('validateFail')){
						if(!$('.QFActive').hasClass('lastPage')){
							if(mySettings[19] == true){
								var myTitle = $('.QFActive').attr('title');
								var labels = $('.QFActive').find('label');
								var QFTable = $('.QFActive').find('.QFTable');
								labels.each(function(){
									if($(this).attr('type') == 'radio'){
										if($(this).is(':checked')){
											var myID = $(this).attr('for');
										}
									} else {
										var myID = $(this).attr('for');
									}
									$('.' + myID).each(function(){
										if($(this).attr('type') == 'radio' && $(this).is(':checked')){
											var myVal = $(this).val();
											if($('#' + myID + '1').is(':empty')){
												$('#' + myID + '1').text(myVal);
											} else {
												var currentTxt = $('#' + myID + '1').text();
												$('#' + myID + '1').text(currentTxt + ' ' + myVal);
											}
										}
										if($(this).attr('type') == 'checkbox' && $(this).is(':checked')){
											var myVal = $(this).val();
											if($('#' + myID + '1').is(':empty')){
												$('#' + myID + '1').text(myVal);
											} else {
												var currentTxt = $('#' + myID + '1').text();
												$('#' + myID + '1').text(currentTxt + ' ' + myVal);
											}
										}
										if($(this).attr('type') != 'radio' && $(this).attr('type') != 'checkbox'){
											var myVal = $(this).val();
											if($('#' + myID + '1').is(':empty')){
												$('#' + myID + '1').text(myVal);
											} else {
												var currentTxt = $('#' + myID + '1').text();
												$('#' + myID + '1').text(currentTxt + ' ' + myVal);
											}
										}
									});
								});
								if(QFTable.length){
									var clone = QFTable.clone();
									if($('.reportTable').length){
										$('.reportTable').each(function(){
											var h1 = $(this).find('h1').text();
											if(h1 == myTitle){
												$(this).after(clone.removeClass().addClass('repSubTable currentSubTable'));
												var curInput = $('.currentSubTable').find('input');
												curInput.each(function(){
													var val = $(this).val();
													$(this).after('<p>' + val + '</p>');
													$(this).remove();
												});
											}
										});
									}
								}
							}
							var pageCount = parseInt($('.QFbreadcrumbs').text()) + 1;
							$('.QFActive').removeClass('QFActive').hide('fade', {}, mySettings[9]).next('.QFPage').delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
							$('.menuActive').removeClass('menuActive').next('.QFMenu').addClass('menuActive');
							$('.QFbreadcrumbs').text(pageCount);
							$('.testValidate').removeClass('testValidate');
							if($('.QFActive').hasClass('lastPage')){
								$('#QFNext').hide('fade', {}, mySettings[9]);
								if(mySettings[13] == true){
									$('#QFSubmit').delay(mySettings[9]).show('fade', {}, mySettings[9]);
								}
							}
						}
					}
				} else {
					if(!$('.QFActive').hasClass('lastPage')){
						if(mySettings[19] == true){
							var myTitle = $('.QFActive').attr('title');
							var labels = $('.QFActive').find('label');
							var QFTable = $('.QFActive').find('.QFTable');
							labels.each(function(){
								if($(this).attr('type') == 'radio'){
									if($(this).is(':checked')){
										var myID = $(this).attr('for');
									}
								} else {
									var myID = $(this).attr('for');
								}
								$('.' + myID).each(function(){
									if($(this).attr('type') == 'radio' && $(this).is(':checked')){
										var myVal = $(this).val();
										if($('#' + myID + '1').is(':empty')){
											$('#' + myID + '1').text(myVal);
										} else {
											var currentTxt = $('#' + myID + '1').text();
											$('#' + myID + '1').text(currentTxt + ' ' + myVal);
										}
									}
									if($(this).attr('type') == 'checkbox' && $(this).is(':checked')){
										var myVal = $(this).val();
										if($('#' + myID + '1').is(':empty')){
											$('#' + myID + '1').text(myVal);
										} else {
											var currentTxt = $('#' + myID + '1').text();
											$('#' + myID + '1').text(currentTxt + ' ' + myVal);
										}
									}
									if($(this).attr('type') != 'radio' && $(this).attr('type') != 'checkbox'){
										var myVal = $(this).val();
										if($('#' + myID + '1').is(':empty')){
											$('#' + myID + '1').text(myVal);
										} else {
											var currentTxt = $('#' + myID + '1').text();
											$('#' + myID + '1').text(currentTxt + ' ' + myVal);
										}
									}
								});
							});
							if(QFTable.length){
								var clone = QFTable.clone();
								if($('.reportTable').length){
									$('.reportTable').each(function(){
										var h1 = $(this).find('h1').text();
										if(h1 == myTitle){
											$(this).after(clone.removeClass().addClass('repSubTable currentSubTable'));
											var curInput = $('.currentSubTable').find('input');
											curInput.each(function(){
												var val = $(this).val();
												$(this).after('<p>' + val + '</p>');
												$(this).remove();
											});
										}
									});
								}
							}
						}
						var pageCount = parseInt($('.QFbreadcrumbs').text()) + 1;
						$('.QFActive').removeClass('QFActive').hide('fade', {}, mySettings[9]).next('.QFPage').delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
						$('.menuActive').removeClass('menuActive').next('.QFMenu').addClass('menuActive');
						$('.QFbreadcrumbs').text(pageCount);
						if($('.QFActive').hasClass('lastPage')){
							$('#QFNext').hide('fade', {}, mySettings[9]);
							if(mySettings[13] == true){
								$('#QFSubmit').delay(mySettings[9]).show('fade', {}, mySettings[9]);
							}
						}
					}
				}
			}
		},
		prev: function( option ){
			var settingsExt = $.extend(methods.settings, option);
			var mySettings = $.map(settingsExt, function(key, value){ return key; });
			if($('.QFActive').hasClass('lastPage')){
				var pageCount = parseInt($('.QFbreadcrumbs').text()) - 1;
				if(mySettings[13] == true){
					$('#QFSubmit').hide('fade', {}, mySettings[9]);
				}
				$('#QFNext').delay(mySettings[9]).show('fade', {}, mySettings[9]);
				$('.QFActive').removeClass('QFActive').hide('fade', {}, mySettings[9]).prev('.QFPage').delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
				$('.menuActive').removeClass('menuActive').prev('.QFMenu').addClass('menuActive');
				$('.QFbreadcrumbs').text(pageCount);
				if(mySettings[19] == true){
					var labels = $('.QFActive').find('label');
					labels.each(function(){
						var myID = $(this).attr('for');
						$('#' + myID + '1').text('');
					});
				}
			} else {
				if(!$('.QFActive').hasClass('firstPage')){
					var pageCount = parseInt($('.QFbreadcrumbs').text()) - 1;
					$('.QFActive').removeClass('QFActive').hide('fade', {}, mySettings[9]).prev('.QFPage').delay(mySettings[9]).show('fade', {}, mySettings[9]).addClass('QFActive');
					$('.menuActive').removeClass('menuActive').prev('.QFMenu').addClass('menuActive');
					$('.QFbreadcrumbs').text(pageCount);
					if($('.QFActive').hasClass('firstPage')){
						$('#QFPrev').hide('fade', {}, mySettings[9]);
					}
				}
				if(mySettings[19] == true){
					var labels = $('.QFActive').find('label');
					labels.each(function(){
						var myID = $(this).attr('for');
						$('#' + myID + '1').text('');
					});
				}
			}
		},
		recall: function( option ){
			var settingsExt = $.extend(methods.settings, option);
			var mySettings = $.map(settingsExt, function(key, value){ return key; });
			var $this = $(this);
			var subPage = $this.find('.QFsubPage');
			subPage.each(function(){
				var clones = $(this).children().clone();
				var q = $(this).attr('title');
				$(this).empty();
				if($(this).hasClass('checkedYes')){
					$(this).append('<label for="QFsubPageRadio">' + q + ' </label><input type="radio" name="QFsubPageRadio" class="QFsubPageRadio radioNo" value="no" />' + mySettings[14] + '<input type="radio" name="QFsubPageRadio" class="QFsubPageRadio radioYes" value="yes" />' + mySettings[15] + '<br /><br />');
					$(this).append('<div class="QFsubPageContent"></div>');
					$(this).find('.QFsubPageContent').append(clones);
				} else {
					$(this).append('<label for="QFsubPageRadio">' + q + ' </label><input type="radio" name="QFsubPageRadio" class="QFsubPageRadio radioNo" value="no" />' + mySettings[14] + '<input type="radio" name="QFsubPageRadio" class="QFsubPageRadio radioYes" value="yes" />' + mySettings[15] + '<br /><br />');
					$(this).append('<div class="QFsubPageContent"></div>');
					$(this).find('.QFsubPageContent').css('display', 'none').append(clones);
				}
			});
			var radios = $this.find('.QFsubPageRadio');
			$.each(radios, function(index, value){
				if(index%2 == 0){
					$(this).attr('name', 'QFsubPageRadio' + index);
				} else {
					$(this).attr('name', 'QFsubPageRadio' + parseInt(index - 1));
				}
			});
			subPage.each(function(){
				if($(this).hasClass('checkedYes')){
					$(this).find('.radioYes').attr('checked', 'checked');
				} else {
					$(this).find('.radioNo').attr('checked', 'checked');
				}
			});
			
			$('.QFsubPageRadio').change(function(){
				var $this = $(this);
				var parent = $this.parent();
				if($this.val() == 'yes'){
					parent.find('.QFsubPageContent').show('fade', {}, 500);
				} else {
					parent.find('.QFsubPageContent').hide('fade', {}, 500);
				}
			});
		},
		submit: function( option ){
			var settingsExt = $.extend(methods.settings, option);
			var mySettings = $.map(settingsExt, function(key, value){ return key; });
			if(mySettings[10] == 'thisForm'){
				if($('.QFActive').find('.QFvalidate')){
					$('.QFActive').find('.QFvalidate').addClass('testValidate');
					$('.testValidate').each(function(){
						if($(this).val() == ''){
							$(this).addClass('QFvalidateError');
							$(this).effect("pulsate", { times: 5 }, 100);
							$(this).addClass('validateFail');
						}
					});
					if(!$('.QFActive').find('.QFvalidate').hasClass('validateFail')){
						var form = $(this).parents('form')[0];
						$(form).submit();
					}
				} else {
					var form = $(this).parents('form')[0];
					$(form).submit();
				}
			} else if(mySettings[10] == 'notesForm'){
				if($('.QFActive').find('.QFvalidate')){
					$('.QFActive').find('.QFvalidate').addClass('testValidate');
					$('.testValidate').each(function(){
						if($(this).val() == ''){
							$(this).addClass('QFvalidateError');
							$(this).effect("pulsate", { times: 5 }, 100);
							$(this).addClass('validateFail');
						}
					});
					if(!$('.QFActive').find('.QFvalidate').hasClass('validateFail')){
						$('#LNSubmit').trigger('click');
					}
				} else {
					$('#LNSubmit').trigger('click');
				}
			} else {
				if($('.QFActive').find('.QFvalidate')){
					$('.QFActive').find('.QFvalidate').addClass('testValidate');
					$('.testValidate').each(function(){
						if($(this).val() == ''){
							$(this).addClass('QFvalidateError');
							$(this).effect("pulsate", { times: 5 }, 100);
							$(this).addClass('validateFail');
						}
					});
					if(!$('.QFActive').find('.QFvalidate').hasClass('validateFail')){
						var form = mySettings[10];
						$(form).submit();
					}
				} else {
					var form = mySettings[10];
					$(form).submit();
				}
			}
		},
		print : function(){
			window.print() 
		}
	};
	
	$.fn.quickForm = function(method){
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.quickForm()' );
		}
	}
})( jQuery );