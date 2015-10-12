/*--------------------------------------------OnDocumentLoad----------------------------------------------------*/
$(function() { 
	
	topicsDS.read();
	
	slider = $("#slider").kendoSlider({
		increaseButtonTitle: "Right",
	    decreaseButtonTitle: "Left",
	    value: zoom,
	    min: 1,
	    max: 10,
	    smallStep: 1,
	    largeStep: 1,
	    showButtons: false,
	    tickPlacement: "none",
	    change: function(e){
		    
			$(".box").css({
			   'width': e.value+5+'vw' 
		    });
		    
		    zoom = e.value;
			clearSearchResults();
			shotDS.query({
			  pageSize: 500,
			  page: page,
			  filter: {
			  	logic: "or",
			  	filters: [
			  		{ field: "video", operator: "eq", value: video },
			  		{
			  			field: "shot",
			  			operator: "zoom",
			  			value: zoom
			  		}
			  	]
			  }
			})
		    
			
		    
		    if( slider.value() < 6 ){
			    $(".box").kendoTooltip({
				    filter: "img",
					content: kendo.template($("#image_preview").html()),
					show: function(e){
					    //console.log(e);
					},
					position: "top"
				});    
	        }
	        else{
		        //$(".box").data("kendoTooltip").destroy();
	        }
		    
		    if( $( ".container" ).children().hasClass( "opened" ) ){
				$('html, body').animate({
			    	scrollTop: $(".opened").offset().top-$('.top').height()
			    }, 200);
			    opensesame();
		    }
	    },
	    slide: function(e){
			$(".box").css({
			   'width': e.value+5+'vw' 
		    });
	    }
	}).data("kendoSlider");
	
	videoSlider = $(".videoSlider").kendoSlider({
        orientation: "vertical",
        min: 1,
        max: 243,
        smallStep: 1,
        largeStep: 20,
        showButtons: false,
        tickPlacement: "none",
        tooltip: {
	        template: kendo.template("Video #= Math.abs(value - 244) #")
        },
        change: function(e){
	        loadOnScrollMode = true;
	        video = Math.abs( e.value - 244 );
	    	$(".nav_video").html("Video: "+ video);
			$(".magnifier").animate({
		        "bottom": parseInt( $(".timeline .k-slider-selection").css("height").replace("px","") )+window.innerHeight*0.08+"px"
	        });
	        
	        clearSearchResults();
			shotDS.query({
				filter: {
					logic: "or",
					filters: [
						{ field: "video", operator: "eq", value: video },
						{
							field: "shot",
							operator: "zoom",
							value: zoom 
					    }
					]
				},
				pageSize: 500,
				page: page
			});
	        console.log(ds);
        },
        slide: function(e){      
	        
        }
    }).data("kendoSlider");

$('#fileupload').fileupload({
        url: livesite+"api/"+apiVersion+"/upload/",
        dataType: 'json',
        done: function (e, data) {
        	//console.log(data.result.files);
			$(".basket").animate({bottom: '0px'});
			//$(".uploadedImages").append("<img class='thumbnail' src='camera_shots/"+data.result.files[0].name+"'>");
			
			$(".uploadedImages").append("<div class='upbox'><span class='deleteMe'><i class='fa fa-times'></i></span><img class='thumbnail' src='camera_shots/"+data.result.files[0].name+"'><a class='colorbox zoomer' data-dir='../../camera_shots/' data-name="+data.result.files[0].name+" href='camera_shots/"+data.result.files[0].name+"' ><svg x='0' y='0' width='24px' height='24px' viewBox='0 0 24 24' aria-label='Open' role='button' tabindex='0' title='Open' jsaction='click:eQuaEb'><path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' fill='rgba(255, 255, 255, 1)' stroke='none'></path><path d='M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z' fill='rgba(255, 255, 255, 1)' stroke='none'></path></svg></a></div>");
			
			$(".files").html('');
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo('#files');
            });
            
            init();
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        }
}).prop('disabled', !$.support.fileInput)
.parent().addClass($.support.fileInput ? undefined : 'disabled');

conceptSelect = $("#search").kendoMultiSelect({
	dataSource: {
		type: "json",
    	transport: {
        	read: livesite+"api/"+apiVersion+"/trec2015/distinct/concepts"
        }
    },
    filter: "contains",
    change: function(e){
		loadOnScrollMode = true;
		terms = conceptSelect.value();
		conceptFilter = new Array();
		for (i = 0; i < terms.length; i++) { 
			   	var sortItem = { field: terms[i], dir: "desc" };
			    conceptFilter[i] = sortItem;
			}
			
			clearSearchResults();
			if(terms.length>0){
				ds = conceptDS;
				ds.query({
					sort: conceptFilter,
					pageSize: 500,
					page: page
				});	
			}
			else{
				ds = shotDS;
				ds.query({
					pageSize: 500,
					page: page
				});	
			}
			
    },
    
}).data("kendoMultiSelect");


var algorithms = [
    { text: "Algorithm 1", value: "1" },
    { text: "Algorithm 2", value: "2" },
    { text: "Algorithm 3", value: "3" }
];

algorithm = $("#selectAlgorithm").kendoDropDownList({
	dataTextField: "text",
    dataValueField: "value",
	dataSource: algorithms,
    index: 2,
    change: function(){
	    
	    if( algorithm.value() == 1 ){
		     indexPath = [
				"D:/TomCatServices/IndexingService/index/"
			];
	    }
	    else if( algorithm.value() ==2 ){
		    indexPath = [
				"D:/TomCatServices/IndexingService/salSift100k_index/"
			];
	    }
	    else {
		    indexPath = [
				"D:/TomCatServices/IndexingService/index/",
				"D:/TomCatServices/IndexingService/salSift100k_index/"
			];
			
			desc = "sss";
	    }
    }
}).data("kendoDropDownList");

/*
$(".emenu").kendoTooltip({
	//filter: "a",
    //content: kendo.template($("#template").html()),
    content: "Hello!",
    autoHide: false,
    showOn: "click",
    show: function(e){
	    this.popup.element.addClass("whiteToolTip");
    },
    width: 200,
    height: 400,
    position: "bottom"
});
*/


/********************************* Endless scrolling ******************************************/
$document.on('click','#loadmore', onScroll);
$document.on('scroll', onScroll);
function onScroll(event) {
/*
	$(".magnifier").css({
		'top': $window.scrollTop()+'px'
	});
*/	
	//console.log("loadOnScrollMode: "+loadOnScrollMode);
	if (!isLoading && loadOnScrollMode==true ) {//
		var closeToBottom = ($window.scrollTop() + $window.height() > $document.height() - 100);
		var closeToTop = ($window.scrollTop() < 1);
		if(closeToBottom) {
            // Only allow requests every second
            var currentTime = new Date().getTime();
            if (lastRequestTimestamp < currentTime - 2000) {
              lastRequestTimestamp = currentTime;
              page++;

              load = "more";
              loadin();
              
              if( conceptFilter.length > 0 ){
	          	ds.query({
	            	sort: conceptFilter,
					page: page,
					pageSize: 500
			  	});    
              }
              else{
	            if(video!=0){
		        	ds.query({
					  page: page,
					  pageSize: 500,
					  filter: {
						logic: "or",
						filters: [
						  { field: "video", operator: "eq", value: video },
						]
					  }
					});    
	            }
	            else{
		        	ds.query({
					  page: page,
					  pageSize: 500
					});
	            }
	            
              }
              
              
			  
            }
        }
        if(closeToTop && page>1 ) {
/*
            var currentTime = new Date().getTime();
            if (lastRequestTimestamp < currentTime - 2000) {
              lastRequestTimestamp = currentTime;
              page--;
              $("#page").html(page);
              load = "less";
              loadin();
              shotDS.query({
			  	  //sort: conceptFilter,
				  page: page,
				  pageSize: 500
			  });
            }
*/
        }	
	}
}
/********************************* Endless scrolling ******************************************/

$('.container').on('click','#close', function(){
	$('.container').children().removeClass('opened');
	$('.info-bg').slideUp('fast', function(){
		$( ".arrow" ).remove();
	});
});

$(".basket").on('click','.deleteMe',function(){
	$(this).parent().remove();
});

$(".basket").on('click', '.openMe', function(){
	if( $( ".basket" ).css( "bottom" ) == "0px" ){
		$(".basket").animate({bottom: '-180px'});	
	}
	else{
		$(".basket").animate({bottom: '0px'});
	}
});

$(".croppedImages").on('click','.thumbnail',function(){
	$(this).remove();
});

$(".uploadedImages").on('click','.thumbnail',function(){
	//$(this).remove();
});


$(".logo").click(function(){
	location.reload();
});

$(".container").on( "click", ".file_image img" , function(event){
	
	if( $(this).parent().parent().attr('id') == "selectedShotsView"){
		$(this).parent().remove();
		$("#"+$(this).attr('id')).parent().removeClass('selected');
	}
	else{
		if( typeof $(this).data("video") == 'undefined' || typeof $(this).data("shot") == 'undefined' ){
		
			if($(this).parent().hasClass("selected")){
				$(this).parent().removeClass("selected");
				$.ajax({
					url: livesite+"api/"+apiVersion+"/myvideo/"+$(this).attr("id"),
					method: "GET",
					success: function(e){
					  //console.log(e);	  
					  selectedShots.remove( "shot"+e.video+"_"+e.shot );
					  $(".selectedBar").animate({
							top: "60px"
						});
						$(".main").animate({
							top: "60px"
						});
						console.log( selectedShots );
						$("#selected").html( selectedShots.length );
						if(selectedShots.length==0){
							$(".selectedBar").animate({
									top: "-60px"
								});
								
								$(".main").animate({
								top: "0px"
							});
						}
					},
					error: function(e){
						console.log(e);
					}
				  }).done(function() {
					//console.log( selectedShots );
					//$( this ).addClass( "done" );
				  });
			}
			else{
				
				$(this).parent().addClass("selected");
				
				$.ajax({
					url: livesite+"api/"+apiVersion+"/myvideo/"+$(this).attr("id"),
					method: "GET",
					success: function(e){
					  console.log(e);
					  if( $.inArray( "shot"+e.video+"_"+e.shot, selectedShots ) < 0 ){
					  	selectedShots.push( "shot"+e.video+"_"+e.shot );
					  }
					  $(".selectedBar").animate({
							top: "60px"
						});
						$(".main").animate({
							top: "60px"
						});
						console.log( selectedShots );
						$("#selected").html( selectedShots.length );
						if(selectedShots.length==0){
							$(".selectedBar").animate({
									top: "-60px"
								});
								
								$(".main").animate({
								top: "0px"
							});
						}
					},
					error: function(e){
						console.log(e);
					}
				  }).done(function() {
					//console.log( selectedShots );
					//$( this ).addClass( "done" );
				  });
			}
			
	 	}else{
			$(this).parent().addClass("selected");
			
			$( "#"+$(this).attr('id') ).parent().addClass("selected");
			
			if( $( "#"+$(this).attr('id') ).parent().hasClass('box') ){
				$( "#"+$(this).attr('id') ).parent().clone().appendTo( "#selectedShotsView" );	
			}
			else{
				
				//$( "#"+$(this).attr('id') ).parent().clone().appendTo( "#selectedShotsView" );
			}
			
			
		 	
			if( $.inArray( "shot"+$(this).data("video")+"_"+$(this).data("shot"), selectedShots ) < 0 ){
				selectedShots.push( "shot"+$(this).data("video")+"_"+$(this).data("shot") );
			}
			$(".selectedBar").animate({
				top: "60px"
			});
			$(".main").animate({
				top: "60px"
			});
			
			$("#selected").html( selectedShots.length );
			if(selectedShots.length==0){
				$(".selectedBar").animate({
						top: "-60px"
					});
					
					$(".main").animate({
					top: "0px"
				});
			}	
		}
		
	}
	
});

$("#selectedSwitcher").click(function(){
	
	$('.info-bg').slideUp('fast', function(){
		$( ".arrow" ).remove();
		$('.container').children().removeClass('opened');
	});
	
	if($("#selectedSwitcher").hasClass("selected")){
		$("#selectedSwitcher").removeClass("selected");
		
		$("#selectedShotsView").hide();
		$("#videoListView").fadeIn();
		$("#loadmore").fadeIn();
	}
	else{
		$("#selectedSwitcher").addClass("selected");
		
		$("#selectedShotsView").fadeIn();
		$("#videoListView").hide();
		$("#loadmore").hide();
	}
	
});

$(".container").on( "click", ".selected img" , function(event){
	$(this).parent().removeClass("selected");
	selectedShots.remove( "shot"+$(this).data("video")+"_"+$(this).data("shot") );
	
	//console.log( selectedShots );
	
	$("#selected").html( selectedShots.length );
	if(selectedShots.length==0){
		$(".selectedBar").animate({
				top: "-60px"
			});
			
			$(".main").animate({
			top: "0px"
		});
	}
	
});

$('.selectedBar').on("click", "#submit", function(){
	
	console.log(selectedShots);
/*
	$.ajax({
		url: livesite+"api/"+apiVersion+"/results",
		method: "POST",
		data: {
			algorithm: algorithm.value(),
			user: user,
			topicNum: $(".selectedTopic").data("num"),
			elapsedTime: $('.countdownTime').countdown('getTimes')[5]*60+$('.countdownTime').countdown('getTimes')[6],
			shots: selectedShots
		},
		success: function(e){
		  console.log(e);
		},
		error: function(e){
			console.log(e);
		}
	}).done(function() {
		
		selectedShots = Array();
		alert("Results for topic "+$(".selectedTopic").data("num")+" submitted successfully!");
		$(".selectedBar").animate({
			top: "-60px"
		});
				
		$(".main").animate({
			top: "0px"
		});
		
		$(".container").children().removeClass('selected');
		$(".shots").children().removeClass('selected');
		
	});
*/
		
});

$(".selectedBar").on( "click", ".btn-danger", function(){
	selectedShots = Array();
	$("#selectedShotsView").html("");
	
	$(".selectedBar").animate({
		top: "-60px"
	});
			
	$(".main").animate({
		top: "0px"
	});
	
	$(".container").children().removeClass('selected');
	$(".shots").children().removeClass('selected');
});


$(".container").on( "click", ".box .sesame" , function(event){
	if($(this).parent().hasClass('opened')){
		$('.container').children().removeClass('opened');
		$('.info-bg').slideUp('fast', function(){
			$( ".arrow" ).remove();
		});
	}
	else{
		$('.container').children().removeClass('opened');
		$( ".arrow" ).remove();
		$(this).parent().addClass('opened');
		
		opensesame($(this).parent().parent().attr('id'));
	}
});


$(".navigation").on( "click", ".topic", function(event){
	
	loadEffect(time);
	$('.countdownTime').countdown('destroy');
	$('.countdownTime').countdown({until: +time, layout: ' {mn} \' {sn}" '});
	//Auto Submit!!
	setTimeout(function(){ 
		alert("The selected shots submitted automatically! Thanks for your participation!");
		$("#submit").trigger("click");
	}, +time*1000-1);
	
	$(".topic").removeClass("selectedTopic");
	$(this).addClass("selectedTopic");
	
	topicNum = $(this).data("num");
	
	topicDS = new kendo.data.DataSource({
	    transport: {
	    	read: {
	        	url: livesite+"api/"+apiVersion+"/trec2015/topics",
	            type: "GET",
	            complete: function(e){
		            //console.log(e);
	            }
	        }
	    },
	    serverSorting: true,
	    serverFiltering: true,
	    filter: {
		    logic: "or",
		    filters: [
		      { field: "num", operator: "eq", value: topicNum },
		    ]
		},
	    serverPaging: true,
	    pageSize: 500,
	    page:page,
	    schema: {
	    	total: "total",
	        data: "data",
	        model: {
	        	id: "id",
				fields: {
	            	id: {validation: { required: false}}
	        	}
	        }
	    },
	    requestEnd: function(e){
		    
	  	},
	    change: function(e){
		    
			//console.log(e.items);
			  
			$(".basket").animate({bottom: '0px'});
			$(".uploadedImages").html("");
			$.each(e.items[0].images, function (index, file) {
                
                src = "http://mklab-services.iti.gr/trec2015/topics2015/tv15.ins.example.images_resized/"+$(this)[0].src;
                roi = "http://mklab-services.iti.gr/trec2015/topics2015/masked/"+$(this)[0].roi;
                
                $(".uploadedImages").append("<div class='upbox'><span class='deleteMe'><i class='fa fa-times'></i></span><img class='thumbnail' src='"+src+"'><a class='colorbox zoomer' data-name='"+$(this)[0].src+"' data-dir='../../topics2015/tv15.ins.example.images_resized/' href='http://mklab-services.iti.gr/trec2015_v1/"+src+"' ><svg x='0' y='0' width='24px' height='24px' viewBox='0 0 24 24' aria-label='Open' role='button' tabindex='0' title='Open' jsaction='click:eQuaEb'><path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' fill='rgba(255, 255, 255, 1)' stroke='none'></path><path d='M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z' fill='rgba(255, 255, 255, 1)' stroke='none'></path></svg></a></div>");
                
                $(".uploadedImages").append("<div class='upbox'><span class='deleteMe'><i class='fa fa-times'></i></span><img class='thumbnail' src='"+roi+"'><a class='colorbox zoomer' data-name='"+$(this)[0].roi+"' data-dir='../../topics2015/masked/' href='http://mklab-services.iti.gr/trec2015_v1/"+roi+"' ><svg x='0' y='0' width='24px' height='24px' viewBox='0 0 24 24' aria-label='Open' role='button' tabindex='0' title='Open' jsaction='click:eQuaEb'><path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' fill='rgba(255, 255, 255, 1)' stroke='none'></path><path d='M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z' fill='rgba(255, 255, 255, 1)' stroke='none'></path></svg></a></div>");
                
                
            });
            	
            init();
			  			    
	    }
	});
	topicDS.read();
	
});

});//on document load 

//conceptDS.read();
shotDS.read();
//scenesDS.read();
//router.start();
//router.navigate("/items/books/59");

function init(){
	
	$(".file_image").kendoDraggable({
		hint: function(element) {
			return element.clone();
		},
		dragstart: function(e) {
			$(".basket").animate({bottom: '0px'});
			//$("#droptarget").fadeIn();
		},
		dragend: function(e) {
			$(".basket").animate({bottom: '-180px'});
		    //$("#droptarget").fadeOut();
		}
	});
	
	$(".colorbox").colorbox({
		rel:'scene',
		fixed: 'true'
	});
			
	//$(".box img").colorbox({rel: "scene"});
	
	
}



/*--------------------------------------------OnDocumentLoad----------------------------------------------------*/